import type { GraphQLResponse } from "../../types"

/** GraphQL `RenameContentAiSessionRequest` body. */
export interface RenameContentAiSessionRequest {
    /** Conversation (session) to rename. */
    sessionId: string
    /** New title (≤200 chars). Blank resets the session to auto-titling. */
    title: string
}

/** Payload inside `renameContentAiSession.data` after the standard API wrapper. */
export interface RenameContentAiSessionData {
    /** Whether the conversation was renamed. */
    renamed: boolean
}

/** Apollo response shape for `renameContentAiSession`. */
export interface MutateRenameContentAiSessionResponse {
    /** Top-level `renameContentAiSession` field wrapping the standard API response. */
    renameContentAiSession: GraphQLResponse<RenameContentAiSessionData>
}
