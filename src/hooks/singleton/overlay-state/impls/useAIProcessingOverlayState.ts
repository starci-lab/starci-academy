import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

/**
 * Access the AI-processing overlay state from {@link OverlayStateContext}.
 * @returns the AI-processing overlay state handle.
 */
export const useAIProcessingOverlayState = () => {
    const { aiProcessing } = use(OverlayStateContext)!
    return aiProcessing
}
