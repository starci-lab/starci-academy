import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

export const useFoundationOverlayState = () => {
    const { foundation } = use(OverlayStateContext)!
    return foundation
}
