import type { GraphQLResponse } from "../../types"

/** Per-grade tally of the session's graded review events (SM-2 buckets). */
export interface FlashcardReviewSessionGradeCounts {
    /** Grade 0 — "Again" (forgot). */
    again: number
    /** Grade 1 — "Hard". */
    hard: number
    /** Grade 2 — "Good". */
    good: number
    /** Grade 3 — "Easy". */
    easy: number
}

/** One weak tag — a `card.tags` value grouped from the session's forgotten (grade-0) cards. */
export interface FlashcardReviewSessionWeakTag {
    /** The card tag. */
    tag: string
    /** How many grade-0 (forgot) events this tag accounts for in the session. */
    forgotCount: number
}

/**
 * Payload inside `myFlashcardReviewSessionStatsBySessionId.data` — the recap of
 * ONE finished (or in-progress) flashcard review session, resolved by session id
 * across BOTH the deck-review and cross-deck due-review tables, owner-scoped.
 * `null` when the id is not found / not owned by the caller.
 *
 * A legacy session whose events predate the `sessionId` column comes back
 * DEGRADED: `gradeCounts` all-zero, `weakTags` empty, `durationSeconds` null,
 * `xpEarned` 0 — but a real `status` + `reviewedCount` from the session row, so
 * the surface renders the count-only fallback instead of erroring.
 */
export interface MyFlashcardReviewSessionStatsBySessionIdData {
    /** Id of the session (echoes the input). */
    sessionId: string
    /** Session lifecycle: `"in_progress" | "completed" | "abandoned"`. */
    status: string
    /** Cards graded this session (event count carrying this id, or the session row's own snapshot as fallback). */
    reviewedCount: number
    /** Per-grade distribution across the session's graded events. */
    gradeCounts: FlashcardReviewSessionGradeCounts
    /** Wall-clock span from first to last graded event, in seconds — null when fewer than 2 events carry the id. */
    durationSeconds: number | null
    /** XP earned this session — first-ever-review events × 2 (typically 0 for a due-review of already-seen cards). */
    xpEarned: number
    /** Earliest upcoming due date among the session's drawn cards (ISO timestamp) — null when none scheduled. */
    nextDueAt: string | null
    /** Top ~5 most-forgotten card tags this session, most-forgotten first; `[]` when none. */
    weakTags: Array<FlashcardReviewSessionWeakTag>
}

/** Apollo response shape for `myFlashcardReviewSessionStatsBySessionId`. */
export interface QueryMyFlashcardReviewSessionStatsBySessionIdResponse {
    /** Top-level field wrapping the standard API response — `data` is null when the id is not found / not owned. */
    myFlashcardReviewSessionStatsBySessionId: GraphQLResponse<MyFlashcardReviewSessionStatsBySessionIdData>
}
