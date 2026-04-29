import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

export const useFeedbackDetailsOverlayState = () => {
    const { feedbackDetails } = use(OverlayStateContext)!
    return feedbackDetails
}
