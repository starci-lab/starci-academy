import { useOverlayState } from "@heroui/react"

/**
 * Core singleton overlay state for the submission attempts overlay.
 * @returns HeroUI overlay state handle (`isOpen`, `open`, `close`).
 */
export const useSubmissionAttemptsOverlayStateCore = () => useOverlayState()
