import dayjs from "dayjs"
import { AiCeilSurface } from "@/modules/api/graphql/mutations/types/set-ai-ceil"
import { AiSubTier } from "@/modules/api/graphql/queries/query-my-ai-settings"
import { AiQuotaTab as RealAiQuotaTab } from "@/redux/slices/tabs"
import type { QueryMyCreditUsageHistoryItem } from "@/modules/api/graphql/queries/types/my-credit-usage-history"
import type {
    AiQuotaHistoryChargeItem,
    AiQuotaHistoryChartPoint,
    AiQuotaHistorySurface,
} from "@/components/blocks/ai/AiQuotaHistoryPanel"
import type { AiQuotaModalTab, AiQuotaTier } from "./component"

/** How many trailing days the usage chart plots — mirrors the source's fixed 7-day window. */
const HISTORY_CHART_DAYS = 7

/**
 * `src`'s `AiSubTier | null` -> the blueprint's own `AiQuotaTier`. Same string
 * values, but the blueprint folds "no tier" into the union itself rather than a
 * separate nullable enum, so the connected file converts explicitly.
 *
 * @param raw - The real quota snapshot's tier, or null on the free lane.
 * @returns The matching blueprint {@link AiQuotaTier}.
 */
export const toAiQuotaTier = (raw: AiSubTier | null): AiQuotaTier => {
    switch (raw) {
    case AiSubTier.Plus:
        return "plus"
    case AiSubTier.Pro:
        return "pro"
    case AiSubTier.Max:
        return "max"
    default:
        return null
    }
}

/**
 * `src`'s `AiQuotaTab` (redux) -> the blueprint's own `AiQuotaModalTab`. Same
 * string values, but distinct TS declarations (enum vs string-literal union),
 * so the connected file converts explicitly rather than casting.
 *
 * @param raw - The redux-stored active tab.
 * @returns The matching blueprint {@link AiQuotaModalTab}.
 */
export const toAiQuotaModalTab = (raw: RealAiQuotaTab): AiQuotaModalTab => {
    switch (raw) {
    case RealAiQuotaTab.Subscription:
        return "subscription"
    case RealAiQuotaTab.History:
        return "history"
    case RealAiQuotaTab.Auto:
    default:
        return "auto"
    }
}

/**
 * The reverse of {@link toAiQuotaModalTab} — the blueprint's tab back to the
 * redux `AiQuotaTab` the `setAiQuotaTab` action expects.
 *
 * @param tab - The blueprint tab the viewer picked.
 * @returns The matching redux {@link RealAiQuotaTab}.
 */
export const toRealAiQuotaTab = (tab: AiQuotaModalTab): RealAiQuotaTab => {
    switch (tab) {
    case "subscription":
        return RealAiQuotaTab.Subscription
    case "history":
        return RealAiQuotaTab.History
    case "auto":
    default:
        return RealAiQuotaTab.Auto
    }
}

/**
 * `src`'s `AiCeilSurface | null` -> the blueprint's own `AiQuotaHistorySurface`.
 * A charge row predating the `surface` column (or from a surface not yet
 * passing it through) falls back to `"grade"`, mirroring the real
 * `HistoryTab`'s `purposeLabel` default.
 *
 * @param surface - The charge row's real surface, or null when unattributed.
 * @returns The matching blueprint {@link AiQuotaHistorySurface}.
 */
export const toAiQuotaHistorySurface = (surface: AiCeilSurface | null): AiQuotaHistorySurface => {
    switch (surface) {
    case AiCeilSurface.Interview:
        return "interview"
    case AiCeilSurface.Chatbot:
        return "chatbot"
    case AiCeilSurface.Grading:
    default:
        return "grade"
    }
}

/**
 * One real credit-usage-history row -> the blueprint's `AiQuotaHistoryChargeItem`.
 *
 * @param item - A row from `myCreditUsageHistory`.
 * @returns The matching blueprint {@link AiQuotaHistoryChargeItem}.
 */
export const toAiQuotaHistoryChargeItem = (item: QueryMyCreditUsageHistoryItem): AiQuotaHistoryChargeItem => ({
    key: item.id,
    model: item.model ?? undefined,
    surface: toAiQuotaHistorySurface(item.surface),
    occurredAt: item.createdAt,
    credits: item.credits,
})

/**
 * Buckets credit-usage-history rows into the trailing 7 day-buckets the usage
 * chart plots — ported from the real `HistoryTab`'s `chartData` memo.
 *
 * @param items - The history rows, or `undefined` before the first load lands.
 * @returns One {@link AiQuotaHistoryChartPoint} per day, oldest first.
 */
export const buildAiQuotaHistoryChartPoints = (
    items: Array<QueryMyCreditUsageHistoryItem> | undefined,
): Array<AiQuotaHistoryChartPoint> => {
    const today = dayjs().startOf("day")
    const buckets = new Map<string, number>()
    for (let offset = HISTORY_CHART_DAYS - 1; offset >= 0; offset--) {
        buckets.set(today.subtract(offset, "day").format("DD/MM"), 0)
    }
    for (const item of items ?? []) {
        const key = dayjs(item.createdAt).startOf("day").format("DD/MM")
        if (buckets.has(key)) {
            buckets.set(key, (buckets.get(key) ?? 0) + item.credits)
        }
    }
    return [...buckets.entries()].map(([day, credits]) => ({ day, credits }))
}
