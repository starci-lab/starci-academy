import type { GraphQLResponse } from "../../types"

/**
 * Payload inside `myInProgressFlashcardReviewSession.data` after the standard
 * API wrapper — absent/null when the viewer has no resumable session for the
 * deck (24h TTL, `status="in_progress"` only).
 */
export interface MyInProgressFlashcardReviewSessionData {
    /** The resumable session's id. */
    sessionId: string
    /** The deck's card ids, in review order. */
    cardIds: Array<string>
    /** Zero-based index of the card the learner was on when last synced. */
    currentIndex: number
    /** Cards actually graded so far this session. */
    reviewedCount: number
    /** 0-indexed card positions graded this session (order-independent) — rehydrates the progress bar's per-segment green on resume. */
    gradedIndexes: Array<number>
    /** Client-reported XP bookkeeping snapshot so far this session (not a server grant). */
    xpEarned: number
    /** ISO timestamp of the session's last synced activity. */
    updatedAt: string
}

/** Apollo response shape for `myInProgressFlashcardReviewSession`. */
export interface QueryMyInProgressFlashcardReviewSessionResponse {
    /** Top-level `myInProgressFlashcardReviewSession` field wrapping the standard API response — `data` is absent/null when there is no resumable session. */
    myInProgressFlashcardReviewSession: GraphQLResponse<MyInProgressFlashcardReviewSessionData>
}
