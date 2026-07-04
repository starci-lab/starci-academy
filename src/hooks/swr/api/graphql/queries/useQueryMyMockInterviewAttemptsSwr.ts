import useSWR from "swr"
import { queryMyMockInterviewAttempts } from "@/modules/api/graphql/queries/query-my-mock-interview-attempts"
import type { QueryMyMockInterviewAttemptsResponseData } from "@/modules/api/graphql/queries/types/my-mock-interview-attempts"
import { GraphQLHeadersKey, type GraphQLHeaders } from "@/modules/api/graphql/types"
import { useAppSelector } from "@/redux/hooks"

/**
 * SWR wrapper for {@link queryMyMockInterviewAttempts}. `data` is a page of the
 * viewer's mock-interview history for the given course (newest first), or
 * `null`. Course-scoped and enrolled-only — only runs once a `courseId` is
 * known and the viewer is authenticated. Sends `X-Course-Id` so the backend
 * `GraphQLMustEnrolledGuard` (which reads the header, not the query variable)
 * can check enrollment.
 *
 * @param courseId - course whose mock-interview history to fetch.
 * @param limit - page size (attempts per page); server defaults to 10.
 * @param offset - page offset (attempts to skip); server defaults to 0.
 */
export const useQueryMyMockInterviewAttemptsSwr = (
    courseId: string | undefined,
    limit?: number,
    offset?: number,
) => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    return useSWR<QueryMyMockInterviewAttemptsResponseData | null>(
        courseId && authenticated
            ? ["QUERY_MY_MOCK_INTERVIEW_ATTEMPTS_SWR", courseId, limit, offset]
            : null,
        async () => {
            if (!courseId) {
                throw new Error("Course id not found")
            }
            const headers: GraphQLHeaders = { [GraphQLHeadersKey.XCourseId]: courseId }
            // unwrap the standard API envelope; null when absent
            const result = await queryMyMockInterviewAttempts({
                request: { courseId, limit, offset },
                headers,
            })
            return result.data?.myMockInterviewAttempts?.data ?? null
        },
    )
}
