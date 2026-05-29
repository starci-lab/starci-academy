import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

/**
 * Access the challenge overlay state from {@link OverlayStateContext}.
 * @returns the challenge overlay state handle.
 */
export const useChallengeOverlayState = () => {
    const { challenge } = use(OverlayStateContext)!
    return challenge
}
