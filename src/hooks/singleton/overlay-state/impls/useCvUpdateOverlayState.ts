import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

export const useCvUpdateOverlayState = () => {
    const { cvUpdate } = use(OverlayStateContext)!
    return {
        isOpen: cvUpdate.isOpen,
        onOpen: cvUpdate.open,
        onClose: cvUpdate.close,
        onOpenChange: cvUpdate.setOpen,
    }
}
