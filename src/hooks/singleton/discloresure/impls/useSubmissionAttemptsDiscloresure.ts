import { DiscloresureContext } from "../DiscloresureContext"
import { use } from "react"

export const useSubmissionAttemptsDisclosure = () => {
    const { submissionAttempts } = use(DiscloresureContext)!
    return submissionAttempts
}
