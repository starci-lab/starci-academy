import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

export const useAccountMenuOverlayState = () => {
    const { accountMenu } = use(OverlayStateContext)!
    return accountMenu
}
