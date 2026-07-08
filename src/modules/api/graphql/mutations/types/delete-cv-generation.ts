import type { GraphQLResponse, QueryVariables } from "../../types"

/** GraphQL `DeleteCvGenerationRequest` body. */
export interface DeleteCvGenerationRequest {
    /** `cv_generations.id` to delete. */
    id: string
}

/** Payload inside `deleteCvGeneration.data` after the standard API wrapper. */
export interface DeleteCvGenerationResponseData {
    /** `cv_generations.id` of the deleted row. */
    id: string
}

/** Apollo variables bag for the `deleteCvGeneration` mutation. */
export type MutateDeleteCvGenerationVariables = QueryVariables<DeleteCvGenerationRequest>

/** Apollo response shape for `deleteCvGeneration`. */
export interface MutateDeleteCvGenerationResponse {
    /** Top-level `deleteCvGeneration` field wrapping the standard API response. */
    deleteCvGeneration: GraphQLResponse<DeleteCvGenerationResponseData>
}
