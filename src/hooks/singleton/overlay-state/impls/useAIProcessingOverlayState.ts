import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

export const useAIProcessingOverlayState = () => {
    const { aiProcessing } = use(OverlayStateContext)!
    return aiProcessing
}
