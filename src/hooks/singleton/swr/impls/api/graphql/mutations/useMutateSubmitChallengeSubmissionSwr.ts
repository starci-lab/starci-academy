import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR mutation singleton for submitting a challenge submission.
 * @returns the SWR mutation handle from {@link SwrContext}.
 */
export const useMutateSubmitChallengeSubmissionSwr = () => {
    const { mutateSubmitChallengeSubmissionSwr } = use(SwrContext)!
    return mutateSubmitChallengeSubmissionSwr
}
