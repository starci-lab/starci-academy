import type { QuizDeckEntity } from "@/modules/types"
import type { GraphQLResponse } from "../../types"

/** Apollo response shape for the `quizDeck` query. */
export interface QueryQuizDeckResponse {
    /** Top-level `quizDeck` field wrapping the standard API response. */
    quizDeck: GraphQLResponse<QuizDeckEntity>
}
