import type { FlashcardDeckEntity } from "@/modules/types"
import type { GraphQLResponse } from "../../types"

/** Apollo response shape for the `flashcardDecksByCourse` query. */
export interface QueryFlashcardDecksByCourseResponse {
    /** Top-level `flashcardDecksByCourse` field wrapping the standard API response. */
    flashcardDecksByCourse: GraphQLResponse<Array<FlashcardDeckEntity>>
}
