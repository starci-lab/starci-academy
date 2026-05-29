import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR mutation singleton for queuing an AI CV review.
 * @returns the SWR mutation handle from {@link SwrContext}.
 */
export const useMutateReviewCvSwr = () => {
    const { mutateReviewCvSwr } = use(SwrContext)!
    return mutateReviewCvSwr
}
