import type { GraphQLResponse } from "../../types"

/** One Test-mode answer: the selected option for a card. */
export interface QuizTestAnswerInput {
    /** Id of the card being answered. */
    quizCardId: string
    /** Id of the option the learner selected. */
    selectedOptionId: string
}

/** Request body for the `submitQuizTest` mutation (mirrors GraphQL SubmitQuizTestRequest). */
export interface SubmitQuizTestRequest {
    /** Id of the deck being tested. */
    quizDeckId: string
    /** The learner's answers, one per attempted card. */
    answers: Array<QuizTestAnswerInput>
}

/** Grading outcome for one card in a Test submission. */
export interface QuizTestCardResult {
    /** Id of the graded card. */
    quizCardId: string
    /** Option the learner selected. */
    selectedOptionId: string
    /** Id of the correct option for this card. */
    correctOptionId: string | null
    /** Whether the selected option was correct. */
    correct: boolean
}

/** Aggregate result of grading a Test submission. */
export interface SubmitQuizTestData {
    /** Id of the graded deck. */
    quizDeckId: string
    /** Number of answers graded. */
    total: number
    /** Number of correct answers. */
    correct: number
    /** Percentage correct (0-100). */
    scorePercent: number
    /** Per-card grading breakdown. */
    results: Array<QuizTestCardResult>
}

/** Apollo response shape for the `submitQuizTest` mutation. */
export interface MutateSubmitQuizTestResponse {
    /** Top-level `submitQuizTest` field wrapping the standard API response. */
    submitQuizTest: GraphQLResponse<SubmitQuizTestData>
}
