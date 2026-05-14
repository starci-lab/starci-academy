import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

export const usePersonalProjectTaskAttemptsDrawerOverlayState = () => {
    const { personalProjectTaskAttemptsDrawer } = use(OverlayStateContext)!
    return personalProjectTaskAttemptsDrawer
}
