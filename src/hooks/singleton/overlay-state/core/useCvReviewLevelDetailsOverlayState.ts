import { useOverlayState } from "@heroui/react"

/**
 * Core singleton overlay state for the CV review level details overlay.
 * @returns HeroUI overlay state handle (`isOpen`, `open`, `close`).
 */
export const useCvReviewLevelDetailsOverlayStateCore = () => useOverlayState()
