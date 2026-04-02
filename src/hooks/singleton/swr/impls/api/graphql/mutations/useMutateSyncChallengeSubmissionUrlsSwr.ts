import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

export const useMutateSyncChallengeSubmissionUrlsSwr = () => {
    const { mutateSyncChallengeSubmissionUrlsSwr } = use(SwrContext)!
    return mutateSyncChallengeSubmissionUrlsSwr
}
