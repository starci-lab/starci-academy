import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

export const useChallengeOverlayState = () => {
    const { challenge } = use(OverlayStateContext)!
    return challenge
}
