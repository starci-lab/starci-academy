import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

export const useAuthenticationOverlayState = () => {
    const { authentication } = use(OverlayStateContext)!
    return authentication
}
