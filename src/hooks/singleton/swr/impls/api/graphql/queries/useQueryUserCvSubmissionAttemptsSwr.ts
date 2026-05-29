import { SwrContext } from "@/hooks/singleton/swr/SwrContext"
import { use } from "react"

/**
 * Access the SWR singleton for the user CV submission attempts query.
 * @returns the SWR query handle from {@link SwrContext}.
 */
export const useQueryUserCvSubmissionAttemptsSwr = () => {
    const { queryUserCvSubmissionAttemptsSwr } = use(SwrContext)!
    return queryUserCvSubmissionAttemptsSwr
}
