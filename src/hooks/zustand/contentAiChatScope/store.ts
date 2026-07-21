"use client"

import { create } from "zustand"

/**
 * Whether the learner has deliberately WIDENED the chat from the lesson they are
 * reading to the whole course.
 *
 * Lifted out of `ContentAiChat` because the scope pill moved into the panel
 * HEADER (rail + drawer both render it), so the host needs to read and toggle the
 * same value the chat body grounds on — otherwise the header would say one thing
 * and the next question would ground on another.
 *
 * Deliberately NOT persisted, unlike {@link import("@/hooks/zustand/contentAiChatMode/store").useContentAiChatModeStore}:
 * "ask about the whole course instead" is an intent that belongs to the lesson it
 * was made on, not a standing preference. Landing on a new lesson resets it — see
 * the reset in `ContentAiChat`.
 */
interface ContentAiChatScopeState {
    /** `true` = the learner widened a lesson chat to course scope. */
    prefersCourseScope: boolean
    /** Widen to / narrow back from course scope. */
    setPrefersCourseScope: (prefers: boolean) => void
    /** Back to the surface's natural scope (called when the lesson changes). */
    resetScope: () => void
}

/** Ephemeral store for the chat's active grounding scope. */
export const useContentAiChatScopeStore = create<ContentAiChatScopeState>()((set) => ({
    prefersCourseScope: false,
    setPrefersCourseScope: (prefersCourseScope) => set({ prefersCourseScope }),
    resetScope: () => set({ prefersCourseScope: false }),
}))
