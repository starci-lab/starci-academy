import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

export const useCvUpdateOverlayState = () => {
    const { cvUpdate } = use(OverlayStateContext)!
    return cvUpdate
}
