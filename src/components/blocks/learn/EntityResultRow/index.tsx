"use client"

import React from "react"
import { Chip, Typography, cn } from "@heroui/react"
import { LockSimpleIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import type { WithClassNames } from "@/modules/types/base/class-name"
import type { SearchCourseContentItem } from "@/modules/api/graphql/queries/types/search-course-content"

/**
 * Per-kind presentation of a RAG search hit: when a kind chip is enabled, its
 * label key + Chip color. `code` shares the lesson's presentation (it resolves to
 * a content page). Unknown kinds fall back to `content`.
 */
const KIND_META = {
    content: { chip: "kindContent", color: "success" },
    code: { chip: "kindContent", color: "success" },
    challenge: { chip: "kindChallenge", color: "warning" },
    flashcard: { chip: "kindFlashcard", color: "accent" },
    milestone: { chip: "kindMilestone", color: "default" },
} as const

type KnownKind = keyof typeof KIND_META

/** Resolve a hit's kind to its presentation, defaulting unknown kinds to content. */
const metaForKind = (kind: string): (typeof KIND_META)[KnownKind] =>
    KIND_META[kind as KnownKind] ?? KIND_META.content

/** Props for the {@link EntityResultRow} block. */
export interface EntityResultRowProps extends WithClassNames<undefined> {
    /** The RAG search hit to render (content/challenge/flashcard/milestone). */
    item: SearchCourseContentItem
    /** Fired when the row is clicked — the caller owns navigation. */
    onSelect: (item: SearchCourseContentItem) => void
    /** Show a kind chip above the title (chat tool-result). Default off (quiet related-content list). */
    showKindChip?: boolean
    /** Show a one-line snippet under the title as context. Default off. */
    showSnippet?: boolean
}

/**
 * One pickable RAG result row — the shared row shape behind the content-AI
 * search view, the passive "related content" list, and the in-chat tool-result
 * widget. A nav go-there link: the whole row navigates on click, so hover
 * underlines the TITLE (never a background fill), and the row carries
 * `cursor-pointer` ([[hover-style-matches-clickable-nature]] mode-1 +
 * [[interactive-needs-hover]]). The AFFORDANCE is the title itself — plain
 * `text-foreground` with a hover-underline, NO accent + NO trailing arrow (thầy
 * 2026-07-18: "link foreground only, không có arrow" — reversing the same-day
 * accent-title+arrow). Layout: optional kind chip / breadcrumb, then the
 * foreground title, then an optional snippet — all stacked left, no right column.
 */
export const EntityResultRow = ({
    item,
    onSelect,
    showKindChip = false,
    showSnippet = false,
    className,
}: EntityResultRowProps) => {
    const t = useTranslations("entityResult")
    const meta = metaForKind(item.kind)
    return (
        <button
            type="button"
            onClick={() => onSelect(item)}
            className={cn(
                "group relative flex w-full cursor-pointer flex-col gap-2 px-4 py-3 text-left after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-surface-foreground/6 after:content-[''] last:after:hidden",
                className,
            )}
        >
            {showKindChip ? (
                <Chip size="sm" variant="soft" color={meta.color} className="w-fit">
                    {t(meta.chip)}
                </Chip>
            ) : item.breadcrumb ? (
                <Typography type="body-xs" color="muted" truncate>
                    {item.breadcrumb}
                </Typography>
            ) : null}
            {/* affordance = the TITLE itself: FOREGROUND text + hover-underline ONLY — no
                accent, no arrow (thầy 2026-07-18: "link foreground only, không có arrow" —
                đảo quyết định accent-title+arrow cùng ngày). Nav link → hover underlines the
                title (hover-style §mode-1 + interactive-needs-hover). */}
            <Typography
                type="body-sm"
                weight="medium"
                truncate
                className="text-foreground underline-offset-4 decoration-[var(--separator-tertiary)] group-hover:underline"
            >
                {item.title}
            </Typography>
            {showSnippet && item.snippet ? (
                <Typography type="body-xs" color="muted" truncate>
                    {item.snippet}
                </Typography>
            ) : null}
            {/* locked = this viewer must enrol to open it (premium lesson / capstone).
                The row still NAVIGATES — landing on the surface's own enrol gate is the
                funnel; this only sets the expectation first. The backend also strips the
                snippet for these, so there is nothing to read here anyway. */}
            {item.isLocked ? (
                <span className="flex items-center gap-1 text-warning-soft-foreground">
                    <LockSimpleIcon aria-hidden focusable="false" className="size-3.5 shrink-0" />
                    <Typography type="body-xs" className="text-warning-soft-foreground">
                        {t("enrollToOpen")}
                    </Typography>
                </span>
            ) : null}
        </button>
    )
}
