import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

export const useCvReviewLevelDetailsOverlayState = () => {
    const { cvReviewLevelDetails } = use(OverlayStateContext)!
    return cvReviewLevelDetails
}
