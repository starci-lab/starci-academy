import useSWR from "swr"
import { queryContentComments } from "@/modules/api/graphql/queries/query-content-comments"
import type { CommentNode } from "@/modules/api/graphql/queries/types/discussion"

/** Page size for a parent's direct replies (loaded in one shot). */
const REPLIES_LIMIT = 50

/**
 * SWR hook for the direct replies of a comment thread — pass a question/comment
 * id as `parentCommentId` to load its top-level answers. Keyed by
 * `parentCommentId` so each thread caches independently. Pass `enabled=false`
 * to skip fetching until the thread is actually expanded.
 *
 * @param parentCommentId - the comment (or question) whose direct replies to load
 * @param enabled - whether to fetch (skip until expanded)
 * @returns the SWR handle (data = Array<CommentNode>, isLoading, error, mutate)
 */
export const useQueryContentCommentsSwr = (parentCommentId: string, enabled = true) => {
    return useSWR<Array<CommentNode>>(
        // null key disables the request until the thread is opened
        enabled ? ["QUERY_CONTENT_COMMENTS_SWR", parentCommentId] : null,
        async () => {
            const response = await queryContentComments({
                request: {
                    parentCommentId,
                    limit: REPLIES_LIMIT,
                },
            })
            return response.data?.contentComments.data?.comments ?? []
        },
    )
}
