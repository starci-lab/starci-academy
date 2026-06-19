import type { GraphQLResponse } from "../../types"

/** GraphQL `AskContentAiRequest` body. */
export interface AskContentAiRequest {
    /** Content the question is about. */
    contentId: string
    /** The learner's question about this content. */
    question: string
}

/** Payload inside `askContentAi.data` after the standard API wrapper. */
export interface AskContentAiData {
    /** The AI's answer, grounded in the content body. */
    answer: string
}

/** Apollo response shape for `askContentAi`. */
export interface MutateAskContentAiResponse {
    /** Top-level `askContentAi` field wrapping the standard API response. */
    askContentAi: GraphQLResponse<AskContentAiData>
}
