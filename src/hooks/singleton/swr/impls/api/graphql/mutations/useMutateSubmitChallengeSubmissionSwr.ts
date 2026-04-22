import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

export const useMutateSubmitChallengeSubmissionSwr = () => {
    const { mutateSubmitChallengeSubmissionSwr } = use(SwrContext)!
    return mutateSubmitChallengeSubmissionSwr
}
