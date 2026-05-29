import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

/**
 * Access the CV submission attempts drawer overlay state from {@link OverlayStateContext}.
 * @returns the CV submission attempts drawer overlay state handle.
 */
export const useCvSubmissionAttemptsDrawerOverlayState = () => {
    const { cvSubmissionAttemptsDrawer } = use(OverlayStateContext)!
    return cvSubmissionAttemptsDrawer
}
