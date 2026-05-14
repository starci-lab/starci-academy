import { SwrContext } from "@/hooks/singleton/swr/SwrContext"
import { use } from "react"

export const useQueryUserCvSubmissionAttemptsSwr = () => {
    const { queryUserCvSubmissionAttemptsSwr } = use(SwrContext)!
    return queryUserCvSubmissionAttemptsSwr
}
