import type { GraphQLResponse } from "../../types"

/** GraphQL `StartFlashcardQuizSessionRequest` body. */
export interface StartFlashcardQuizSessionRequest {
    /** Course the quiz draws its cards from. */
    courseId: string
    /** The cards drawn for this run, in play order (1-10). */
    cardIds: Array<string>
    /**
     * Practice mode chosen at setup ("quick"|"deep") — REQUIRED (non-null) on the
     * backend; persisted so history/stats can show it. Restored 2026-07-09 (had
     * been dropped from this type, which broke `startFlashcardQuizSession` —
     * the backend rejects a request missing this field).
     */
    mode: string
    /** Seniority level filter chosen at setup, or null for "all levels" — REQUIRED
     *  (nullable) on the backend; persisted so history/stats can show it. */
    level: string | null
}

/** Payload inside `startFlashcardQuizSession.data` after the standard API wrapper. */
export interface StartFlashcardQuizSessionData {
    /** Server-issued id for this run — used by `syncFlashcardQuizSessionProgress`,
     *  `completeFlashcardQuizSession`, and the resumable `.../quiz/[sessionId]` route. */
    sessionId: string
    /** ISO timestamp of the session's resumable-window deadline (createdAt + duration)
     *  — drives the `WorkSessionHeader` countdown, same as Mock Interview's own `deadlineAt`. */
    deadlineAt: string
}

/** Apollo response shape for `startFlashcardQuizSession`. */
export interface MutateStartFlashcardQuizSessionResponse {
    /** Top-level `startFlashcardQuizSession` field wrapping the standard API response. */
    startFlashcardQuizSession: GraphQLResponse<StartFlashcardQuizSessionData>
}
