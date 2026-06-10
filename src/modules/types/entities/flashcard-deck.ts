import type { AbstractEntity } from "./abstract"
import type { ContentEntity } from "./content"
import type { FlashcardCardEntity } from "./flashcard-card"
import type { ChallengeDifficulty } from "../enums/challenge-difficulty"

/**
 * Interview-prep flashcard deck owned by a course. Mirrors table `quiz_decks`.
 */
export interface FlashcardDeckEntity extends AbstractEntity {
    /** Deck title. */
    title: string
    /** Human-facing stable identifier from the mount folder slug. */
    displayId: string
    /** Deck description (Markdown). */
    description: string
    /** Relative difficulty of the deck. */
    difficulty: ChallengeDifficulty
    /** Display order within the course deck list. */
    orderIndex: number
    /** Default locale for this deck row. */
    defaultLocale: string
    /** Owning course id. */
    courseId?: string
    /** Contents this deck is linked to (optional N:N). */
    contents?: Array<ContentEntity>
    /** Open-ended Q&A flashcards belonging to this deck. */
    cards?: Array<FlashcardCardEntity>
}
