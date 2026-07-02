import type { GraphQLResponse } from "../../types"
import type { AiCeilSurface } from "../../mutations/types/set-ai-ceil"

/** One AI credit charge row in the usage history. */
export interface QueryMyCreditUsageHistoryItem {
    /** Charge row id. */
    id: string
    /** AI lane billed (auto / premium / byok). */
    mode: string
    /** Premium tier billed (low / medium / high); null for auto / byok. */
    recommendation: string | null
    /** Concrete model billed (e.g. gpt-5-mini); null for the free Auto lane. */
    model: string | null
    /** Provider of the billed model (gemini / openai); null for the free Auto lane. */
    provider: string | null
    /** Credits charged for this run. */
    credits: number
    /** ISO time the charge was recorded. */
    createdAt: string
    /** AI surface (chatbot / grading / interview) that triggered this charge; null for rows recorded before this column existed. */
    surface: AiCeilSurface | null
}

/** Payload inside `myCreditUsageHistory.data` after the standard API wrapper. */
export interface QueryMyCreditUsageHistoryResponseData {
    /** Charge rows for the requested page, newest first. */
    items: Array<QueryMyCreditUsageHistoryItem>
    /** Total number of charge rows for the user (across all pages). */
    total: number
}

/** Apollo response shape for the `myCreditUsageHistory` query. */
export interface QueryMyCreditUsageHistoryResponse {
    /** Top-level `myCreditUsageHistory` field wrapping the standard API response. */
    myCreditUsageHistory: GraphQLResponse<QueryMyCreditUsageHistoryResponseData>
}
