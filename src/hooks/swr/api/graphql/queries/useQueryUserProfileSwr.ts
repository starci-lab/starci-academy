import { queryUserProfile } from "@/modules/api"
import useSWR from "swr"

/**
 * SWR query wrapper for {@link queryUserProfile}. `data` is the unwrapped public
 * user (or `null` when not found). Keyed by the target user id; runs whenever an
 * id is provided (works for anonymous viewers too).
 *
 * @param userId - The id of the user whose public profile to fetch.
 */
export const useQueryUserProfileSwr = (userId: string | null | undefined) => {
    const swr = useSWR(
        userId ? ["QUERY_USER_PROFILE_SWR", userId] : null,
        async () => {
            const data = await queryUserProfile({
                request: {
                    userId: userId as string,
                },
            })

            if (!data || !data.data) {
                throw new Error("Failed to fetch user profile")
            }

            return data.data.userProfile?.data ?? null
        },
    )

    return swr
}
