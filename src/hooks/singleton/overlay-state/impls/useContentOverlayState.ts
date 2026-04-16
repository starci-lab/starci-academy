import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

export const useContentOverlayState = () => {
    const { content } = use(OverlayStateContext)!
    return {
        isOpen: content.isOpen,
        onOpen: content.open,
        onClose: content.close,
        onOpenChange: content.setOpen,
    }
}
