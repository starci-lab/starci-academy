import type { GraphQLResponse } from "../../types"

/** One flashcard fetched by exact id, localized — front/back + owning deck title. */
export interface FlashcardByIdCard {
    /** The flashcard card id (echoes an input id). */
    cardId: string
    /** Owning deck title (localized). */
    deckTitle: string
    /** Card front / question (localized markdown). */
    front: string
    /** Card back / answer (localized markdown). */
    back: string
    /** Interview seniority level (junior/middle/senior/staff), or null — drives the level chip. */
    level: string | null
    /** Technology tags for this card — drives the tag chips (same as deck-review). */
    tags: Array<string>
}

/** Payload inside `flashcardCardsByIds.data` — the requested cards in input order. */
export interface FlashcardCardsByIdsData {
    /** The requested cards, localized, in `cardIds` order (a missing/deleted id is dropped). */
    cards: Array<FlashcardByIdCard>
}

/** Apollo response shape for `flashcardCardsByIds`. */
export interface QueryFlashcardCardsByIdsResponse {
    /** Top-level field wrapping the standard API response. */
    flashcardCardsByIds: GraphQLResponse<FlashcardCardsByIdsData>
}
