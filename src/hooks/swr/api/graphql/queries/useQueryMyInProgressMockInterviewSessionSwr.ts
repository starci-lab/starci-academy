import useSWR from "swr"
import { queryMyInProgressMockInterviewSession } from "@/modules/api/graphql/queries/query-my-in-progress-mock-interview-session"
import type { MyInProgressMockInterviewSessionData } from "@/modules/api/graphql/queries/types/my-in-progress-mock-interview-session"
import { GraphQLHeadersKey, type GraphQLHeaders } from "@/modules/api/graphql/types"
import { useAppSelector } from "@/redux/hooks"

/**
 * SWR wrapper for {@link queryMyInProgressMockInterviewSession}. `data` is the
 * viewer's resumable in-progress mock-interview session for the given course
 * (24h TTL, `status="in_progress"` only), or `null` when there is none.
 * Course-scoped and enrolled-only — only runs once a `courseId` is known and
 * the viewer is authenticated. Sends `X-Course-Id` so the backend
 * `GraphQLMustEnrolledGuard` (which reads the header, not the query variable)
 * can check enrollment.
 *
 * @param courseId - course whose resumable session to check for.
 */
export const useQueryMyInProgressMockInterviewSessionSwr = (courseId: string | undefined) => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    return useSWR<MyInProgressMockInterviewSessionData | null>(
        courseId && authenticated
            ? ["QUERY_MY_IN_PROGRESS_MOCK_INTERVIEW_SESSION_SWR", courseId]
            : null,
        async () => {
            if (!courseId) {
                throw new Error("Course id not found")
            }
            const headers: GraphQLHeaders = { [GraphQLHeadersKey.XCourseId]: courseId }
            // unwrap the standard API envelope; null when absent (no resumable session)
            const result = await queryMyInProgressMockInterviewSession({
                request: { courseId },
                headers,
            })
            return result.data?.myInProgressMockInterviewSession?.data ?? null
        },
    )
}
