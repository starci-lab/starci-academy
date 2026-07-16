import useSWRMutation from "swr/mutation"
import { mutateUpdateComment } from "@/modules/api/graphql/mutations/mutation-update-comment"
import type { UpdateCommentRequest } from "@/modules/api/graphql/mutations/types/discussion"

type MutateUpdateCommentResult = Awaited<ReturnType<typeof mutateUpdateComment>>

/** SWR mutation wrapper for {@link mutateUpdateComment}. Edits a comment's body (author only). */
export const useMutateUpdateCommentSwr = () => {
    /** The SWR mutation. */
    const swr = useSWRMutation<
        MutateUpdateCommentResult,
        Error,
        string,
        UpdateCommentRequest
    >(
        "MUTATE_UPDATE_COMMENT_SWR",
        async (_key, { arg }) => {
            return mutateUpdateComment({
                request: arg,
            })
        }
    )
    /** Return the SWR mutation. */
    return swr
}
