import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

/**
 * Access the payment overlay state from {@link OverlayStateContext}.
 * @returns the payment overlay state handle.
 */
export const usePaymentOverlayState = () => {
    const { payment } = use(OverlayStateContext)!
    return payment
}
