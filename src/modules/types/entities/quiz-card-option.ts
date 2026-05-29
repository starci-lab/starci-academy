import type { AbstractEntity } from "./abstract"

/**
 * One multiple-choice option of a quiz card. Mirrors table `quiz_card_options`.
 */
export interface QuizCardOptionEntity extends AbstractEntity {
    /** Option text (Markdown). */
    text: string
    /** Whether this option is the correct answer. */
    isCorrect: boolean
    /** Display order within the card option list. */
    orderIndex: number
    /** Default locale for this option row. */
    defaultLocale: string
    /** Parent card id. */
    cardId?: string
}
