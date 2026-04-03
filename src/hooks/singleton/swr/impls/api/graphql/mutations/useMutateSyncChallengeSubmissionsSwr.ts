import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

export const useMutateSyncChallengeSubmissionsSwr = () => {
    const { mutateSyncChallengeSubmissionsSwr } = use(SwrContext)!
    return mutateSyncChallengeSubmissionsSwr
}
