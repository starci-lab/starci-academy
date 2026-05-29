import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

/**
 * Access the CV preview overlay state from {@link OverlayStateContext}.
 * @returns the CV preview overlay state handle.
 */
export const useCvPreviewOverlayState = () => {
    const { cvPreview } = use(OverlayStateContext)!
    return cvPreview
}
