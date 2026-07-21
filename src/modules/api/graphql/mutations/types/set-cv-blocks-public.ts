import type { GraphQLResponse } from "../../types"

/** GraphQL `SetCvBlocksPublicRequest` body (flip a CV's public flag). */
export interface SetCvBlocksPublicRequest {
    /** `cv_blocks.id` to flag. */
    id: string
    /** Target public state; turning one on turns any other public CV off (single-public-per-user, BE-enforced). */
    isPublic: boolean
}

/** Payload inside `setCvBlocksPublic.data` after the standard API wrapper. */
export interface SetCvBlocksPublicResponseData {
    /** `cv_blocks.id` of the flagged row. */
    id: string
    /** The resulting public state of that row. */
    isPublic: boolean
}

/** Apollo response shape for the `setCvBlocksPublic` mutation. */
export interface MutateSetCvBlocksPublicResponse {
    /** Top-level `setCvBlocksPublic` field wrapping the standard API response. */
    setCvBlocksPublic: GraphQLResponse<SetCvBlocksPublicResponseData>
}
