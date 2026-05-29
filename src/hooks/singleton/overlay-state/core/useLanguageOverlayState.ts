"use client"
import { useOverlayState } from "@heroui/react"

/**
 * Core singleton overlay state for the language picker overlay.
 * @returns HeroUI overlay state handle (`isOpen`, `open`, `close`).
 */
export const useLanguageOverlayStateCore = () => useOverlayState()
