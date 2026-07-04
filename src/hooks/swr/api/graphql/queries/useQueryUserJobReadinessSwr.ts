import useSWR from "swr"
import { queryUserJobReadiness } from "@/modules/api/graphql/queries/query-user-job-readiness"
import type { JobReadinessData } from "@/modules/api/graphql/queries/types/job-readiness"

/**
 * SWR wrapper for {@link queryUserJobReadiness}. `data` is the user's public
 * job-readiness portfolio (composite + tracks + foundation), or `null`. Keyed by
 * user id — serves both the viewer's own profile and a recruiter viewing
 * another. Only runs once a `userId` is known.
 *
 * @param userId - id of the profile owner whose readiness to fetch.
 */
export const useQueryUserJobReadinessSwr = (userId: string | null | undefined) => {
    return useSWR<JobReadinessData | null>(
        userId ? ["QUERY_USER_JOB_READINESS_SWR", userId] : null,
        async () => {
            if (!userId) {
                throw new Error("User id not found")
            }
            // unwrap the standard API envelope; null when absent
            const result = await queryUserJobReadiness({
                request: { userId },
            })
            return result.data?.userJobReadiness?.data ?? null
        },
    )
}
