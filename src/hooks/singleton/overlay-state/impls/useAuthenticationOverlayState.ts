import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

export const useAuthenticationOverlayState = () => {
    const { authentication } = use(OverlayStateContext)!
    return {
        isOpen: authentication.isOpen,
        onOpen: authentication.open,
        onClose: authentication.close,
        onOpenChange: authentication.setOpen,
    }
}
