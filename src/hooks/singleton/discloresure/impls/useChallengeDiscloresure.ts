import { DiscloresureContext } from "../DiscloresureContext"
import { use } from "react"

export const useChallengeDisclosure = () => {
    const { challenge } = use(DiscloresureContext)!
    return challenge
}
