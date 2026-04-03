import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

export const useMutateSubmitChallengeSubmissionsSwr = () => {
    const { mutateSubmitChallengeSubmissionsSwr } = use(SwrContext)!
    return mutateSubmitChallengeSubmissionsSwr
}
