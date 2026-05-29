import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

/**
 * Access the content overlay state from {@link OverlayStateContext}.
 * @returns the content overlay state handle.
 */
export const useContentOverlayState = () => {
    const { content } = use(OverlayStateContext)!
    return content
}
