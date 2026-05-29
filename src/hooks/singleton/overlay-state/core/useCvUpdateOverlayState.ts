import { useOverlayState } from "@heroui/react"

/**
 * Core singleton overlay state for the CV update overlay.
 * @returns HeroUI overlay state handle (`isOpen`, `open`, `close`).
 */
export const useCvUpdateOverlayStateCore = () => useOverlayState()
