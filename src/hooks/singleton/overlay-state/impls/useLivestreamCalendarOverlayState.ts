import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

/**
 * Access the livestream-calendar overlay state from {@link OverlayStateContext}.
 * @returns the livestream-calendar overlay state handle.
 */
export const useLivestreamCalendarOverlayState = () => {
    const { livestreamCalendar } = use(OverlayStateContext)!
    return livestreamCalendar
}
