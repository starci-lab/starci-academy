import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

export const useSubmissionAttemptsOverlayState = () => {
    const { submissionAttempts } = use(OverlayStateContext)!
    return submissionAttempts
}
