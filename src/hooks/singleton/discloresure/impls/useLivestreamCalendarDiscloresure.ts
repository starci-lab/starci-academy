import { DiscloresureContext } from "../DiscloresureContext"
import { use } from "react"

export const useLivestreamCalendarDisclosure = () => {
    const { livestreamCalendar } = use(DiscloresureContext)!
    return livestreamCalendar
}

