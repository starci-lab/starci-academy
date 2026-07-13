import type { GraphQLResponse } from "../../types"

/** Deck-review scope picked in the mode modal — `"full"` (whole deck) or `"due"` (only cards needing review). */
export type FlashcardReviewMode = "full" | "due"

/** GraphQL `StartFlashcardReviewSessionRequest` body. */
export interface StartFlashcardReviewSessionRequest {
    /** Deck this review session belongs to. */
    deckId: string
    /** The deck's card ids, in the order they will be reviewed. */
    cardIds: Array<string>
    /**
     * Which cards to persist into the session (thầy 2026-07-13 "modal chọn mode"):
     * `"full"` (default) keeps the whole deck; `"due"` keeps only the cards
     * needing review (no review row yet or past due). Omit for the full deck.
     */
    mode?: FlashcardReviewMode
}

/** Payload inside `startFlashcardReviewSession.data` after the standard API wrapper. */
export interface StartFlashcardReviewSessionData {
    /** Server-issued id for this run — used by `syncFlashcardReviewSessionProgress`,
     *  `completeFlashcardReviewSession`, and `myInProgressFlashcardReviewSession`. */
    sessionId: string
}

/** Apollo response shape for `startFlashcardReviewSession`. */
export interface MutateStartFlashcardReviewSessionResponse {
    /** Top-level `startFlashcardReviewSession` field wrapping the standard API response. */
    startFlashcardReviewSession: GraphQLResponse<StartFlashcardReviewSessionData>
}
