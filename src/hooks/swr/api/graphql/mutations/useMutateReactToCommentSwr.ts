import useSWRMutation from "swr/mutation"
import { mutateReactToComment } from "@/modules/api/graphql/mutations/mutation-react-to-comment"
import type { ReactToCommentRequest } from "@/modules/api/graphql/mutations/types/discussion"

type MutateReactToCommentResult = Awaited<ReturnType<typeof mutateReactToComment>>

/**
 * SWR mutation wrapper for {@link mutateReactToComment}. Set/change a
 * reaction by passing `type`; remove it with `type: null`.
 */
export const useMutateReactToCommentSwr = () => {
    /** The SWR mutation. */
    const swr = useSWRMutation<
        MutateReactToCommentResult,
        Error,
        string,
        ReactToCommentRequest
    >(
        "MUTATE_REACT_TO_COMMENT_SWR",
        async (_key, { arg }) => {
            return mutateReactToComment({
                request: arg,
            })
        }
    )
    /** Return the SWR mutation. */
    return swr
}
