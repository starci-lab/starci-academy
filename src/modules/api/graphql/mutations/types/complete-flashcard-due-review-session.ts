import type { GraphQLResponse } from "../../types"

/**
 * Request body for `completeFlashcardDueReviewSession`. No per-card
 * breakdown and no server-side XP grant (mirrors
 * `CompleteFlashcardReviewSessionRequest`) — `reviewFlashcard` grants no XP
 * today, so `xpEarned` here is purely a client-reported bookkeeping snapshot
 * persisted for history/stats display.
 */
export interface CompleteFlashcardDueReviewSessionRequest {
    /** Session id — the server-issued id from `startFlashcardDueReviewSession`. */
    sessionId: string
    /** Final reviewed-card count to snapshot onto the row. */
    reviewedCount: number
    /** Final XP bookkeeping snapshot to persist (not a server grant). */
    xpEarned: number
}

/** Payload inside `completeFlashcardDueReviewSession.data` after the standard API wrapper. */
export interface CompleteFlashcardDueReviewSessionData {
    /** The reviewed-card count snapshotted onto the row. */
    reviewedCount: number
    /** The XP bookkeeping value snapshotted onto the row (echoed back, not a server grant). */
    xpEarned: number
}

/** Apollo response shape for `completeFlashcardDueReviewSession`. */
export interface MutateCompleteFlashcardDueReviewSessionResponse {
    /** Top-level `completeFlashcardDueReviewSession` field wrapping the standard API response. */
    completeFlashcardDueReviewSession: GraphQLResponse<CompleteFlashcardDueReviewSessionData>
}
