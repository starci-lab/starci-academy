import type { GraphQLResponse } from "../../types"

/** One flashcard due for review today (SM-2 scheduler). */
export interface QueryMyDueFlashcardData {
    /** Opaque id of the card (passed to `reviewFlashcard`). */
    cardId: string
    /** Title of the deck the card belongs to (shown as context). */
    deckTitle: string
    /** Front (prompt) text shown first. */
    front: string
    /** Back (answer) text revealed after flipping. */
    back: string
}

/** The viewer's due-flashcards payload: a count plus the cards to review. */
export interface QueryMyDueFlashcardsData {
    /** How many cards are due today (drives the dashboard widget). */
    dueCount: number
    /** The cards to review (capped by the query `limit`). */
    cards: Array<QueryMyDueFlashcardData>
}

/** Apollo response shape for the `myDueFlashcards` query. */
export interface QueryMyDueFlashcardsResponse {
    /** Top-level `myDueFlashcards` field wrapping the standard API response. */
    myDueFlashcards: GraphQLResponse<QueryMyDueFlashcardsData>
}
