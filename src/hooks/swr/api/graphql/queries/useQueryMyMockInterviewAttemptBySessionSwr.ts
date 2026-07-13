import useSWR from "swr"
import { queryMyMockInterviewAttemptBySession } from "@/modules/api/graphql/queries/query-my-mock-interview-attempt-by-session"
import type { MockInterviewAttemptItem } from "@/modules/api/graphql/queries/types/my-mock-interview-attempts"
import { GraphQLHeadersKey, type GraphQLHeaders } from "@/modules/api/graphql/types"
import { useAppSelector } from "@/redux/hooks"

/**
 * SWR wrapper for {@link queryMyMockInterviewAttemptBySession} — resolves ONE
 * mock-interview session's GRADED attempt by its session id alone, owner-scoped.
 * Feeds the URL-addressable interview RESULT surface: `null` data means no graded
 * attempt exists yet for that session (still in progress, or the id doesn't
 * belong to the viewer/course) — the caller renders a not-found fallback rather
 * than an error, same convention as
 * {@link import("./useQueryMyFlashcardQuizSessionBySessionIdSwr").useQueryMyFlashcardQuizSessionBySessionIdSwr}.
 *
 * @param sessionId - session to resolve (undefined skips the fetch).
 * @param courseId - owning course, for the enrollment guard header.
 */
export const useQueryMyMockInterviewAttemptBySessionSwr = (
    sessionId: string | undefined,
    courseId: string | undefined,
) => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    return useSWR<MockInterviewAttemptItem | null>(
        sessionId && courseId && authenticated
            ? ["QUERY_MY_MOCK_INTERVIEW_ATTEMPT_BY_SESSION_SWR", sessionId]
            : null,
        async () => {
            if (!sessionId || !courseId) {
                throw new Error("Session id not found")
            }
            const headers: GraphQLHeaders = { [GraphQLHeadersKey.XCourseId]: courseId }
            const result = await queryMyMockInterviewAttemptBySession({
                request: { courseId, sessionId },
                headers,
            })
            return result.data?.myMockInterviewAttemptBySessionId?.data ?? null
        },
    )
}
