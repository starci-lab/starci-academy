import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

export const useChallengeOverlayState = () => {
    const { challenge } = use(OverlayStateContext)!
    return {
        isOpen: challenge.isOpen,
        onOpen: challenge.open,
        onClose: challenge.close,
        onOpenChange: challenge.setOpen,
    }
}
