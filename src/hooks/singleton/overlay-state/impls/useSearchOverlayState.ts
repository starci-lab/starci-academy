import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

export const useSearchOverlayState = () => {
    const { search } = use(OverlayStateContext)!
    return {
        isOpen: search.isOpen,
        onOpen: search.open,
        onClose: search.close,
        onOpenChange: search.setOpen,
    }
}
