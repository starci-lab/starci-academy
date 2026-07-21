import useSWRMutation from "swr/mutation"
import { mutateAcceptAnswer } from "@/modules/api/graphql/mutations/mutation-accept-answer"
import type { AcceptAnswerRequest } from "@/modules/api/graphql/mutations/types/discussion"

type MutateAcceptAnswerResult = Awaited<ReturnType<typeof mutateAcceptAnswer>>

/**
 * SWR mutation wrapper for {@link mutateAcceptAnswer}. Accept a reply as the
 * answer with `accepted: true`; clear it with `accepted: false`.
 */
export const useMutateAcceptAnswerSwr = () => {
    /** The SWR mutation. */
    const swr = useSWRMutation<
        MutateAcceptAnswerResult,
        Error,
        string,
        AcceptAnswerRequest
    >(
        "MUTATE_ACCEPT_ANSWER_SWR",
        async (_key, { arg }) => {
            return mutateAcceptAnswer({
                request: arg,
            })
        }
    )
    /** Return the SWR mutation. */
    return swr
}
