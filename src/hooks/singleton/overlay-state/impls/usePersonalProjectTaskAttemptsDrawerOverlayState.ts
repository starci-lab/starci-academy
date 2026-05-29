import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

/**
 * Access the personal-project task attempts drawer overlay state from {@link OverlayStateContext}.
 * @returns the personal-project task attempts drawer overlay state handle.
 */
export const usePersonalProjectTaskAttemptsDrawerOverlayState = () => {
    const { personalProjectTaskAttemptsDrawer } = use(OverlayStateContext)!
    return personalProjectTaskAttemptsDrawer
}
