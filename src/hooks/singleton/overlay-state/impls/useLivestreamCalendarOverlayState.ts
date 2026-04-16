import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

export const useLivestreamCalendarOverlayState = () => {
    const { livestreamCalendar } = use(OverlayStateContext)!
    return {
        isOpen: livestreamCalendar.isOpen,
        onOpen: livestreamCalendar.open,
        onClose: livestreamCalendar.close,
        onOpenChange: livestreamCalendar.setOpen,
    }
}
