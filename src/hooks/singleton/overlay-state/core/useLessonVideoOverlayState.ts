import { useOverlayState } from "@heroui/react"

/**
 * Core singleton overlay state for the lesson video overlay.
 * @returns HeroUI overlay state handle (`isOpen`, `open`, `close`).
 */
export const useLessonVideoOverlayStateCore = () => useOverlayState()
