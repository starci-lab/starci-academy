import useSWR from "swr"
import { queryInterviewSessions } from "@/modules/api/graphql/queries/query-interview-sessions"
import type { QueryInterviewSessionsData } from "@/modules/api/graphql/queries/types/interview-sessions"
import { GraphQLHeadersKey, type GraphQLHeaders } from "@/modules/api/graphql/types"
import { useAppSelector } from "@/redux/hooks"

/** Default page size for the interview-runs list. */
export const INTERVIEW_SESSIONS_PAGE_SIZE = 5

/**
 * SWR wrapper for {@link queryInterviewSessions}: the viewer's paginated
 * mock-interview RUNS for a course. Mock interview is enrolled-only, so the
 * `X-Course-Id` header is sent for the backend `GraphQLMustEnrolledGuard`.
 * Runs only once the viewer is authenticated.
 *
 * @param courseId - Course to scope the runs to.
 * @param page - 1-based page number.
 */
export const useQueryInterviewSessionsSwr = (courseId: string, page: number) => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const limit = INTERVIEW_SESSIONS_PAGE_SIZE
    const offset = (page - 1) * limit
    return useSWR<QueryInterviewSessionsData | null>(
        authenticated ? ["QUERY_INTERVIEW_SESSIONS_SWR", courseId, page] : null,
        async () => {
            const headers: GraphQLHeaders = { [GraphQLHeadersKey.XCourseId]: courseId }
            const result = await queryInterviewSessions({
                request: { courseId, limit, offset },
                headers,
            })
            return result.data?.interviewSessions?.data ?? null
        },
    )
}
