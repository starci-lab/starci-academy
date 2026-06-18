import {
    mutateReviewFlashcard,
    type ReviewFlashcardRequest,
} from "@/modules/api"
import useSWRMutation from "swr/mutation"

type MutateReviewFlashcardResult = Awaited<ReturnType<typeof mutateReviewFlashcard>>

/**
 * SWR mutation wrapper for {@link mutateReviewFlashcard} (Bearer from Keycloak).
 */
export const useMutateReviewFlashcardSwr = () => {
    /** The SWR mutation. */
    const swr = useSWRMutation<
        MutateReviewFlashcardResult,
        Error,
        string,
        ReviewFlashcardRequest
    >(
        "MUTATE_REVIEW_FLASHCARD_SWR",
        async (_key, { arg }) => {
            return mutateReviewFlashcard({
                request: arg,
            })
        }
    )
    /** Return the SWR mutation. */
    return swr
}
