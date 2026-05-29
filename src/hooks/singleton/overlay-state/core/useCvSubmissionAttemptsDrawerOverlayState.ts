import { useOverlayState } from "@heroui/react"

/**
 * Core singleton overlay state for the CV submission attempts drawer.
 * @returns HeroUI overlay state handle (`isOpen`, `open`, `close`).
 */
export const useCvSubmissionAttemptsDrawerOverlayStateCore = () => useOverlayState()
