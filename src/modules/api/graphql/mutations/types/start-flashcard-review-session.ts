import type { GraphQLResponse } from "../../types"

/** GraphQL `StartFlashcardReviewSessionRequest` body. */
export interface StartFlashcardReviewSessionRequest {
    /** Deck this review session belongs to. */
    deckId: string
    /** The deck's card ids, in the order they will be reviewed. */
    cardIds: Array<string>
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
