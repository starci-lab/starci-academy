import type { UserEntity } from "@/modules/types"
import type { GraphQLResponse } from "../../types"

/** Apollo response shape for the `me` query. */
export interface QueryMeResponse {
    /** Top-level `me` field wrapping the standard API response containing the current user. */
    me: GraphQLResponse<UserEntity>
}
