import { DiscloresureContext } from "../DiscloresureContext"
import { use } from "react"

export const useFeedbackDetailsDisclosure = () => {
    const { feedbackDetails } = use(DiscloresureContext)!
    return feedbackDetails
}