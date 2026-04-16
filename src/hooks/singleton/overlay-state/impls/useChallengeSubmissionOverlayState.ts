import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

export const useChallengeSubmissionOverlayState = () => {
    const { challengeSubmission } = use(OverlayStateContext)!
    return {
        isOpen: challengeSubmission.isOpen,
        onOpen: challengeSubmission.open,
        onClose: challengeSubmission.close,
        onOpenChange: challengeSubmission.setOpen,
    }
}