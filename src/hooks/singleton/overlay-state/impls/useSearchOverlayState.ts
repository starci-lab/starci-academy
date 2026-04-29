import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

export const useSearchOverlayState = () => {
    const { search } = use(OverlayStateContext)!
    return search
}
