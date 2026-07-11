import type { GraphQLResponse } from "../../types"

/** One recorded card outcome of an in-progress "Hỏi nhanh" run so far. Mirrors
 *  backend `MyInProgressFlashcardQuizSessionResultItem`. */
export interface MyInProgressFlashcardQuizSessionResultItem {
    /** The flashcard this outcome belongs to. */
    cardId: string
    /** Blanks filled correctly for this card. */
    correctBlanks: number
    /** Total cloze blanks this card had. */
    totalBlanks: number
}

/**
 * Payload inside `myInProgressFlashcardQuizSession.data` after the standard
 * API wrapper — absent/null when the viewer has no resumable session (24h
 * TTL, `status="in_progress"` only).
 */
export interface MyInProgressFlashcardQuizSessionData {
    /** The resumable session's id. */
    sessionId: string
    /** The cards drawn for this run, in play order. */
    cardIds: Array<string>
    /** Zero-based index of the card the learner was on when last synced. */
    currentIndex: number
    /** Per-card outcomes recorded so far. */
    results: Array<MyInProgressFlashcardQuizSessionResultItem>
    /** ISO timestamp of the session's last synced activity. */
    updatedAt: string
    /** ISO timestamp of the session's resumable-window deadline (createdAt + duration)
     *  — drives the `WorkSessionHeader` countdown, same as Mock Interview's own `deadlineAt`. */
    deadlineAt: string
}

/** Apollo response shape for `myInProgressFlashcardQuizSession`. */
export interface QueryMyInProgressFlashcardQuizSessionResponse {
    /** Top-level `myInProgressFlashcardQuizSession` field wrapping the standard API response — `data` is absent/null when there is no resumable session. */
    myInProgressFlashcardQuizSession: GraphQLResponse<MyInProgressFlashcardQuizSessionData>
}
