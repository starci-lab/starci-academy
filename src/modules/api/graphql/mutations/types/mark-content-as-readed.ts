import type { GraphQLResponse, QueryVariables } from "../../types"

/** GraphQL `MarkAsReadedRequest` body. */
export interface MarkContentAsReadedRequest {
    /** ID of the content to mark as read/unread. */
    contentId: string
    /** `true` to mark as read, `false` to mark as unread. */
    readed: boolean
}

/** Payload inside `markContentAsReaded.data` after the standard API wrapper. */
export interface MarkContentAsReadedData {
    /** User-content relationship record ID. */
    id: string
    /** Updated read state. */
    isRead: boolean
}

/** Apollo variables bag for the `markContentAsReaded` mutation. */
export type MutateMarkContentAsReadedVariables = QueryVariables<MarkContentAsReadedRequest>

/** Apollo response shape for `markContentAsReaded`. */
export interface MutateMarkContentAsReadedResponse {
    /** Top-level `markContentAsReaded` field wrapping the standard API response. */
    markContentAsReaded: GraphQLResponse<MarkContentAsReadedData>
}
