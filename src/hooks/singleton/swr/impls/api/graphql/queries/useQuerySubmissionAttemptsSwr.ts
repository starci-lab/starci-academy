import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

export const useQuerySubmissionAttemptsSwr = () => {
    const { querySubmissionAttemptsSwr } = use(SwrContext)!
    return querySubmissionAttemptsSwr
}
