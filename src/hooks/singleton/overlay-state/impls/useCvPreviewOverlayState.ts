import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

export const useCvPreviewOverlayState = () => {
    const { cvPreview } = use(OverlayStateContext)!
    return cvPreview
}
