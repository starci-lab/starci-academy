import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

/**
 * Access the share overlay state from {@link OverlayStateContext}.
 * @returns the share overlay state handle.
 */
export const useShareOverlayState = () => {
    const { share } = use(OverlayStateContext)!
    return share
}
