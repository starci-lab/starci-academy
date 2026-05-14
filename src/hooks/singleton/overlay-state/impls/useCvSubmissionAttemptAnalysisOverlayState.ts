import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

export const useCvSubmissionAttemptAnalysisOverlayState = () => {
    const { cvSubmissionAttemptAnalysis } = use(OverlayStateContext)!
    return cvSubmissionAttemptAnalysis
}
