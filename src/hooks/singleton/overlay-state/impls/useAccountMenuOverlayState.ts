import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

export const useAccountMenuOverlayState = () => {
    const { accountMenu } = use(OverlayStateContext)!
    return {
        isOpen: accountMenu.isOpen,
        onOpen: accountMenu.open,
        onClose: accountMenu.close,
        onOpenChange: accountMenu.setOpen,
    }
}
