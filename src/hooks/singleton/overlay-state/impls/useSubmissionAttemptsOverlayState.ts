import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

/**
 * Access the submission attempts overlay state from {@link OverlayStateContext}.
 * @returns the submission attempts overlay state handle.
 */
export const useSubmissionAttemptsOverlayState = () => {
    const { submissionAttempts } = use(OverlayStateContext)!
    return submissionAttempts
}
