import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

/**
 * Access the headhunter overlay state from {@link OverlayStateContext}.
 * @returns the headhunter overlay state handle.
 */
export const useHeadhunterOverlayState = () => {
    const { headhunter } = use(OverlayStateContext)!
    return headhunter
}
