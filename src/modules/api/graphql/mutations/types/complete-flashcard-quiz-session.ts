import type { GraphQLResponse } from "../../types"

/** One card's answer breakdown sent to the server for scoring (replaces the old
 *  client-trusted aggregate `answeredCount`/`coverageScore`). */
export interface QuizSessionAnswerRequest {
    /** The flashcard this answer belongs to. */
    cardId: string
    /** How many cloze blanks the learner filled correctly for this card. */
    correctBlanks: number
    /** Total cloze blanks on this card. */
    totalBlanks: number
}

/** GraphQL `CompleteFlashcardQuizSessionRequest` body. */
export interface CompleteFlashcardQuizSessionRequest {
    /** Client-generated id grouping this run (idempotency key — one XP grant per session). */
    sessionId: string
    /** Course the quiz drew its cards from. */
    courseId: string
    /** Per-card answer breakdown (max 10) — the server re-derives coverage from this. */
    answers: Array<QuizSessionAnswerRequest>
}

/** One weak tag ranked worst-first, with an optional lesson to revisit. */
export interface QuizSessionWeakTagData {
    /** The tag/topic label. */
    tag: string
    /** Coverage ratio for this tag across the session's answered cards (0..1). */
    coverage: number
    /** The module to revisit, when the deck→module mapping is unambiguous. */
    moduleId?: string | null
    /** The content/lesson to revisit, when the deck→content mapping is unambiguous. */
    contentId?: string | null
}

/** Readiness signal for the AI Mock Interview, derived from flashcard retention. */
export interface QuizSessionReadinessData {
    /** Current retention-rate proxy (0-100). */
    currentAvg: number
    /** Threshold `currentAvg` must reach to unlock the AI Mock Interview. */
    threshold: number
    /** Whether the AI Mock Interview is unlocked for this learner. */
    unlocked: boolean
}

/** Payload inside `completeFlashcardQuizSession.data` after the standard API wrapper. */
export interface CompleteFlashcardQuizSessionData {
    /** XP awarded for finishing this quiz session (0 when nothing was earned or the
     *  daily cap was already spent). */
    xpEarned: number
    /** Whether today's daily XP cap for this source clamped the grant. */
    dailyCapReached: boolean
    /** Weakest tags this session (ranked worst-first, max 5; empty when nothing answered). */
    weakTags: Array<QuizSessionWeakTagData>
    /** Readiness signal gating the AI Mock Interview cross-link. */
    readiness: QuizSessionReadinessData
}

/** Apollo response shape for `completeFlashcardQuizSession`. */
export interface MutateCompleteFlashcardQuizSessionResponse {
    /** Top-level `completeFlashcardQuizSession` field wrapping the standard API response. */
    completeFlashcardQuizSession: GraphQLResponse<CompleteFlashcardQuizSessionData>
}
