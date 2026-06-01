import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

/**
 * Access the premium-gate overlay state from {@link OverlayStateContext}.
 * @returns the premium-gate overlay state handle.
 */
export const usePremiumGateOverlayState = () => {
    const { premiumGate } = use(OverlayStateContext)!
    return premiumGate
}
