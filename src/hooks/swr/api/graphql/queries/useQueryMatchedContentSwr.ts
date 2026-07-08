import useSWR from "swr"
import { queryPublicContent } from "@/modules/api/graphql/queries/query-public-content"

/**
 * Resolves the FIRST id in a mock-interview session's `matchedContentIds` into its
 * title + owning module id — just enough to render a "Xem trong bài học" citation
 * with a working deep link (`learn().module(moduleId).content(contentId)` needs both).
 *
 * Deliberately resolves only the first match (not every matched id): the RAG
 * retrieval already ranks matches by relevance, and one representative citation is
 * all {@link import("@/components/features/learn/MockInterview/MockInterviewScorecard").MockInterviewScorecard}
 * needs — avoids an N-query fan-out for a feature (`publicContent`) that has no
 * batch-by-ids form today. `null` while there's nothing to resolve; the caller falls
 * back to a plain, un-cited deep link when this query errors or the content is gone
 * (never fabricate a title).
 *
 * @param contentId - first entry of `matchedContentIds`, or `undefined` when empty.
 */
export const useQueryMatchedContentSwr = (contentId: string | undefined) => {
    return useSWR(
        contentId ? ["QUERY_MATCHED_CONTENT_SWR", contentId] : null,
        async () => {
            if (!contentId) {
                throw new Error("Matched content id not found")
            }
            const result = await queryPublicContent({ request: { id: contentId } })
            return result.data?.publicContent?.data ?? null
        },
    )
}
