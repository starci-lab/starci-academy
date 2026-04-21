import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

export const useCvPreviewOverlayState = () => {
    const { cvPreview } = use(OverlayStateContext)!
    return {
        isOpen: cvPreview.isOpen,
        onOpen: cvPreview.open,
        onClose: cvPreview.close,
        onOpenChange: cvPreview.setOpen,
    }
}
