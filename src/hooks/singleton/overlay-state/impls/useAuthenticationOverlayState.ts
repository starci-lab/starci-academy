import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

/**
 * Access the authentication overlay state from {@link OverlayStateContext}.
 * @returns the authentication overlay state handle.
 */
export const useAuthenticationOverlayState = () => {
    const { authentication } = use(OverlayStateContext)!
    return authentication
}
