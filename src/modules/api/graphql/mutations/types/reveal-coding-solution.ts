import type { GraphQLResponse } from "../../types"

/** Variables for `revealCodingSolution(request)`. */
export interface RevealCodingSolutionRequest {
    /** Slug of the problem whose solution is being revealed. */
    slug: string
}

/** Outcome of revealing a problem's reference solution. */
export interface RevealCodingSolutionPayload {
    /** True when this call recorded a new reveal; false when already revealed. */
    revealed: boolean
}

/** Response for the `revealCodingSolution` mutation. */
export interface MutateRevealCodingSolutionResponse {
    /** Top-level `revealCodingSolution` field. */
    revealCodingSolution: GraphQLResponse<RevealCodingSolutionPayload>
}
