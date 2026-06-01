"use client"
import { useOverlayState } from "@heroui/react"

/**
 * Core singleton overlay state for the premium-gate modal (register/buy prompt
 * shown when a viewer clicks a locked premium feature on an "đọc thử" lesson).
 * @returns HeroUI overlay state handle (`isOpen`, `open`, `close`).
 */
export const usePremiumGateOverlayStateCore = () => useOverlayState()
