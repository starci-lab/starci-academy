import useSWRMutation from "swr/mutation"
import { mutateDeleteComment } from "@/modules/api/graphql/mutations/mutation-delete-comment"
import type { DeleteCommentRequest } from "@/modules/api/graphql/mutations/types/discussion"

type MutateDeleteCommentResult = Awaited<ReturnType<typeof mutateDeleteComment>>

/** SWR mutation wrapper for {@link mutateDeleteComment}. Soft-deletes a comment (author only). */
export const useMutateDeleteCommentSwr = () => {
    /** The SWR mutation. */
    const swr = useSWRMutation<
        MutateDeleteCommentResult,
        Error,
        string,
        DeleteCommentRequest
    >(
        "MUTATE_DELETE_COMMENT_SWR",
        async (_key, { arg }) => {
            return mutateDeleteComment({
                request: arg,
            })
        }
    )
    /** Return the SWR mutation. */
    return swr
}
