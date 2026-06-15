import type { UserEntity } from "@/modules/types"
import type { GraphQLResponse } from "../../types"

/** GraphQL `UpdateProfileRequest` body (partial update; null clears a field). */
export interface UpdateProfileRequest {
    /** New display name; null clears it (UI falls back to username). */
    displayName?: string | null
    /** New short bio / tagline; null clears it. */
    bio?: string | null
    /** New avatar public URL (from the avatar-upload endpoint); null clears it. */
    avatar?: string | null
    /** Lock the profile (true = only the owner sees full content); omit to leave unchanged. */
    profileLocked?: boolean
}

/** Apollo response shape for `updateProfile` (returns the fresh user). */
export interface MutateUpdateProfileResponse {
    /** Top-level `updateProfile` field wrapping the standard API response. */
    updateProfile: GraphQLResponse<UserEntity>
}
