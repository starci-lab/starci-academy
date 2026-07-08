import useSWR from "swr"
import { queryMyMockInterviewStats } from "@/modules/api/graphql/queries/query-my-mock-interview-stats"
import type { QueryMyMockInterviewStatsResponseData } from "@/modules/api/graphql/queries/types/my-mock-interview-stats"
import { GraphQLHeadersKey, type GraphQLHeaders } from "@/modules/api/graphql/types"
import { useAppSelector } from "@/redux/hooks"

/**
 * SWR wrapper for {@link queryMyMockInterviewStats}. `data` is the viewer's
 * aggregated mock-interview stats for the given course, or `null`.
 * Course-scoped and enrolled-only — only runs once a `courseId` is known and
 * the viewer is authenticated. Sends `X-Course-Id` so the backend
 * `GraphQLMustEnrolledGuard` (which reads the header, not the query
 * variable) can check enrollment.
 *
 * @param courseId - course whose mock-interview stats to fetch.
 */
export const useQueryMyMockInterviewStatsSwr = (
    courseId: string | undefined,
) => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    return useSWR<QueryMyMockInterviewStatsResponseData | null>(
        courseId && authenticated
            ? ["QUERY_MY_MOCK_INTERVIEW_STATS_SWR", courseId]
            : null,
        async () => {
            if (!courseId) {
                throw new Error("Course id not found")
            }
            const headers: GraphQLHeaders = { [GraphQLHeadersKey.XCourseId]: courseId }
            const result = await queryMyMockInterviewStats({
                request: { courseId },
                headers,
            })
            return result.data?.myMockInterviewStats?.data ?? null
        },
    )
}
