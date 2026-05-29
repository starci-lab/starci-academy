"use client"
import { useOverlayState } from "@heroui/react"

/**
 * Core singleton overlay state for the AI quota modal.
 * @returns HeroUI overlay state handle (`isOpen`, `open`, `close`).
 */
export const useAiQuotaOverlayStateCore = () => useOverlayState()
