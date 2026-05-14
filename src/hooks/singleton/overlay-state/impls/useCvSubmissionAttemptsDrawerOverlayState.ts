import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

export const useCvSubmissionAttemptsDrawerOverlayState = () => {
    const { cvSubmissionAttemptsDrawer } = use(OverlayStateContext)!
    return cvSubmissionAttemptsDrawer
}
