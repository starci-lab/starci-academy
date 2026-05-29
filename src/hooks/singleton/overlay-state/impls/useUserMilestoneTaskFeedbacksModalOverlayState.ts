import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

/**
 * Access the user milestone task feedbacks modal overlay state from {@link OverlayStateContext}.
 * @returns the user milestone task feedbacks modal overlay state handle.
 */
export const useUserMilestoneTaskFeedbacksModalOverlayState = () => {
    const { userMilestoneTaskFeedbacksModal } = use(OverlayStateContext)!
    return userMilestoneTaskFeedbacksModal
}
