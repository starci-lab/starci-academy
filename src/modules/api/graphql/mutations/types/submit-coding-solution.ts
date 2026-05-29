import type { GraphQLResponse } from "../../types"
import type { CodingLanguage } from "../../queries/types/coding"

/** Variables for `submitCodingSolution(request)`. */
export interface SubmitCodingSolutionRequest {
    /** Slug of the problem being solved. */
    slug: string
    /** Language of the submission. */
    language: CodingLanguage
    /** Source code to judge. */
    sourceCode: string
}

/** Identifiers returned after a submission is accepted for judging. */
export interface SubmitCodingSolutionPayload {
    /** The created submission id. */
    submissionId: string
    /** The judging job id to subscribe to over Socket.IO. */
    jobId: string
}

/** Response for the `submitCodingSolution` mutation. */
export interface MutateSubmitCodingSolutionResponse {
    /** Top-level `submitCodingSolution` field. */
    submitCodingSolution: GraphQLResponse<SubmitCodingSolutionPayload>
}
