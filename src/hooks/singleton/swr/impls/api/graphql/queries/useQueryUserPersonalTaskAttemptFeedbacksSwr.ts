import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR singleton for the user personal task attempt feedbacks query.
 * @returns the SWR query handle from {@link SwrContext}.
 */
export const useQueryUserPersonalTaskAttemptFeedbacksSwr = () => {
    const { queryUserPersonalTaskAttemptFeedbacksSwr } = use(SwrContext)!
    return queryUserPersonalTaskAttemptFeedbacksSwr
}
