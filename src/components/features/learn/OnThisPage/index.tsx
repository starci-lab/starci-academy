"use client"

import React from "react"
import {
    Label,
    Link,
    cn,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    useAppSelector,
} from "@/redux"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import {
    useTableOfContents,
} from "./hooks/useTableOfContents"
import {
    LessonFlashcards,
} from "./LessonFlashcards"
import {
    LessonChallenges,
} from "./LessonChallenges"
import {
    ContentActions,
} from "./ContentActions"

/** Props for {@link OnThisPage}. */
export interface OnThisPageProps extends WithClassNames<undefined> {
    /**
     * Render as a full-width mobile panel (the bottom-tab "On this page" view):
     * drops the hidden/sticky/width rail chrome and keeps just the body. Default
     * `false` = the desktop right rail.
     */
    mobile?: boolean
}

/**
 * "On this page" rail — the docs-style right outline of the lesson currently
 * being read: the in-article headings with anchor-jump + scroll-spy.
 *
 * Container: reads the active lesson id from Redux (re-scan key) and derives its
 * outline from the rendered article via {@link useTableOfContents}. Self-sizing —
 * renders nothing when the active body has no headings (module overview, code /
 * sandbox tabs, short lessons), so the content reclaims the full width.
 *
 * @param props - {@link OnThisPageProps}
 */
export const OnThisPage = ({ className, mobile = false }: OnThisPageProps) => {
    const t = useTranslations()
    const contentId = useAppSelector((state) => state.content.id)
    const { headings, activeId, onJump } = useTableOfContents(contentId)

    // self-hide when there is nothing to outline (rail reclaims no width)
    if (headings.length === 0) {
        return null
    }

    // shared body: the outline + the per-lesson action/review/practice blocks
    const body = (
        <>
            <nav className="flex flex-col gap-3">
                <Label>{t("onThisPage.title")}</Label>
                <div className="flex flex-col gap-2">
                    {headings.map((heading) => (
                        <Link
                            key={heading.id}
                            onPress={() => onJump(heading.id)}
                            className={cn(
                                "cursor-pointer text-start",
                                heading.level >= 3 && "pl-3",
                                heading.id === activeId ? "text-accent" : "text-muted",
                            )}
                        >
                            {heading.text}
                        </Link>
                    ))}
                </div>
            </nav>

            {/* content actions (bookmark / share / fullscreen) — moved from the inline bar */}
            <ContentActions />

            {/* "review this lesson" — flashcard decks linked to this content */}
            <LessonFlashcards />

            {/* "practice this lesson" — challenges of this content (closes the loop) */}
            <LessonChallenges />
        </>
    )

    // mobile bottom-tab "On this page" view: full-width panel, no rail chrome
    if (mobile) {
        return <div className={cn("flex flex-col gap-6 p-6", className)}>{body}</div>
    }

    return (
        <aside
            className={cn(
                "hidden w-64 shrink-0 lg:ml-8 lg:block lg:sticky lg:top-16 lg:self-start lg:max-h-[calc(100dvh-4rem)] lg:overflow-y-auto",
                className,
            )}
        >
            <div className="flex flex-col gap-6 p-6 pl-0">{body}</div>
        </aside>
    )
}

export default OnThisPage
