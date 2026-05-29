import type { AbstractEntity } from "./abstract"
import type { QuizCardOptionEntity } from "./quiz-card-option"

/**
 * A single multiple-choice interview-prep card within a deck. Mirrors table `quiz_cards`.
 */
export interface QuizCardEntity extends AbstractEntity {
    /** The question prompt (Markdown). */
    question: string
    /** Optional answer explanation revealed after grading (Markdown). */
    explanation: string | null
    /** Display order within the deck card list. */
    orderIndex: number
    /** Default locale for this card row. */
    defaultLocale: string
    /** Parent deck id. */
    deckId?: string
    /** Multiple-choice options (empty for free-text cards). */
    options?: Array<QuizCardOptionEntity>
}
