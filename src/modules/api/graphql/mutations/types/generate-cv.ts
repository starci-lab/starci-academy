import type { GraphQLResponse, QueryVariables } from "../../types"

/** GraphQL `GenerateCvRequest` body. */
export interface GenerateCvRequest {
    /**
     * Optional free-text context the learner provides about projects/experience
     * outside StarCi that the AI should weave into the generated CV.
     */
    extraPrompts?: string
}

/** Payload inside `generateCv.data` after the standard API wrapper. */
export interface GenerateCvResponseData {
    /** `jobs.id` enqueued for CV generation (poll `cvGeneration` until Done). */
    jobId: string
    /** `cv_generations.id` of the created generation row. */
    cvGenerationId: string
}

/** Apollo variables bag for the `generateCv` mutation. */
export type MutateGenerateCvVariables = QueryVariables<GenerateCvRequest>

/** Apollo response shape for `generateCv`. */
export interface MutateGenerateCvResponse {
    /** Top-level `generateCv` field wrapping the standard API response. */
    generateCv: GraphQLResponse<GenerateCvResponseData>
}
