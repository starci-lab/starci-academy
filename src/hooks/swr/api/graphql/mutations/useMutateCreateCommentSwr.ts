import useSWRMutation from "swr/mutation"
import { mutateCreateComment } from "@/modules/api/graphql/mutations/mutation-create-comment"
import type { CreateCommentRequest } from "@/modules/api/graphql/mutations/types/discussion"

type MutateCreateCommentResult = Awaited<ReturnType<typeof mutateCreateComment>>

/**
 * SWR mutation wrapper for {@link mutateCreateComment}. Creates a comment —
 * a top-level answer (`parentCommentId` = the question/content id) or a
 * reply-to-reply.
 */
export const useMutateCreateCommentSwr = () => {
    /** The SWR mutation. */
    const swr = useSWRMutation<
        MutateCreateCommentResult,
        Error,
        string,
        CreateCommentRequest
    >(
        "MUTATE_CREATE_COMMENT_SWR",
        async (_key, { arg }) => {
            return mutateCreateComment({
                request: arg,
            })
        }
    )
    /** Return the SWR mutation. */
    return swr
}
