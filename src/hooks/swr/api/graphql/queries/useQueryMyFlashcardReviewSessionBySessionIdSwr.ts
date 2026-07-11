import useSWR from "swr"
import { queryMyFlashcardReviewSessionBySessionId } from "@/modules/api/graphql/queries/query-my-flashcard-review-session-by-session-id"
import type { MyFlashcardReviewSessionBySessionIdData } from "@/modules/api/graphql/queries/types/my-flashcard-review-session-by-session-id"
import { GraphQLHeadersKey, type GraphQLHeaders } from "@/modules/api/graphql/types"
import { useAppSelector } from "@/redux/hooks"

/**
 * SWR wrapper for {@link queryMyFlashcardReviewSessionBySessionId} — resolves a
 * "Học thẻ" session (deck-review or cross-deck due-review) by its id ALONE.
 * The unified `flashcards/review/sessions/[sessionId]` route (thầy
 * 2026-07-11: "bỏ deck đi, only session thôi") uses this to learn which kind
 * it is + the deck identity (when applicable) before rendering
 * `FlashcardReviewer`/`DueReview` — no `deckId` query hint needed, the session
 * row already persists that context server-side.
 *
 * @param sessionId - session to resolve (undefined skips the fetch).
 * @param courseId - owning course, for the enrollment guard header.
 */
export const useQueryMyFlashcardReviewSessionBySessionIdSwr = (
    sessionId: string | undefined,
    courseId: string | undefined,
) => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    return useSWR<MyFlashcardReviewSessionBySessionIdData | null>(
        sessionId && courseId && authenticated
            ? ["QUERY_MY_FLASHCARD_REVIEW_SESSION_BY_SESSION_ID_SWR", sessionId]
            : null,
        async () => {
            if (!sessionId || !courseId) {
                throw new Error("Session id not found")
            }
            const headers: GraphQLHeaders = { [GraphQLHeadersKey.XCourseId]: courseId }
            // unwrap the standard API envelope; null when absent (not found/not owned)
            const result = await queryMyFlashcardReviewSessionBySessionId({
                request: { sessionId },
                headers,
            })
            return result.data?.myFlashcardReviewSessionBySessionId?.data ?? null
        },
    )
}
