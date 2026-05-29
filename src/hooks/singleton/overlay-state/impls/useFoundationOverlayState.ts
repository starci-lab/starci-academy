import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

/**
 * Access the foundation overlay state from {@link OverlayStateContext}.
 * @returns the foundation overlay state handle.
 */
export const useFoundationOverlayState = () => {
    const { foundation } = use(OverlayStateContext)!
    return foundation
}
