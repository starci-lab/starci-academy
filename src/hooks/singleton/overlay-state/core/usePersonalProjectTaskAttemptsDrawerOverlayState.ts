import { useOverlayState } from "@heroui/react"

/**
 * Core singleton overlay state for the personal-project task attempts drawer.
 * @returns HeroUI overlay state handle (`isOpen`, `open`, `close`).
 */
export const usePersonalProjectTaskAttemptsDrawerOverlayStateCore = () => useOverlayState()
