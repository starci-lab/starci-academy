import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

export const useLivestreamCalendarOverlayState = () => {
    const { livestreamCalendar } = use(OverlayStateContext)!
    return livestreamCalendar
}
