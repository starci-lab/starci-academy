import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

export const useShareOverlayState = () => {
    const { share } = use(OverlayStateContext)!
    return share
}
