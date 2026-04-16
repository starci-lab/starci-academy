import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

export const useLanguageOverlayState = () => {
    const { language } = use(OverlayStateContext)!
    return {
        isOpen: language.isOpen,
        onOpen: language.open,
        onClose: language.close,
        onOpenChange: language.setOpen,
    }
}
