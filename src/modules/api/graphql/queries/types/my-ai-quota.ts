import type { GraphQLResponse } from "../../types"
import type {
    AiMode,
    AiSubTier,
} from "../query-my-ai-settings"

/** Per-window quota for the free Auto lane — counted in "uses". */
export interface QueryMyAiAutoQuotaData {
    /** Max Auto uses allowed in the 5h window. */
    limit5h: number
    /** Auto uses consumed in the current 5h window. */
    used5h: number
    /** Remaining Auto uses in the 5h window. */
    remaining5h: number
    /** Max Auto uses allowed in the weekly window. */
    limitWeek: number
    /** Auto uses consumed in the current weekly window. */
    usedWeek: number
    /** Remaining Auto uses in the weekly window. */
    remainingWeek: number
}

/** Per-window quota for the paid Premium lane — counted in credits. */
export interface QueryMyAiPremiumQuotaData {
    /** Credit cap in the 5h window (0 when no active tier). */
    limit5h: number
    /** Credits consumed in the current 5h window. */
    used5h: number
    /** Remaining credits in the 5h window. */
    remaining5h: number
    /** Credit cap in the weekly window (0 when no active tier). */
    limitWeek: number
    /** Credits consumed in the current weekly window. */
    usedWeek: number
    /** Remaining credits in the weekly window. */
    remainingWeek: number
}

/** Payload inside `myAiQuota.data` after the standard API wrapper. */
export interface QueryMyAiQuotaResponseData {
    /** Natural lane the user is on right now. */
    mode: AiMode
    /** Active paid tier, or null on the free lane. */
    tier: AiSubTier | null
    /** Free Auto-lane (complimentary) quota. */
    auto: QueryMyAiAutoQuotaData
    /** Paid Premium-lane (credit) quota. */
    premium: QueryMyAiPremiumQuotaData
    /** When the 5h window rolls over (counters reset); null when not started. */
    window5hResetAt: string | null
    /** When the weekly window rolls over; null when not started. */
    windowWeekResetAt: string | null
}

/** Apollo response shape for the `myAiQuota` query. */
export interface QueryMyAiQuotaResponse {
    /** Top-level `myAiQuota` field wrapping the standard API response. */
    myAiQuota: GraphQLResponse<QueryMyAiQuotaResponseData>
}
