import type { GraphQLResponse, QueryVariables } from "../../types"

/** GraphQL `DeleteCvBlocksRequest` body. */
export interface DeleteCvBlocksRequest {
    /** `cv_blocks.id` to delete. */
    id: string
}

/** Payload inside `deleteCvBlocks.data` after the standard API wrapper. */
export interface DeleteCvBlocksResponseData {
    /** `cv_blocks.id` of the deleted row. */
    id: string
}

/** Apollo variables bag for the `deleteCvBlocks` mutation. */
export type MutateDeleteCvBlocksVariables = QueryVariables<DeleteCvBlocksRequest>

/** Apollo response shape for `deleteCvBlocks`. */
export interface MutateDeleteCvBlocksResponse {
    /** Top-level `deleteCvBlocks` field wrapping the standard API response. */
    deleteCvBlocks: GraphQLResponse<DeleteCvBlocksResponseData>
}
