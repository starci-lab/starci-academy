"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

/**
 * How the "ask StarCi AI" chat is presented on DESKTOP — the learner's own choice,
 * persisted across sessions:
 * - `rail` — a resizable side panel docked to the right edge ({@link import("@/components/blocks/layout/ResizableRail").ResizableRail}):
 *   it REFLOWS the lesson (not an overlay), so you read + chat side by side, and the
 *   width is drag-adjustable. The default.
 * - `drawer` — a slide-in overlay drawer (focus mode; dims the page).
 *
 * MOBILE always uses the bottom-sheet drawer regardless of this preference (a side
 * rail is too cramped on a phone) — see `ContentAiFab` / `ContentAiChatDrawer`.
 */
export type ContentAiChatMode = "rail" | "drawer"

/** Shared store shape for the content-AI presentation mode. */
interface ContentAiChatModeState {
    /** Current desktop presentation mode. */
    mode: ContentAiChatMode
    /** Switch the presentation mode (persisted). */
    setMode: (mode: ContentAiChatMode) => void
}

/**
 * Persisted store for the content-AI chat presentation mode. Default `rail` — the
 * side-by-side reading assistant reads best for a course lesson. Persisted under
 * `starci.contentAiChat.mode.v2` (a fresh key so an older `dock`/`popover` value
 * from the previous 3-mode design is ignored, not restored as an invalid mode).
 */
export const useContentAiChatModeStore = create<ContentAiChatModeState>()(
    persist(
        (set) => ({
            mode: "rail",
            setMode: (mode) => set({ mode }),
        }),
        { name: "starci.contentAiChat.mode.v2" },
    ),
)
