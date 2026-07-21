import type { GraphQLResponse } from "../../types"

/** GraphQL `SetContentAiSessionArchivedRequest` body. */
export interface SetContentAiSessionArchivedRequest {
    /** Conversation (session) to archive / unarchive. */
    sessionId: string
    /** true = archive (stamp archived_at); false = unarchive (clear it). */
    archived: boolean
}

/** Payload inside `setContentAiSessionArchived.data` after the standard API wrapper. */
export interface SetContentAiSessionArchivedData {
    /** The conversation's resulting archived state. */
    archived: boolean
}

/** Apollo response shape for `setContentAiSessionArchived`. */
export interface MutateSetContentAiSessionArchivedResponse {
    /** Top-level `setContentAiSessionArchived` field wrapping the standard API response. */
    setContentAiSessionArchived: GraphQLResponse<SetContentAiSessionArchivedData>
}
