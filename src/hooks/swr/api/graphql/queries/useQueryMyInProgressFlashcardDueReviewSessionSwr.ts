import useSWR from "swr"
import { queryMyInProgressFlashcardDueReviewSession } from "@/modules/api/graphql/queries/query-my-in-progress-flashcard-due-review-session"
import type { MyInProgressFlashcardDueReviewSessionData } from "@/modules/api/graphql/queries/types/my-in-progress-flashcard-due-review-session"
import { GraphQLHeadersKey, type GraphQLHeaders } from "@/modules/api/graphql/types"
import { useAppSelector } from "@/redux/hooks"

/**
 * SWR wrapper for {@link queryMyInProgressFlashcardDueReviewSession}. `data`
 * is the viewer's resumable in-progress cross-deck DueReview batch session
 * for the given course (24h TTL, `status="in_progress"` only), or `null`
 * when there is none. Course-scoped and enrolled-only — only runs once a
 * `courseId` is known and the viewer is authenticated. Sends `X-Course-Id`
 * so the backend enrollment guard (which reads the header, not the query
 * variable) can check enrollment. Mirrors
 * `useQueryMyInProgressFlashcardQuizSessionSwr`.
 *
 * @param courseId - course whose resumable due-review batch to check for.
 */
export const useQueryMyInProgressFlashcardDueReviewSessionSwr = (courseId: string | undefined) => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    return useSWR<MyInProgressFlashcardDueReviewSessionData | null>(
        courseId && authenticated
            ? ["QUERY_MY_IN_PROGRESS_FLASHCARD_DUE_REVIEW_SESSION_SWR", courseId]
            : null,
        async () => {
            if (!courseId) {
                throw new Error("Course id not found")
            }
            const headers: GraphQLHeaders = { [GraphQLHeadersKey.XCourseId]: courseId }
            // unwrap the standard API envelope; null when absent (no resumable session)
            const result = await queryMyInProgressFlashcardDueReviewSession({
                request: { courseId },
                headers,
            })
            return result.data?.myInProgressFlashcardDueReviewSession?.data ?? null
        },
    )
}
