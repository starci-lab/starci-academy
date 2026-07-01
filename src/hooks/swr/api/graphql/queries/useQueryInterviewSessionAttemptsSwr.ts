import useSWR from "swr"
import { queryInterviewSessionAttempts } from "@/modules/api/graphql/queries/query-interview-session-attempts"
import type { InterviewSessionAttemptItem } from "@/modules/api/graphql/queries/types/interview-session-attempts"
import { GraphQLHeadersKey, type GraphQLHeaders } from "@/modules/api/graphql/types"
import { useAppSelector } from "@/redux/hooks"

/**
 * SWR wrapper for {@link queryInterviewSessionAttempts}: the answered questions
 * of ONE interview run (with grade + feedback). Only fires when a `sessionId` is
 * set (i.e. the detail drawer is open) and the viewer is authenticated. Sends the
 * `X-Course-Id` header for the enrolled-only guard.
 *
 * @param courseId - Course the run belongs to.
 * @param sessionId - The run's session id, or null when the drawer is closed.
 */
export const useQueryInterviewSessionAttemptsSwr = (courseId: string, sessionId: string | null) => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    return useSWR<Array<InterviewSessionAttemptItem> | null>(
        authenticated && sessionId
            ? ["QUERY_INTERVIEW_SESSION_ATTEMPTS_SWR", courseId, sessionId]
            : null,
        async () => {
            const headers: GraphQLHeaders = { [GraphQLHeadersKey.XCourseId]: courseId }
            const result = await queryInterviewSessionAttempts({
                request: { courseId, sessionId: sessionId as string },
                headers,
            })
            return result.data?.interviewSessionAttempts?.data?.items ?? null
        },
    )
}
