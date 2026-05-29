import { useOverlayState } from "@heroui/react"

/**
 * Core singleton overlay state for the user milestone task feedbacks modal.
 * @returns HeroUI overlay state handle (`isOpen`, `open`, `close`).
 */
export const useUserMilestoneTaskFeedbacksModalOverlayStateCore = () => useOverlayState()
