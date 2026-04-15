import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

export const useSubmissionAttemptsOverlayState = () => {
    const { submissionAttempts } = use(OverlayStateContext)!
    return {
        isOpen: submissionAttempts.isOpen,
        onOpen: submissionAttempts.open,
        onClose: submissionAttempts.close,
        onOpenChange: submissionAttempts.setOpen,
    }
}
