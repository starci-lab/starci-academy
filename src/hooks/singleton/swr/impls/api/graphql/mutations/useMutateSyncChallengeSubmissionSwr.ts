import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR mutation singleton for syncing a challenge submission URL.
 * @returns the SWR mutation handle from {@link SwrContext}.
 */
export const useMutateSyncChallengeSubmissionSwr = () => {
    const { mutateSyncChallengeSubmissionsSwr } = use(SwrContext)!
    return mutateSyncChallengeSubmissionsSwr
}
