import useSWR from "swr"
import { queryMyFlashcardQuizSessionBySessionId } from "@/modules/api/graphql/queries/query-my-flashcard-quiz-session-by-session-id"
import type { MyFlashcardQuizSessionBySessionIdData } from "@/modules/api/graphql/queries/types/my-flashcard-quiz-session-by-session-id"
import { GraphQLHeadersKey, type GraphQLHeaders } from "@/modules/api/graphql/types"
import { useAppSelector } from "@/redux/hooks"

/**
 * SWR wrapper for {@link queryMyFlashcardQuizSessionBySessionId} — resolves ONE
 * "Hỏi nhanh" quiz session's persisted snapshot by its id alone, owner-scoped and
 * status-agnostic. Feeds the URL-addressable quiz RESULT surface and the
 * revisit-a-finished-session-by-URL fork: the returned `status` is how the caller
 * tells a `completed`/`abandoned` session apart from an `in_progress` one (the
 * sibling `myInProgressFlashcardQuizSession` query is in-progress-only and doesn't
 * expose coverage/xp/weakTags/status). `null` data = not found / not owned.
 *
 * @param sessionId - session to resolve (undefined skips the fetch).
 * @param courseId - owning course, for the enrollment guard header.
 */
export const useQueryMyFlashcardQuizSessionBySessionIdSwr = (
    sessionId: string | undefined,
    courseId: string | undefined,
) => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    return useSWR<MyFlashcardQuizSessionBySessionIdData | null>(
        sessionId && courseId && authenticated
            ? ["QUERY_MY_FLASHCARD_QUIZ_SESSION_BY_SESSION_ID_SWR", sessionId]
            : null,
        async () => {
            if (!sessionId || !courseId) {
                throw new Error("Session id not found")
            }
            const headers: GraphQLHeaders = { [GraphQLHeadersKey.XCourseId]: courseId }
            // unwrap the standard API envelope; null when absent (not found/not owned)
            const result = await queryMyFlashcardQuizSessionBySessionId({
                request: { sessionId },
                headers,
            })
            return result.data?.myFlashcardQuizSessionBySessionId?.data ?? null
        },
    )
}
