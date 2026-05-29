import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

/**
 * Access the language overlay state from {@link OverlayStateContext}.
 * @returns the language overlay state handle.
 */
export const useLanguageOverlayState = () => {
    const { language } = use(OverlayStateContext)!
    return language
}
