import type { GraphQLResponse } from "../../types"

/** One card's outcome-so-far sent for best-effort persistence. Mirrors the
 *  per-card breakdown `completeFlashcardQuizSession` already sends. */
export interface FlashcardQuizSessionResultRequest {
    /** The flashcard this result belongs to. */
    cardId: string
    /** How many cloze blanks the learner filled correctly for this card. */
    correctBlanks: number
    /** Total cloze blanks on this card. */
    totalBlanks: number
}

/**
 * Request body for the `syncFlashcardQuizSessionProgress` mutation —
 * best-effort, fire-and-forget persistence of the in-progress run so it can be
 * resumed later (24h TTL, see `myInProgressFlashcardQuizSession`). Mirrors
 * backend `SyncFlashcardQuizSessionProgressRequest`.
 */
export interface SyncFlashcardQuizSessionProgressRequest {
    /** The in-progress session to persist progress against (from `startFlashcardQuizSession`). */
    sessionId: string
    /** Zero-based index of the card the learner is currently on. */
    currentIndex: number
    /** Per-card outcomes gathered so far this run (max 10). */
    results: Array<FlashcardQuizSessionResultRequest>
}

/** Payload inside `syncFlashcardQuizSessionProgress.data` after the standard API wrapper. */
export interface SyncFlashcardQuizSessionProgressData {
    /** Whether the sync was persisted (`false` = stale/not-owned/not in_progress — never throws). */
    success: boolean
}

/** Apollo response shape for `syncFlashcardQuizSessionProgress`. */
export interface MutateSyncFlashcardQuizSessionProgressResponse {
    /** Top-level `syncFlashcardQuizSessionProgress` field wrapping the standard API response. */
    syncFlashcardQuizSessionProgress: GraphQLResponse<SyncFlashcardQuizSessionProgressData>
}
