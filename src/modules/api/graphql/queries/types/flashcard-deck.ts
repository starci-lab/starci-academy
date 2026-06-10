import type { FlashcardDeckEntity } from "@/modules/types"
import type { GraphQLResponse } from "../../types"

/** Apollo response shape for the `flashcardDeck` query. */
export interface QueryFlashcardDeckResponse {
    /** Top-level `flashcardDeck` field wrapping the standard API response. */
    flashcardDeck: GraphQLResponse<FlashcardDeckEntity>
}
