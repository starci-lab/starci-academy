import { useOverlayState } from "@heroui/react"

/**
 * Core singleton overlay state for the CV preview overlay.
 * @returns HeroUI overlay state handle (`isOpen`, `open`, `close`).
 */
export const useCvPreviewOverlayStateCore = () => useOverlayState()
