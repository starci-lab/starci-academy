import type {
    useTranslations,
} from "next-intl"
import type {
    QueryMyAiQuotaResponseData,
} from "@/modules/api/graphql/queries/types/my-ai-quota"
import {
    GradeCreditDisplayKind,
} from "../types/grade-credit-display"
import type {
    GradeCreditDisplay,
} from "../types/grade-credit-display"
import { AiMode } from "@/modules/api/graphql/queries/query-my-ai-settings"

/** Params for {@link resolveGradeCreditDisplay}. */
export interface ResolveGradeCreditDisplayParams {
    /** Grading lane selected for this submission row. */
    mode: AiMode
    /** Unified, TIER-AWARE quota snapshot from `myAiQuota` (free base OR the active
     * tier's cap — `creditAllowance` overrides); omitted when still loading. */
    creditUsage: QueryMyAiQuotaResponseData | undefined
    /** Credits per Auto run from `systemConfig.ai.auto.creditCost` (app.yaml). */
    autoCreditCost: number | undefined
    /** next-intl translator. */
    t: ReturnType<typeof useTranslations>
}

/**
 * Whether the next Auto grading cannot be afforded in either rolling window.
 * @param quota - Tier-aware snapshot from `myAiQuota`.
 * @param autoCreditCost - Cost per run from mounted app config.
 * @returns True when either window has fewer remaining credits than one run.
 */
const isAutoGradingBlocked = (
    quota: QueryMyAiQuotaResponseData,
    autoCreditCost: number,
): boolean => {
    return quota.credit.remaining5h < autoCreditCost
        || quota.credit.remainingWeek < autoCreditCost
}

/**
 * Compact credit label beside the grade picker (usage line or quota-reached).
 * Reads the UNIFIED tier-aware pool (`myAiQuota`), so a paid tier shows its own
 * cap (e.g. Plus 5000/week), not the flat free base.
 * @param params - {@link ResolveGradeCreditDisplayParams}
 * @returns Display model for the submission row.
 */
export const resolveGradeCreditDisplay = ({
    mode,
    creditUsage,
    autoCreditCost,
    t,
}: ResolveGradeCreditDisplayParams): GradeCreditDisplay => {
    if (mode === AiMode.Byok) {
        return {
            kind: GradeCreditDisplayKind.Byok,
            text: t("challenge.quota.laneUsage.byok"),
        }
    }
    if (!creditUsage) {
        return { kind: GradeCreditDisplayKind.Hidden }
    }
    if (
        mode === AiMode.Auto
        && autoCreditCost !== undefined
        && isAutoGradingBlocked(creditUsage, autoCreditCost)
    ) {
        return {
            kind: GradeCreditDisplayKind.QuotaReached,
            text: t("challenge.quota.quotaReached"),
        }
    }
    const key = mode === AiMode.Premium
        ? "challenge.quota.laneUsage.premium"
        : "challenge.quota.laneUsage.auto"
    return {
        kind: GradeCreditDisplayKind.Usage,
        text: t(key, {
            // show what's LEFT (remaining), not what's been used — the learner cares
            // "how many grades can I still run", e.g. 4977/5000 not 23/5000
            remaining: creditUsage.credit.remainingWeek,
            quota: creditUsage.credit.limitWeek,
        }),
    }
}
