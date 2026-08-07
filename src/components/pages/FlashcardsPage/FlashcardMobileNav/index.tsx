"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { useFlashcardNav, type FlashcardMode } from "../useFlashcardNav"
import { TabsCard } from "@/components/blocks/navigation/TabsCard"

/** Props for {@link FlashcardMobileNav}. */
export type FlashcardMobileNavProps = Record<string, never>
/**
 * Mobile (`<lg`) fallback for the flashcards LEFT RAIL — which is hidden on
 * small screens. Surfaces the mode switch (Study / Quiz) the rail owns,
 * driving the URL via {@link useFlashcardNav} so the rail (desktop) and this
 * bar (mobile) stay in sync. Rendered `@app-lg:hidden` above the work pane.
 *
 * The horizontal deck-chip picker this bar used to ALSO surface (a mobile
 * form of the rail's deck list) was removed (teacher, 2026-07-09: "remove this
 * on mobile") — `FlashcardDeckList` already gives the overview a proper
 * deck picker, so the chip row was a redundant second way to jump decks.
 * @param props - {@link FlashcardMobileNavProps}
 */
export const FlashcardMobileNav = () => {
    const t = useTranslations()
    const { mode, goMode } = useFlashcardNav()

    return (
        <div className={"flex flex-col gap-3 @app-lg:hidden"}>
            {/* page-FEATURE switch (mirrors the desktop rail's own mode control, see
                FlashcardsPage/index.tsx) → TabsCard variant="primary"
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
