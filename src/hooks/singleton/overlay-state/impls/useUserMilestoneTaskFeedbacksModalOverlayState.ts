import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

export const useUserMilestoneTaskFeedbacksModalOverlayState = () => {
    const { userMilestoneTaskFeedbacksModal } = use(OverlayStateContext)!
    return userMilestoneTaskFeedbacksModal
}
