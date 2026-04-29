import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

export const useContentOverlayState = () => {
    const { content } = use(OverlayStateContext)!
    return content
}
