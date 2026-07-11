import type { GraphQLResponse } from "../../types"

/**
 * Request body for the `syncFlashcardDueReviewSessionProgress` mutation —
 * best-effort, fire-and-forget persistence of the in-progress cross-deck
 * due-review batch so it can be resumed later (24h TTL, see
 * `myInProgressFlashcardDueReviewSession`). No per-card breakdown — grading
 * itself already happens per-card through the existing `reviewFlashcard`
 * mutation; this just snapshots the resumable cursor + counters.
 */
export interface SyncFlashcardDueReviewSessionProgressRequest {
    /** The in-progress session to persist progress against (from `startFlashcardDueReviewSession`). */
    sessionId: string
    /** Zero-based index of the card the learner is currently on. */
    currentIndex: number
    /** Cards actually graded so far this batch (via `reviewFlashcard`). */
    reviewedCount: number
    /** Client-reported XP bookkeeping snapshot so far this batch (not server-granted). */
    xpEarned: number
}

/** Payload inside `syncFlashcardDueReviewSessionProgress.data` after the standard API wrapper. */
export interface SyncFlashcardDueReviewSessionProgressData {
    /** Whether the sync was persisted (`false` = stale/not-owned/not in_progress — never throws). */
    success: boolean
}

/** Apollo response shape for `syncFlashcardDueReviewSessionProgress`. */
export interface MutateSyncFlashcardDueReviewSessionProgressResponse {
    /** Top-level `syncFlashcardDueReviewSessionProgress` field wrapping the standard API response. */
    syncFlashcardDueReviewSessionProgress: GraphQLResponse<SyncFlashcardDueReviewSessionProgressData>
}
