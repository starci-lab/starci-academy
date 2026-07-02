import type { GraphQLResponse, QueryVariables } from "../../types"

/** GraphQL `ReviseCvRequest` body. */
export interface ReviseCvRequest {
    /** `cv_submissions.id` of the uploaded CV to revise. */
    cvSubmissionId: string
    /**
     * Optional free-text context the learner provides about projects/experience
     * outside StarCi that the AI should weave into the revised CV.
     */
    extraPrompts?: string
}

/** Payload inside `reviseCv.data` after the standard API wrapper. */
export interface ReviseCvResponseData {
    /** `jobs.id` enqueued for CV revision (poll `cvGeneration` until Done). */
    jobId: string
    /** `cv_generations.id` of the created generation row. */
    cvGenerationId: string
}

/** Apollo variables bag for the `reviseCv` mutation. */
export type MutateReviseCvVariables = QueryVariables<ReviseCvRequest>

/** Apollo response shape for `reviseCv`. */
export interface MutateReviseCvResponse {
    /** Top-level `reviseCv` field wrapping the standard API response. */
    reviseCv: GraphQLResponse<ReviseCvResponseData>
}
