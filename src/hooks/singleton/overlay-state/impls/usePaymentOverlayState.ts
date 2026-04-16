import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

export const usePaymentOverlayState = () => {
    const { payment } = use(OverlayStateContext)!
    return {
        isOpen: payment.isOpen,
        onOpen: payment.open,
        onClose: payment.close,
        onOpenChange: payment.setOpen,
    }
}
