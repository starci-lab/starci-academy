"use client"
import { useOverlayState } from "@heroui/react"

/**
 * Core singleton overlay state for the content overlay.
 * @returns HeroUI overlay state handle (`isOpen`, `open`, `close`).
 */
export const useContentOverlayStateCore = () => useOverlayState()
