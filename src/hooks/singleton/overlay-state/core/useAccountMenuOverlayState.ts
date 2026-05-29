import { useOverlayState } from "@heroui/react"

/**
 * Core singleton overlay state for the account menu overlay.
 * @returns HeroUI overlay state handle (`isOpen`, `open`, `close`).
 */
export const useAccountMenuOverlayStateCore = () => useOverlayState()
