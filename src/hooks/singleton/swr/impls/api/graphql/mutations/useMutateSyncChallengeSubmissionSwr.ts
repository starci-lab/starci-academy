import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

export const useMutateSyncChallengeSubmissionSwr = () => {
    const { mutateSyncChallengeSubmissionsSwr } = use(SwrContext)!
    return mutateSyncChallengeSubmissionsSwr
}
