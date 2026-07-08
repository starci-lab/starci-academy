import type { GraphQLResponse } from "../../types"

/**
 * Request body for `completeFlashcardReviewSession`. No per-card breakdown
 * and no server-side XP grant (unlike `completeFlashcardQuizSession`) —
 * `reviewFlashcard` grants no XP today, so `xpEarned` here is purely a
 * client-reported bookkeeping snapshot persisted for history/stats display.
 */
export interface CompleteFlashcardReviewSessionRequest {
    /** Session id — the server-issued id from `startFlashcardReviewSession`. */
    sessionId: string
    /** Final reviewed-card count to snapshot onto the row. */
    reviewedCount: number
    /** Final XP bookkeeping snapshot to persist (not a server grant). */
    xpEarned: number
}

/** Payload inside `completeFlashcardReviewSession.data` after the standard API wrapper. */
export interface CompleteFlashcardReviewSessionData {
    /** The reviewed-card count snapshotted onto the row. */
    reviewedCount: number
    /** The XP bookkeeping value snapshotted onto the row (echoed back, not a server grant). */
    xpEarned: number
}

/** Apollo response shape for `completeFlashcardReviewSession`. */
export interface MutateCompleteFlashcardReviewSessionResponse {
    /** Top-level `completeFlashcardReviewSession` field wrapping the standard API response. */
    completeFlashcardReviewSession: GraphQLResponse<CompleteFlashcardReviewSessionData>
}
