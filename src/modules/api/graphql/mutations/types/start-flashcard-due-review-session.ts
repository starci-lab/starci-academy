import type { GraphQLResponse } from "../../types"

/** GraphQL `StartFlashcardDueReviewSessionRequest` body. */
export interface StartFlashcardDueReviewSessionRequest {
    /** Course this cross-deck due-review batch belongs to. */
    courseId: string
    /** The batch's drawn card ids (across decks), in the order they will be asked. */
    cardIds: Array<string>
}

/** Payload inside `startFlashcardDueReviewSession.data` after the standard API wrapper. */
export interface StartFlashcardDueReviewSessionData {
    /** Server-issued id for this run — used by `syncFlashcardDueReviewSessionProgress`,
     *  `completeFlashcardDueReviewSession`, and `myInProgressFlashcardDueReviewSession`. */
    sessionId: string
}

/** Apollo response shape for `startFlashcardDueReviewSession`. */
export interface MutateStartFlashcardDueReviewSessionResponse {
    /** Top-level `startFlashcardDueReviewSession` field wrapping the standard API response. */
    startFlashcardDueReviewSession: GraphQLResponse<StartFlashcardDueReviewSessionData>
}
