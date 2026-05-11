import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

export const useQueryUserPersonalTaskAttemptFeedbacksSwr = () => {
    const { queryUserPersonalTaskAttemptFeedbacksSwr } = use(SwrContext)!
    return queryUserPersonalTaskAttemptFeedbacksSwr
}
