import type { GraphQLResponse } from "../../types"

/** GraphQL `StartFlashcardQuizSessionRequest` body. */
export interface StartFlashcardQuizSessionRequest {
    /** Course the quiz draws its cards from. */
    courseId: string
    /** The cards drawn for this run, in play order (1-10). */
    cardIds: Array<string>
}

/** Payload inside `startFlashcardQuizSession.data` after the standard API wrapper. */
export interface StartFlashcardQuizSessionData {
    /** Server-issued id for this run — used by `syncFlashcardQuizSessionProgress`,
     *  `completeFlashcardQuizSession`, and the resumable `.../quiz/[sessionId]` route. */
    sessionId: string
}

/** Apollo response shape for `startFlashcardQuizSession`. */
export interface MutateStartFlashcardQuizSessionResponse {
    /** Top-level `startFlashcardQuizSession` field wrapping the standard API response. */
    startFlashcardQuizSession: GraphQLResponse<StartFlashcardQuizSessionData>
}
