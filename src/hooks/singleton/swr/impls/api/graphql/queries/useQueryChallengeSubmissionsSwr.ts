import { SwrContext } from "@/hooks/singleton"
import { use } from "react"

/**
 * Lists submission requirements for the focused challenge (`challengeSubmissions`).
 * Runs when `challenge.id` (or loaded `challenge.entity.id`) and course context exist.
 */
export const useQueryChallengeSubmissionsSwr = () => {
    const { queryChallengeSubmissionsSwr } = use(SwrContext)!
    return queryChallengeSubmissionsSwr
}
