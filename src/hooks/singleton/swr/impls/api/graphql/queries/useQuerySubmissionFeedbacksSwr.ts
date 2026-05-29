import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR singleton for the submission feedbacks query.
 * @returns the SWR query handle from {@link SwrContext}.
 */
export const useQuerySubmissionFeedbacksSwr = () => {
    const { querySubmissionFeedbacksSwr } = use(SwrContext)!
    return querySubmissionFeedbacksSwr
}
