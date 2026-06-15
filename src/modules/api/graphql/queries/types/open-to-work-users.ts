import type { UserEntity } from "@/modules/types"
import type { GraphQLResponse } from "../../types"

/** Variables for the `openToWorkUsers` query. */
export interface QueryOpenToWorkUsersRequest {
    /** Max users per page. */
    limit?: number
    /** Rows to skip (offset pagination). */
    offset?: number
}

/** Apollo response shape for the `openToWorkUsers` query (talent directory). */
export interface QueryOpenToWorkUsersResponse {
    /** Top-level `openToWorkUsers` field wrapping the standard API response. */
    openToWorkUsers: GraphQLResponse<Array<UserEntity>>
}
