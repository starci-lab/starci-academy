import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

export const usePaymentOverlayState = () => {
    const { payment } = use(OverlayStateContext)!
    return payment
}
