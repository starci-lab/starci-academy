import type { GraphQLResponse } from "../../types"

/** The weekly KPIs a learner can set a target for (mirrors BE `KpiKey`). */
export type KpiKey =
    | "lessons"
    | "studyDays"
    | "challenges"
    | "coding"
    | "flashcards"
    | "milestones"

/** One weekly KPI: current-week value vs the user's target, plus its coin reward + claim state. */
export interface QueryKpiItemData {
    /** Which KPI this row is. */
    key: KpiKey
    /** The current-week (resets Monday 8am GMT+7) value. */
    current: number
    /** The user's weekly target; null when none set. */
    target: number | null
    /** Coin reward for claiming this KPI this week; null when no target is set. */
    coinReward: number | null
    /** Whether this KPI's reward was already claimed this week. */
    claimed: boolean
    /** Whether this KPI's reward can be claimed right now (met + not yet claimed). */
    canClaim: boolean
}

/** Composite weekly KPI score across the KPIs that have a target. */
export interface QueryKpiCompositeData {
    /** Average completion across targeted KPIs, 0–100. */
    percent: number
    /** Number of targeted KPIs already met (current >= target). */
    completed: number
    /** Number of KPIs that have a target set. */
    total: number
}

/** The viewer's weekly KPIs (per-KPI progress + composite score). */
export interface QueryMyKpisData {
    /** Every weekly KPI with its current value and target. */
    items: Array<QueryKpiItemData>
    /** Composite score over the KPIs that have a target. */
    composite: QueryKpiCompositeData
    /** ISO timestamp of the next weekly KPI reset (Monday 8am Asia/Ho_Chi_Minh). */
    resetAt: string
}

/** Apollo response shape for the `myKpis` query. */
export interface QueryMyKpisResponse {
    /** Top-level `myKpis` field wrapping the standard API response. */
    myKpis: GraphQLResponse<QueryMyKpisData>
}
