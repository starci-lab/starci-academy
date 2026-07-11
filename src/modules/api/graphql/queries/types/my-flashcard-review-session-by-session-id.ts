import type { GraphQLResponse } from "../../types"

/**
 * Payload inside `myFlashcardReviewSessionBySessionId.data` — a flashcard
 * "Học thẻ" session resolved by its id ALONE, whichever kind it is. Absent/null
 * when the id is not found/not owned by the caller.
 */
export interface MyFlashcardReviewSessionBySessionIdData {
    /** Id of the session (echoes the input). */
    sessionId: string
    /** `"deck"` (single-deck review, `deckId`/`deckTitle` present) or `"due"` (cross-deck due-review batch, both null). */
    kind: "deck" | "due"
    /** The deck this session reviews — present only when `kind` is `"deck"`. */
    deckId: string | null
    /** The deck's display title — present only when `kind` is `"deck"`. */
    deckTitle: string | null
    /** The session's card ids, in review/ask order. */
    cardIds: Array<string>
    /** Zero-based index of the card the learner was on when last synced. */
    currentIndex: number
    /** Cards actually graded so far this session. */
    reviewedCount: number
    /** Client-reported XP bookkeeping snapshot so far this session (not a server grant). */
    xpEarned: number
    /** ISO timestamp of the session's last synced activity. */
    updatedAt: string
}

/** Apollo response shape for `myFlashcardReviewSessionBySessionId`. */
export interface QueryMyFlashcardReviewSessionBySessionIdResponse {
    /** Top-level `myFlashcardReviewSessionBySessionId` field wrapping the standard API response — `data` is absent/null when the id is not found/not owned by the caller. */
    myFlashcardReviewSessionBySessionId: GraphQLResponse<MyFlashcardReviewSessionBySessionIdData>
}
