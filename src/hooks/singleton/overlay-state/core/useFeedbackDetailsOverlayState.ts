import { useOverlayState } from "@heroui/react"

/**
 * Core singleton overlay state for the feedback details overlay.
 * @returns HeroUI overlay state handle (`isOpen`, `open`, `close`).
 */
export const useFeedbackDetailsOverlayStateCore = () => useOverlayState()
