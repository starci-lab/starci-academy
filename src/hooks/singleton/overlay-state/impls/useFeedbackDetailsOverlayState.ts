import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

/**
 * Access the feedback details overlay state from {@link OverlayStateContext}.
 * @returns the feedback details overlay state handle.
 */
export const useFeedbackDetailsOverlayState = () => {
    const { feedbackDetails } = use(OverlayStateContext)!
    return feedbackDetails
}
