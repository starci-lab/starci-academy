import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

/**
 * Access the account menu overlay state from {@link OverlayStateContext}.
 * @returns the account menu overlay state handle.
 */
export const useAccountMenuOverlayState = () => {
    const { accountMenu } = use(OverlayStateContext)!
    return accountMenu
}
