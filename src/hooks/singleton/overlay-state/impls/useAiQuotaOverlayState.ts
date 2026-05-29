import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

/**
 * Access the AI quota overlay state from {@link OverlayStateContext}.
 * @returns the AI quota overlay state handle.
 */
export const useAiQuotaOverlayState = () => {
    const { aiQuota } = use(OverlayStateContext)!
    return aiQuota
}
