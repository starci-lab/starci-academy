import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

/**
 * Access the CV review-level-details overlay state from {@link OverlayStateContext}.
 * @returns the CV review-level-details overlay state handle.
 */
export const useCvReviewLevelDetailsOverlayState = () => {
    const { cvReviewLevelDetails } = use(OverlayStateContext)!
    return cvReviewLevelDetails
}
