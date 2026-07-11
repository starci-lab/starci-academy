import type { AbstractEntity } from "./abstract"

/** Per-grade next-interval preview (days) from the viewer's current SM-2 state. */
export interface FlashcardNextIntervals {
    again: number
    hard: number
    good: number
    easy: number
}

/**
 * A single open-ended interview flashcard within a deck. Mirrors table `flashcard_cards`.
 */
export interface FlashcardCardEntity extends AbstractEntity {
    /** The question prompt shown on the front (Markdown). */
    question: string
    /** The model answer revealed on flip (Markdown); null for unmigrated cards. */
    answer: string | null
    /** Optional extra depth — follow-ups, gotchas (Markdown). */
    explanation: string | null
    /** Interview seniority level (junior/middle/senior/staff); null when unset. */
    level?: string | null
    /** Technology tags for this card (e.g. ["NestJS", "Redis"]). */
    tags?: Array<string>
    /** Pure ordering index used to sort/reorder (1-based). */
    sortIndex: number
    /** Default locale for this card row. */
    defaultLocale: string
    /** Parent deck id. */
    deckId?: string
    /**
     * Whether this card is premium. First ~20% of each deck is free; the rest is
     * premium (unlocked by enrolling in the deck's course).
     */
    isPremium?: boolean
    /** Per-grade next-interval preview (days), runtime-populated for the signed-in viewer. */
    nextIntervals?: FlashcardNextIntervals
}
