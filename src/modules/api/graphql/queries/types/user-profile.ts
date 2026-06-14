import type { UserEntity } from "@/modules/types"
import type { GraphQLResponse } from "../../types"

/** Apollo response shape for the `userProfile` query. */
export interface QueryUserProfileResponse {
    /** Top-level `userProfile` field wrapping the standard API response. */
    userProfile: GraphQLResponse<UserEntity>
}
