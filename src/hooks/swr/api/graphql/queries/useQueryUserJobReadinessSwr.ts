import useSWR from "swr"
import { queryUserJobReadiness } from "@/modules/api/graphql/queries/query-user-job-readiness"
import type { QueryUserJobReadinessData } from "@/modules/api/graphql/queries/types/user-job-readiness"

/**
 * SWR hook for a user's job-readiness snapshot (global foundation + one
 * depth-card per purchased course track), by id. Public — works for anonymous
 * viewers, and serves both the viewer's own profile and a recruiter viewing
 * another (profiles are addressed by user id). Returns null when the user has
 * nothing to show yet; pass null/undefined userId to disable.
 *
 * @param userId - id of the user whose job-readiness snapshot to fetch
 * @returns the SWR handle (data = `{ foundation, tracks }`, or null)
 */
export const useQueryUserJobReadinessSwr = (userId: string | null | undefined) => {
    const swr = useSWR(
        userId ? ["QUERY_USER_JOB_READINESS_SWR", userId] : null,
        async (): Promise<QueryUserJobReadinessData | null> => {
            const data = await queryUserJobReadiness({
                request: { userId: userId as string },
            })
            if (!data || !data.data) {
                throw new Error("Failed to fetch user job readiness")
            }
            return data.data.userJobReadiness?.data ?? null
        },
    )
    return swr
}
