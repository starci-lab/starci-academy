import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

/**
 * Access the CV submission attempt analysis overlay state from {@link OverlayStateContext}.
 * @returns the CV submission attempt analysis overlay state handle.
 */
export const useCvSubmissionAttemptAnalysisOverlayState = () => {
    const { cvSubmissionAttemptAnalysis } = use(OverlayStateContext)!
    return cvSubmissionAttemptAnalysis
}
