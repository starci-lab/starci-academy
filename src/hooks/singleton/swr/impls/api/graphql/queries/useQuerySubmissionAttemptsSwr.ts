import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR singleton for the submission attempts query.
 * @returns the SWR query handle from {@link SwrContext}.
 */
export const useQuerySubmissionAttemptsSwr = () => {
    const { querySubmissionAttemptsSwr } = use(SwrContext)!
    return querySubmissionAttemptsSwr
}
