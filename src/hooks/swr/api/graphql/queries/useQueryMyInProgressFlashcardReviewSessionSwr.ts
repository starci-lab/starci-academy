import useSWR from "swr"
import { queryMyInProgressFlashcardReviewSession } from "@/modules/api/graphql/queries/query-my-in-progress-flashcard-review-session"
import type { MyInProgressFlashcardReviewSessionData } from "@/modules/api/graphql/queries/types/my-in-progress-flashcard-review-session"
import { GraphQLHeadersKey, type GraphQLHeaders } from "@/modules/api/graphql/types"
import { useAppSelector } from "@/redux/hooks"

/**
 * SWR wrapper for {@link queryMyInProgressFlashcardReviewSession}. `data` is
 * the viewer's resumable in-progress "Học thẻ" review session for the given
 * deck (24h TTL, `status="in_progress"` only), or `null` when there is none.
 * Deck-scoped and enrolled-only — only runs once a `deckId` is known and the
 * viewer is authenticated. Sends `X-Course-Id` so the backend enrollment
 * guard (which reads the header, not the query variable) can check
 * enrollment — mirrors `useQueryMyInProgressFlashcardQuizSessionSwr`.
 *
 * @param deckId - deck whose resumable session to check for.
 * @param courseId - owning course, for the enrollment guard header.
 */
export const useQueryMyInProgressFlashcardReviewSessionSwr = (
    deckId: string | undefined,
    courseId: string | undefined,
) => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    return useSWR<MyInProgressFlashcardReviewSessionData | null>(
        deckId && courseId && authenticated
            ? ["QUERY_MY_IN_PROGRESS_FLASHCARD_REVIEW_SESSION_SWR", deckId]
            : null,
        async () => {
            if (!deckId || !courseId) {
                throw new Error("Deck id not found")
            }
            const headers: GraphQLHeaders = { [GraphQLHeadersKey.XCourseId]: courseId }
            // unwrap the standard API envelope; null when absent (no resumable session)
            const result = await queryMyInProgressFlashcardReviewSession({
                request: { deckId },
                headers,
            })
            return result.data?.myInProgressFlashcardReviewSession?.data ?? null
        },
    )
}
