"use client"

import React from "react"
import { cn } from "@heroui/react"
import { useTranslations } from "next-intl"
import { useFlashcardNav, type FlashcardMode } from "../useFlashcardNav"
import { TabsCard } from "@/components/blocks/navigation/TabsCard"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link FlashcardMobileNav}. */
export type FlashcardMobileNavProps = WithClassNames<undefined>

/**
 * Mobile (`<lg`) fallback for the flashcards LEFT RAIL — which is hidden on
 * small screens. Surfaces the mode switch (Study / Quiz) the rail owns,
 * driving the URL via {@link useFlashcardNav} so the rail (desktop) and this
 * bar (mobile) stay in sync. Rendered `lg:hidden` above the work pane.
 *
 * The horizontal deck-chip picker this bar used to ALSO surface (a mobile
 * form of the rail's deck list) was removed (thầy 2026-07-09: "xoá cái này
 * trong mobile") — `FlashcardDeckList` already gives the overview a proper
 * deck picker, so the chip row was a redundant second way to jump decks.
 * @param props - {@link FlashcardMobileNavProps}
 */
export const FlashcardMobileNav = ({ className }: FlashcardMobileNavProps) => {
    const t = useTranslations()
    const { mode, goMode } = useFlashcardNav()

    return (
        <div className={cn("flex flex-col gap-3 lg:hidden", className)}>
            {/* page-FEATURE switch (mirrors the desktop rail's own mode control, see
                Flashcards/index.tsx) → TabsCard variant="primary", NOT SegmentedControl
                (fe/components/tabs.md §0b, corrected 2026-07-09). */}
            <TabsCard
                variant="primary"
                leftTabs={{
                    items: [
                        { key: "study", label: t("flashcard.mode.study") },
                        { key: "quiz", label: t("flashcard.mode.quiz") },
                    ],
                    selectedKey: mode,
                    ariaLabel: t("flashcard.title"),
                    onSelectionChange: (key) => goMode(key as FlashcardMode),
                }}
            />
        </div>
    )
}
