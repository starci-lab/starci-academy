import type { QuizDeckEntity } from "@/modules/types"
import type { GraphQLResponse } from "../../types"

/** Apollo response shape for the `quizDecksByCourse` query. */
export interface QueryQuizDecksByCourseResponse {
    /** Top-level `quizDecksByCourse` field wrapping the standard API response. */
    quizDecksByCourse: GraphQLResponse<Array<QuizDeckEntity>>
}
