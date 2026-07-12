import type { GraphQLResponse } from "../../types"

/**
 * Payload inside `myInProgressFlashcardDueReviewSession.data` after the
 * standard API wrapper — absent/null when the viewer has no resumable
 * cross-deck due-review batch for the course (24h TTL, `status="in_progress"`
 * only).
 */
export interface MyInProgressFlashcardDueReviewSessionData {
    /** The resumable session's id. */
    sessionId: string
    /** The batch's drawn card ids (across decks), in ask order. */
    cardIds: Array<string>
    /** Zero-based index of the card the learner was on when last synced. */
    currentIndex: number
    /** Cards actually graded so far this batch. */
    reviewedCount: number
    /** 0-indexed card positions graded this batch (order-independent) — rehydrates the progress bar's per-segment green on resume. */
    gradedIndexes: Array<number>
    /** Client-reported XP bookkeeping snapshot so far this batch (not a server grant). */
    xpEarned: number
    /** ISO timestamp of the session's last synced activity. */
    updatedAt: string
}

/** Apollo response shape for `myInProgressFlashcardDueReviewSession`. */
export interface QueryMyInProgressFlashcardDueReviewSessionResponse {
    /** Top-level `myInProgressFlashcardDueReviewSession` field wrapping the standard API response — `data` is absent/null when there is no resumable session. */
    myInProgressFlashcardDueReviewSession: GraphQLResponse<MyInProgressFlashcardDueReviewSessionData>
}
