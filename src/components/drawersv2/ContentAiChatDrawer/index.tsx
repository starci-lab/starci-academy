"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { useSmViewpoint } from "@/hooks/reuseables/useSmViewpoint"
import { useAppSelector } from "@/redux/hooks"
import { useContentAiChatOverlayState } from "@/hooks/zustand/overlay/hooks"
import { useContentAiChatModeStore } from "@/hooks/zustand/contentAiChatMode/store"
import { _ContentAiChatDrawer } from "./component"

/**
 * `ContentAiChatDrawer` — the CONNECTED half of the SRC TWIN. Mirrors the data
 * wiring already proven in `src/components/drawers/ContentAiChatDrawer` onto the
 * storybook-driven presentational block in `./component` instead of that v1's
 * hand-built `Drawer`/`ContentAiChat` markup — same overlay-store key, same
 * mode store, same redux title sources. STAGED ONLY: the opener
 * ({@link import("@/components/features/learn/ContentAiFab").ContentAiFab}) and
 * the `DrawerContainer` mount still point at the v1 drawer — this twin is not
 * wired into any route yet (deferred `src-tier-ported-but-unused` debt,
 * matching batches 1–16).
 *
 * Open-state lives in the shared overlay store (`contentAiChat` key); the
 * desktop presentation mode is the learner's persisted choice
 * ({@link useContentAiChatModeStore}). The drawer renders only when the mode
 * resolves to `"drawer"` — a phone is forced to it, desktop may pick it; the
 * other desktop modes (rail/popover/dock) are rendered elsewhere. The header
 * title is the active lesson title, falling back to the course title and then
 * the block's own i18n fallback (`contentAi.title`). The real thread/composer
 * body is a scope-cut placeholder the presentational half owns.
 */
export const ContentAiChatDrawer = () => {
    const t = useTranslations()
    const { isOpen, setOpen } = useContentAiChatOverlayState()
    const { isMobile } = useSmViewpoint()
    const { mode, setMode } = useContentAiChatModeStore()
    const contentTitle = useAppSelector((state) => state.content.entity?.title)
    // no lesson open (flashcards / mind-map / leaderboard) → name the COURSE instead,
    // so the drawer header still says what this conversation belongs to
    const courseTitle = useAppSelector((state) => state.course.entity?.title)

    // The drawer renders when the presentation mode resolves to "drawer": a phone
    // is always forced to it, and desktop may pick it. The other desktop modes
    // (rail / popover / dock) are rendered elsewhere (ContentAiFab / the learn shell).
    const effectiveMode = isMobile ? "drawer" : mode
    if (effectiveMode !== "drawer") {
        return null
    }

    // Resolved lesson→course→fallback title (the presentational block renders it
    // as plain truncating text; the v1's markdown title is a scope cut here).
    const title = contentTitle ?? courseTitle ?? t("contentAi.title")

    return (
        <_ContentAiChatDrawer
            isOpen={isOpen}
            onOpenChange={setOpen}
            placement={isMobile ? "bottom" : "right"}
            title={title}
            // desktop drawer-mode can switch back to rail; a phone is forced to the
            // drawer, so hide the switch there by omitting BOTH halves together.
            mode={isMobile ? undefined : mode}
            onModeChange={isMobile ? undefined : setMode}
        />
    )
}
