import useSWR from "swr"
import { queryMyFlashcardReviewSessionStatsBySessionId } from "@/modules/api/graphql/queries/query-my-flashcard-review-session-stats-by-session-id"
import type { MyFlashcardReviewSessionStatsBySessionIdData } from "@/modules/api/graphql/queries/types/my-flashcard-review-session-stats-by-session-id"
import { GraphQLHeadersKey, type GraphQLHeaders } from "@/modules/api/graphql/types"
import { useAppSelector } from "@/redux/hooks"

/**
 * SWR wrapper for {@link queryMyFlashcardReviewSessionStatsBySessionId} —
 * resolves + aggregates ONE flashcard review session's recap stats by its id
 * alone (whichever kind it is), owner-scoped. Feeds the end-of-session STATS
 * surface and the revisit-a-completed-session-by-URL path: the returned
 * `status` is how the caller tells a `completed`/`abandoned` session apart from
 * an `in_progress` one (the sibling `myFlashcardReviewSessionBySessionId` query
 * doesn't expose status). `null` data = not found / not owned.
 *
 * @param sessionId - session to resolve (undefined skips the fetch).
 * @param courseId - owning course, for the enrollment guard header.
 */
export const useQueryMyFlashcardReviewSessionStatsBySessionIdSwr = (
    sessionId: string | undefined,
    courseId: string | undefined,
) => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    return useSWR<MyFlashcardReviewSessionStatsBySessionIdData | null>(
        sessionId && courseId && authenticated
            ? ["QUERY_MY_FLASHCARD_REVIEW_SESSION_STATS_BY_SESSION_ID_SWR", sessionId]
            : null,
        async () => {
            if (!sessionId || !courseId) {
                throw new Error("Session id not found")
            }
            const headers: GraphQLHeaders = { [GraphQLHeadersKey.XCourseId]: courseId }
            // unwrap the standard API envelope; null when absent (not found/not owned)
            const result = await queryMyFlashcardReviewSessionStatsBySessionId({
                request: { sessionId },
                headers,
            })
            return result.data?.myFlashcardReviewSessionStatsBySessionId?.data ?? null
        },
    )
}
