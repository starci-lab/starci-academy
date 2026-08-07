"use client"

import React from "react"
import { useTranslations } from "next-intl"
import type { QueryMyAiQuotaResponseData } from "@/modules/api/graphql/queries/types/my-ai-quota"
import { _GradeCreditCaption, type GradeCreditCaptionProps } from "./component"

/** Props the connected {@link GradeCreditCaption} takes from its caller. */
export type GradeCreditCaptionConnectedProps = Omit<GradeCreditCaptionProps, "text" | "blocked"> & {
    /**
     * Unified, TIER-AWARE quota snapshot from `myAiQuota` (free base OR the active
     * tier's cap). Null/undefined while loading → the caption renders NOTHING.
     */
    creditUsage: QueryMyAiQuotaResponseData | null | undefined
    /**
     * True when a concrete model is pinned (vs the Auto lane). Both lanes debit the
     * SAME weekly pool, so the credit line shows either way — this only gates the
     * affordability WARNING (fired for Auto, whose per-run cost is known via
     * `autoCreditCost`; a pinned model's cost isn't known here). Pass `!!selection.model`.
     */
    hasPinnedModel: boolean
    /** Credits per Auto run (`systemConfig.ai.auto.creditCost`) — drives the quota-reached check. */
    autoCreditCost: number | undefined
}

/**
 * The ONE shared credit caption — the CONNECTED half: computes the block/warning
 * reason from `creditUsage` and resolves the caption text via `t()`. See
 * `design/storybook/architecture/split.md`.
 *
 * @param props - {@link GradeCreditCaptionConnectedProps}
 */
export const GradeCreditCaption = ({
    creditUsage,
    hasPinnedModel,
    autoCreditCost,
    onOpenDetails,
}: GradeCreditCaptionConnectedProps) => {
    const t = useTranslations()

    if (!creditUsage) {
        return <_GradeCreditCaption text={null} blocked={false} onOpenDetails={onOpenDetails} />
    }

    // BOTH lanes debit the SAME weekly pool — the served model's catalog credit,
    // whether Auto-picked or pinned. The affordability WARNING only fires on Auto,
    // where we know the per-run cost (`autoCreditCost`); a pinned model's cost
    // isn't known here, so it shows the usage line without the block check.
    const canAffordAuto = autoCreditCost !== undefined
    const blockedByBurst = canAffordAuto && creditUsage.credit.remaining5h < autoCreditCost
    const blockedByWeek = canAffordAuto && creditUsage.credit.remainingWeek < autoCreditCost
    const blocked = !hasPinnedModel && (blockedByBurst || blockedByWeek)

    const text = blocked
        ? t(blockedByWeek ? "aiCredit.quotaReached" : "aiCredit.quotaReachedBurst")
        : t("aiCredit.usage", {
            remaining: creditUsage.credit.remainingWeek,
            quota: creditUsage.credit.limitWeek,
        })

    return (
        <_GradeCreditCaption
            text={text}
            blocked={blocked}
            onOpenDetails={onOpenDetails}
        />
    )
}
