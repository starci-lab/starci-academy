"use client"

import { useOverlayState } from "@heroui/react"

/**
 * Core singleton overlay state for the foundation overlay.
 * @returns HeroUI overlay state handle (`isOpen`, `open`, `close`).
 */
export const useFoundationOverlayStateCore = () => useOverlayState()
