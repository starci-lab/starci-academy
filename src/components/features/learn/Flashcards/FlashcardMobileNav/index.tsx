"use client"

import React, { useMemo } from "react"
import useSWR from "swr"
import { cn } from "@heroui/react"
import { useTranslations } from "next-intl"
import { useFlashcardNav, type FlashcardMode } from "../useFlashcardNav"
import { TabsCard } from "@/components/blocks/navigation/TabsCard"
import { queryFlashcardDecksByCourse } from "@/modules/api/graphql/queries/query-flashcard-decks-by-course"
import { useAppSelector } from "@/redux/hooks"
import type { FlashcardDeckEntity } from "@/modules/types/entities/flashcard-deck"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link FlashcardMobileNav}. */
export type FlashcardMobileNavProps = WithClassNames<undefined>

/**
 * Mobile (`<lg`) fallback for the flashcards LEFT RAIL — which is hidden on
 * small screens. Surfaces the SAME controls the rail owns: a mode switch
 * (Study / Quiz) + a horizontal scroll of the course's decks, all
 * driving the URL via {@link useFlashcardNav} so the rail (desktop) and this bar
 * (mobile) stay in sync. Shares the deck SWR key with the rail/list → no extra
 * fetch. Rendered `lg:hidden` above the work pane.
 * @param props - {@link FlashcardMobileNavProps}
 */
export const FlashcardMobileNav = ({ className }: FlashcardMobileNavProps) => {
    const t = useTranslations()
    const courseId = useAppSelector((state) => state.course.entity?.id)
    const { mode, deckId, session, goMode, goDeck } = useFlashcardNav()
    // the deck highlighted = the open deck (none during the cross-deck due session)
    const activeDeckId = session === "due" ? null : deckId

    const { data } = useSWR(
        courseId ? ["flashcard-decks-by-course", courseId] : null,
        async () => {
            const response = await queryFlashcardDecksByCourse({
                request: { courseId: courseId as string },
            })
            return response.data?.flashcardDecksByCourse.data ?? null
        },
    )

    const decks = useMemo<Array<FlashcardDeckEntity>>(
        () => [...(data ?? [])].sort((prev, next) => prev.sortIndex - next.sortIndex),
        [data],
    )

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

            {/* study mode → horizontal deck picker (the rail's deck list, mobile form) */}
            {mode === "study" && decks.length > 0 ? (
                <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
                    {decks.map((deck) => {
                        const isActive = deck.id === activeDeckId
                        return (
                            <button
                                key={deck.id}
                                type="button"
                                onClick={() => goDeck(deck.id)}
                                className={cn(
                                    "flex shrink-0 cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors",
                                    isActive
                                        ? "border-accent bg-accent/10 text-accent"
                                        : "border-default text-muted hover:bg-default",
                                )}
                            >
                                <span className="max-w-[12rem] truncate">{deck.title}</span>
                                {deck.dueCount ? (
                                    <span className="font-medium">{deck.dueCount}</span>
                                ) : null}
                            </button>
                        )
                    })}
                </div>
            ) : null}
        </div>
    )
}
