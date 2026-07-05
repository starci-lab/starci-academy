import type { GraphQLResponse } from "../../types"

/** Payload inside `completeFlashcardQuizSession.data` after the standard API wrapper. */
export interface CompleteFlashcardQuizSessionData {
    /** XP awarded for finishing this quiz session (0 when nothing was earned). */
    xpEarned: number
}

/** GraphQL `CompleteFlashcardQuizSessionRequest` body. */
export interface CompleteFlashcardQuizSessionRequest {
    /** Client-generated id grouping this run (idempotency key — one XP grant per session). */
    sessionId: string
    /** Course the quiz drew its cards from. */
    courseId: string
    /** How many cards were self-graded this session. */
    answeredCount: number
    /** Average keyword-coverage ratio across the graded cards (0..1). */
    coverageScore: number
}

/** Apollo response shape for `completeFlashcardQuizSession`. */
export interface MutateCompleteFlashcardQuizSessionResponse {
    /** Top-level `completeFlashcardQuizSession` field wrapping the standard API response. */
    completeFlashcardQuizSession: GraphQLResponse<CompleteFlashcardQuizSessionData>
}
