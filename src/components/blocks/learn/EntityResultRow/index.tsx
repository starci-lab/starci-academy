"use client"

import React from "react"
import { Chip, Typography, cn } from "@heroui/react"
import { ArrowRightIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import type { WithClassNames } from "@/modules/types/base/class-name"
import type { SearchCourseContentItem } from "@/modules/api/graphql/queries/types/search-course-content"

/**
 * Per-kind presentation of a RAG search hit: which CTA verb the row shows and,
 * when a kind chip is enabled, its label key + Chip color. `code` shares the
 * lesson's presentation (it resolves to a content page). Unknown kinds fall back
 * to `content`.
 */
const KIND_META = {
    content: { cta: "read", chip: "kindContent", color: "success" },
    code: { cta: "read", chip: "kindContent", color: "success" },
    challenge: { cta: "practice", chip: "kindChallenge", color: "warning" },
    flashcard: { cta: "review", chip: "kindFlashcard", color: "accent" },
    milestone: { cta: "open", chip: "kindMilestone", color: "default" },
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
    /** Fixed CTA label overriding the per-kind verb (e.g. a uniform "Đọc" for the related list). */
    ctaLabel?: React.ReactNode
}

/**
 * One pickable RAG result row — the shared row shape behind the content-AI
 * search view, the passive "related content" list, and the in-chat tool-result
 * widget. A nav go-there link: the whole row navigates on click, so hover
 * underlines the TITLE + nudges the arrow (never a background fill), and the
 * row carries `cursor-pointer` ([[hover-style-matches-clickable-nature]] mode-1
 * + [[interactive-needs-hover]]). Left = optional kind chip / breadcrumb +
 * title (+ optional snippet); right = an accent CTA verb (per kind, or a fixed
 * override) + arrow.
 */
export const EntityResultRow = ({
    item,
    onSelect,
    showKindChip = false,
    showSnippet = false,
    ctaLabel,
    className,
}: EntityResultRowProps) => {
    const t = useTranslations("entityResult")
    const meta = metaForKind(item.kind)
    return (
        <button
            type="button"
            onClick={() => onSelect(item)}
            className={cn(
                "group relative flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left after:absolute after:bottom-0 after:left-[3%] after:h-px after:w-[94%] after:bg-surface-foreground/6 after:content-[''] last:after:hidden",
                className,
            )}
        >
            <div className="flex min-w-0 flex-col gap-2">
                {showKindChip ? (
                    <Chip size="sm" variant="soft" color={meta.color} className="w-fit">
                        {t(meta.chip)}
                    </Chip>
                ) : item.breadcrumb ? (
                    <Typography type="body-xs" color="muted" truncate>
                        {item.breadcrumb}
                    </Typography>
                ) : null}
                {/* nav LINK → hover underlines the NHÃN (title), not the accent CTA / meta
                    beside it (hover-style §mode-1 + interactive-needs-hover). */}
                <Typography
                    type="body-sm"
                    weight="medium"
                    truncate
                    className="underline-offset-2 group-hover:underline"
                >
                    {item.title}
                </Typography>
                {showSnippet && item.snippet ? (
                    <Typography type="body-xs" color="muted" truncate>
                        {item.snippet}
                    </Typography>
                ) : null}
            </div>
            {/* accent CTA signal — arrow nudges on row hover (accent = the affordance,
                not a competing solid button). */}
            <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-accent-soft-foreground">
                {ctaLabel ?? t(meta.cta)}
                <ArrowRightIcon
                    aria-hidden
                    focusable="false"
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                />
            </span>
        </button>
    )
}
