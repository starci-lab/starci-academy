import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

export const useHeadhunterOverlayState = () => {
    const { headhunter } = use(OverlayStateContext)!
    return headhunter
}
