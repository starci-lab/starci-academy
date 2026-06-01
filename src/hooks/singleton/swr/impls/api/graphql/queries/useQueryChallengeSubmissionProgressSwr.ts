import { SwrContext } from "@/hooks/singleton"
import { use } from "react"

/**
 * Per-user challenge submission progress for the active course (`challengeSubmissionProgress`).
 * The result is also mirrored into `challenge.completionTasks` for per-row lookups.
 */
export const useQueryChallengeSubmissionProgressSwr = () => {
    const { queryChallengeSubmissionProgressSwr } = use(SwrContext)!
    return queryChallengeSubmissionProgressSwr
}
