"use client"

import React from "react"
import { WarningCircleIcon } from "@phosphor-icons/react"
import { cn } from "@heroui/react"
import { useTranslations } from "next-intl"
import type { QueryMyAiQuotaResponseData } from "@/modules/api/graphql/queries/types/my-ai-quota"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link GradeCreditCaption}. */
export interface GradeCreditCaptionProps extends WithClassNames<undefined> {
    /**
     * Unified, TIER-AWARE quota snapshot from `myAiQuota` (free base OR the active
     * tier's cap). Null/undefined while loading → the caption renders NOTHING.
     */
    creditUsage: QueryMyAiQuotaResponseData | null | undefined
    /**
     * True when a concrete model is pinned (vs the Auto lane). Both lanes debit
     * the SAME weekly pool, so the credit line shows either way — this only gates
     * the affordability WARNING (fired for Auto, whose per-run cost is known via
     * `autoCreditCost`; a pinned model's cost isn't known here). Pass `!!selection.model`.
     */
    hasPinnedModel: boolean
    /** Credits per Auto run (`systemConfig.ai.auto.creditCost`) — drives the quota-reached check. */
    autoCreditCost: number | undefined
    /** Optional press → open the AI-quota details modal (makes the caption interactive). */
    onOpenDetails?: () => void
}

/**
 * The ONE shared "còn N/M credit tuần này" caption for every AI surface, sitting
 * directly under (or beside) the model picker. Bound to the PICKER — NOT the CTA
 * button — so it's correct regardless of the button's width. Shows the unified
 * weekly pool for BOTH lanes (Auto AND a pinned model both debit it). Renders a
 * muted line normally, or a `text-danger` warning line (with icon) when the pool
 * can't afford the next AUTO run. Free-lane surfaces (chatbot) don't consume the
 * pool → they simply don't render this.
 *
 * The feature QUERIES `myAiQuota` and passes it in — this block does NOT query
 * (so callers that don't need credit aren't burdened with the request). See
 * `blocks/grading/AI-PICKER-CREDIT-UNIFY-BRAINSTORM.md`.
 *
 * @param props - {@link GradeCreditCaptionProps}
 */
export const GradeCreditCaption = ({
    creditUsage,
    hasPinnedModel,
    autoCreditCost,
    onOpenDetails,
    className,
}: GradeCreditCaptionProps) => {
    const t = useTranslations()

    // no snapshot yet (loading) → render nothing.
    if (!creditUsage) {
        return null
    }

    // BOTH lanes debit the SAME weekly pool — the served model's catalog credit,
    // whether Auto-picked or pinned (a pinned premium model costs MORE, not zero;
    // see BE process-*-complete-step "charge by the model that actually served").
    // So show the pool for both. The affordability WARNING only fires on Auto,
    // where we know the per-run cost (`autoCreditCost`); a pinned model's cost
    // isn't known here, so it shows the usage line without the block check.
    const blocked = !hasPinnedModel
        && autoCreditCost !== undefined
        && (creditUsage.credit.remaining5h < autoCreditCost
            || creditUsage.credit.remainingWeek < autoCreditCost)

    const text = blocked
        ? t("aiCredit.quotaReached")
        : t("aiCredit.usage", {
            remaining: creditUsage.credit.remainingWeek,
            quota: creditUsage.credit.limitWeek,
        })

    const content = (
        <span className={cn(
            "inline-flex items-center gap-1 text-sm",
            blocked ? "font-medium text-danger" : "text-muted",
        )}
        >
            {blocked ? <WarningCircleIcon aria-hidden className="size-4 shrink-0" /> : null}
            {text}
        </span>
    )

    if (onOpenDetails) {
        return (
            <button
                type="button"
                onClick={onOpenDetails}
                className={cn("w-fit cursor-pointer outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-accent", className)}
            >
                {content}
            </button>
        )
    }

    return <span className={cn(className)}>{content}</span>
}
