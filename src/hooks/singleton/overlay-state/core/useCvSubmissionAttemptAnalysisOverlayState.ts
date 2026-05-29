import { useOverlayState } from "@heroui/react"

/**
 * Core singleton overlay state for the CV submission attempt analysis overlay.
 * @returns HeroUI overlay state handle (`isOpen`, `open`, `close`).
 */
export const useCvSubmissionAttemptAnalysisOverlayStateCore = () => useOverlayState()
