import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

export const useFeedbackDetailsOverlayState = () => {
    const { feedbackDetails } = use(OverlayStateContext)!
    return {
        isOpen: feedbackDetails.isOpen,
        onOpen: feedbackDetails.open,
        onClose: feedbackDetails.close,
        onOpenChange: feedbackDetails.setOpen,
    }
}
