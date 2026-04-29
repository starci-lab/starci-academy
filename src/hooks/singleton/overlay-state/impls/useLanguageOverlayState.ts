import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

export const useLanguageOverlayState = () => {
    const { language } = use(OverlayStateContext)!
    return language
}
