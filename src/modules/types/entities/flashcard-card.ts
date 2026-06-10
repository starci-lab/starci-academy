import type { AbstractEntity } from "./abstract"

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
    /** Display order within the deck card list. */
    orderIndex: number
    /** Default locale for this card row. */
    defaultLocale: string
    /** Parent deck id. */
    deckId?: string
}
