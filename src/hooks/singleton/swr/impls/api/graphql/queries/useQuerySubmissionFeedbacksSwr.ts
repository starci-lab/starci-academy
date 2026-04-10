import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

export const useQuerySubmissionFeedbacksSwr = () => {
    const { querySubmissionFeedbacksSwr } = use(SwrContext)!
    return querySubmissionFeedbacksSwr
}
