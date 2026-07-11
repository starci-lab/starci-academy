import type { GraphQLResponse } from "../../types"

/** Request body for the `createPlaygroundSession` mutation. */
export interface CreatePlaygroundSessionRequest {
    /** The playground exercise being started. */
    playgroundId: string
}

/** Payload inside `createPlaygroundSession.data` after the standard API wrapper. */
export interface CreatePlaygroundSessionData {
    /** Id of the persisted session — subscribe to this on the `/playground-byom` socket. */
    id: string
    /** Short code the learner enters into the local CLI agent to pair it with this session. */
    pairingCode: string
}

/** Apollo response shape for `createPlaygroundSession`. */
export interface MutateCreatePlaygroundSessionResponse {
    /** Top-level `createPlaygroundSession` field wrapping the standard API response. */
    createPlaygroundSession: GraphQLResponse<CreatePlaygroundSessionData>
}
