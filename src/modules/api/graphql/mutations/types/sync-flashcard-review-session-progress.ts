import type { GraphQLResponse } from "../../types"

/**
 * Request body for the `syncFlashcardReviewSessionProgress` mutation —
 * best-effort, fire-and-forget persistence of the in-progress review run so
 * it can be resumed later (24h TTL, see `myInProgressFlashcardReviewSession`).
 * No per-card breakdown (unlike quiz's `results`) — grading itself already
 * happens per-card through the existing `reviewFlashcard` mutation; this just
 * snapshots the resumable cursor + counters.
 */
export interface SyncFlashcardReviewSessionProgressRequest {
    /** The in-progress session to persist progress against (from `startFlashcardReviewSession`). */
    sessionId: string
    /** Zero-based index of the card the learner is currently on. */
    currentIndex: number
    /** Cards actually graded so far this run (via `reviewFlashcard`). */
    reviewedCount: number
    /** 0-indexed card positions graded this run (order-independent) — drives the progress bar's per-segment green + rehydrates on resume. Optional; omitted leaves the column untouched. */
    gradedIndexes?: Array<number>
    /** Client-reported XP bookkeeping snapshot so far this run (not server-granted). */
    xpEarned: number
}

/** Payload inside `syncFlashcardReviewSessionProgress.data` after the standard API wrapper. */
export interface SyncFlashcardReviewSessionProgressData {
    /** Whether the sync was persisted (`false` = stale/not-owned/not in_progress — never throws). */
    success: boolean
}

/** Apollo response shape for `syncFlashcardReviewSessionProgress`. */
export interface MutateSyncFlashcardReviewSessionProgressResponse {
    /** Top-level `syncFlashcardReviewSessionProgress` field wrapping the standard API response. */
    syncFlashcardReviewSessionProgress: GraphQLResponse<SyncFlashcardReviewSessionProgressData>
}
