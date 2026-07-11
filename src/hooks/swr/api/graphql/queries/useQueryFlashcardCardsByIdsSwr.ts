import useSWR from "swr"
import { queryFlashcardCardsByIds } from "@/modules/api/graphql/queries/query-flashcard-cards-by-ids"
import type { FlashcardByIdCard } from "@/modules/api/graphql/queries/types/flashcard-cards-by-ids"
import { GraphQLHeadersKey, type GraphQLHeaders } from "@/modules/api/graphql/types"
import { useAppSelector } from "@/redux/hooks"

/**
 * SWR wrapper for {@link queryFlashcardCardsByIds} — hydrates the TEXT of an exact
 * set of flashcard ids (front/back + deck title), regardless of due status. Feeds
 * the quiz RESULT surface's per-card breakdown, which overlays each card's persisted
 * blank score onto its re-fetched text. Skips the fetch when there are no ids.
 *
 * @param cardIds - the exact ids to hydrate (empty skips the fetch).
 * @param courseId - owning course, for the enrollment guard header + review-row join scope.
 */
export const useQueryFlashcardCardsByIdsSwr = (
    cardIds: Array<string>,
    courseId: string | undefined,
) => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const key = cardIds.join(",")
    return useSWR<Array<FlashcardByIdCard>>(
        cardIds.length > 0 && courseId && authenticated
            ? ["QUERY_FLASHCARD_CARDS_BY_IDS_SWR", key]
            : null,
        async () => {
            if (!courseId) {
                throw new Error("Course id not found")
            }
            const headers: GraphQLHeaders = { [GraphQLHeadersKey.XCourseId]: courseId }
            const result = await queryFlashcardCardsByIds({
                request: { courseId, cardIds },
                headers,
            })
            return result.data?.flashcardCardsByIds?.data?.cards ?? []
        },
    )
}
