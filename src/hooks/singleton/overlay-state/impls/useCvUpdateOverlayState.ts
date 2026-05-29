import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

/**
 * Access the CV update overlay state from {@link OverlayStateContext}.
 * @returns the CV update overlay state handle.
 */
export const useCvUpdateOverlayState = () => {
    const { cvUpdate } = use(OverlayStateContext)!
    return cvUpdate
}
