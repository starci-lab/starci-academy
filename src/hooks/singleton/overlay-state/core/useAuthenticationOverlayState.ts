import { useOverlayState } from "@heroui/react"

/**
 * Core singleton overlay state for the authentication overlay.
 * @returns HeroUI overlay state handle (`isOpen`, `open`, `close`).
 */
export const useAuthenticationOverlayStateCore = () => useOverlayState()
