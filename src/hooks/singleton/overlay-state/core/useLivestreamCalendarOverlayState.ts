import { useOverlayState } from "@heroui/react"

/**
 * Core singleton overlay state for the livestream calendar overlay.
 * @returns HeroUI overlay state handle (`isOpen`, `open`, `close`).
 */
export const useLivestreamCalendarOverlayStateCore = () => useOverlayState()
