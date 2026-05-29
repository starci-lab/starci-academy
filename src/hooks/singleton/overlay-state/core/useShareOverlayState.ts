"use client"
import { useOverlayState } from "@heroui/react"

/**
 * Core singleton overlay state for the share overlay.
 * @returns HeroUI overlay state handle (`isOpen`, `open`, `close`).
 */
export const useShareOverlayStateCore = () => useOverlayState()
