import type { GraphQLResponse, QueryVariables } from "../../types"
import type { ModelProvider } from "../../queries/query-my-ai-settings"

/** GraphQL `ReviseCvRequest` body. */
export interface ReviseCvRequest {
    /** `cv_generations.id` of the existing CV to revise (field name kept as `cvSubmissionId` for API compatibility). */
    cvSubmissionId: string
    /**
     * Optional free-text context the learner provides about projects/experience
     * outside StarCi that the AI should weave into the revised CV.
     */
    extraPrompts?: string
    /** Concrete model the user picked in the CV-generation model picker; undefined = balancer default. */
    selectedModel?: string
    /** Provider serving {@link ReviseCvRequest.selectedModel}. */
    selectedModelProvider?: ModelProvider
    /** Optional course/track (`courses.id`, decoded from its global id) to tie this CV to. */
    courseId?: string
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
