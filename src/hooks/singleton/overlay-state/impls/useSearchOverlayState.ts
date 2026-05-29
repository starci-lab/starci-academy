import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

/**
 * Access the search overlay state from {@link OverlayStateContext}.
 * @returns the search overlay state handle.
 */
export const useSearchOverlayState = () => {
    const { search } = use(OverlayStateContext)!
    return search
}
