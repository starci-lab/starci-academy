"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { useAppSelector } from "@/redux"
import { useContentAiChatOverlayState } from "@/hooks"
import { FloatingActionButton } from "@/components/blocks"
import type { WithClassNames } from "@/modules/types/base/class-name"

/**
 * Mascot image for the AI FAB. TODO: swap for the dedicated AI-assistant mascot
 * asset (a transparent PNG whose head can poke out above the circle).
 */
const FAB_MASCOT_SRC = "/logo-icon.png"

/** Props for {@link ContentAiFab}. */
export type ContentAiFabProps = WithClassNames<undefined>

/**
 * Floating "ask StarCi AI" button — a bottom-right mascot FAB shown while a content
 * is open. Clicking it opens the
 * {@link import("@/components/drawers/ContentAiChatDrawer").ContentAiChatDrawer}
 * (shared overlay store). First-class + always-on, so the AI assistant stays
 * reachable even when the right rail is hidden (mobile / heading-less content).
 *
 * @param props - {@link ContentAiFabProps}
 */
export const ContentAiFab = ({ className }: ContentAiFabProps) => {
    const t = useTranslations()
    const contentId = useAppSelector((state) => state.content.id)
    const { open } = useContentAiChatOverlayState()

    if (!contentId) {
        return null
    }

    return (
        <FloatingActionButton
            onPress={open}
            ariaLabel={t("contentAi.ask")}
            imageSrc={FAB_MASCOT_SRC}
            className={className}
        />
    )
}
