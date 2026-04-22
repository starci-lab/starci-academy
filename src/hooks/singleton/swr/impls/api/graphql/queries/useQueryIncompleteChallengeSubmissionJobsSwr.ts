import { SwrContext } from "@/hooks/singleton"
import { use } from "react"

/**
 * SWR for `incompleteChallengeSubmissionJobs` (see core hook for cache key and headers).
 */
export const useQueryIncompleteChallengeSubmissionJobsSwr = () => {
    const { queryIncompleteChallengeSubmissionJobsSwr } = use(SwrContext)!
    return queryIncompleteChallengeSubmissionJobsSwr
}
