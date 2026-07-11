import type { GraphQLResponse } from "../../types"

/** Payload inside `reviewFlashcard.data` after the standard API wrapper. */
export interface ReviewFlashcardData {
    /** ISO timestamp the card is next due after applying the SM-2 grade. */
    dueAt: string
    /**
     * XP granted by THIS grade — `2` the first time a card is ever reviewed,
     * `0` on every repeat review (due-review over already-seen cards). Honest,
     * server-computed; the session stats surface sums these per session.
     */
    xpEarned: number
}

/** GraphQL `ReviewFlashcardRequest` body. */
export interface ReviewFlashcardRequest {
    /** Id of the card being graded. */
    cardId: string
    /** SM-2 grade: 0=Again, 1=Hard, 2=Good, 3=Easy. */
    grade: number
    /**
     * The live review-session this grade belongs to — links the persisted
     * review event to its session so the session-stats surface can aggregate
     * per-grade counts / weak-tags / duration for exactly this run. Optional:
     * a bare (unsessioned) grade still records, it just can't be attributed to
     * a session (legacy fallback path).
     */
    sessionId?: string
}

/** Apollo response shape for `reviewFlashcard`. */
export interface MutateReviewFlashcardResponse {
    /** Top-level `reviewFlashcard` field wrapping the standard API response. */
    reviewFlashcard: GraphQLResponse<ReviewFlashcardData>
}
