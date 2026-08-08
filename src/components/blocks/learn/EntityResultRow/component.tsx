import React from "react"
import { Typography } from "@/components/atoms/text/Typography"
import { Chip, type ChipTone } from "@/components/atoms/chips/Chip"
import { LockSimpleIcon } from "@phosphor-icons/react"
import type { SearchCourseContentItem } from "@/modules/api/graphql/queries/types/search-course-content"

/**
 * Per-kind presentation of a RAG search hit: when a kind chip is enabled, its
 * label key + Chip tone. `code` shares the lesson's presentation (it resolves to
 * a content page). Unknown kinds fall back to `content`.
 */
export const KIND_META = {
    content: { chip: "kindContent", color: "success" as ChipTone },
    code: { chip: "kindContent", color: "success" as ChipTone },
    challenge: { chip: "kindChallenge", color: "warning" as ChipTone },
    flashcard: { chip: "kindFlashcard", color: "accent" as ChipTone },
    milestone: { chip: "kindMilestone", color: "default" as ChipTone },
} as const

type KnownKind = keyof typeof KIND_META

/** Resolve a hit's kind to its presentation, defaulting unknown kinds to content. */
export const metaForKind = (kind: string): (typeof KIND_META)[KnownKind] =>
    KIND_META[kind as KnownKind] ?? KIND_META.content

/** Props for {@link _EntityResultRow} — presentational; labels already resolved. */
export interface EntityResultRowProps {
    /** The RAG search hit to render (content/challenge/flashcard/milestone). */
    item: SearchCourseContentItem
    /** Fired when the row is clicked — the caller owns navigation. */
    onSelect: (item: SearchCourseContentItem) => void
    /** Show a kind chip above the title (chat tool-result). Default off (quiet related-content list). */
    showKindChip?: boolean
    /** Show a one-line snippet under the title as context. Default off. */
    showSnippet?: boolean
    /** Already-localized kind-chip label (only rendered when `showKindChip` is set). */
    kindLabel: string
    /** Already-localized "Enrol to open" line, shown when `item.isLocked`. */
    enrollToOpenLabel: string
}

/**
 * One pickable RAG result row — the shared row shape behind the content-AI
 * search view, the passive "related content" list, and the in-chat tool-result
 * widget. A nav go-there link: the whole row navigates on click, so hover
 * underlines the TITLE (never a background fill), and the row carries
 * `cursor-pointer`. Kind appearance uses the house `Chip` tone; placement is
 * intrinsic (`w-fit` on the atom).
 *
 * @param props - {@link EntityResultRowProps}
 */
export const _EntityResultRow = ({
    item,
    onSelect,
    showKindChip = false,
    showSnippet = false,
    kindLabel,
    enrollToOpenLabel,
}: EntityResultRowProps) => {
    const meta = metaForKind(item.kind)
    return (
        <button
            type="button"
            onClick={() => onSelect(item)}
            className="group relative flex w-full cursor-pointer flex-col gap-2 px-4 py-3 text-left after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-surface-foreground/6 after:content-[''] last:after:hidden"
        >
            {showKindChip ? (
                <Chip tone={meta.color} text={kindLabel} />
            ) : item.breadcrumb ? (
                <Typography size="xs" color="muted" truncate text={item.breadcrumb} />
            ) : null}
            <Typography
                size="sm"
                weight="medium"
                truncate
                underlineOnGroupHover
                text={item.title}
            />
            {showSnippet && item.snippet ? (
                <Typography size="xs" color="muted" truncate text={item.snippet} />
            ) : null}
            {item.isLocked ? (
                <span className="flex items-center gap-1 text-warning-soft-foreground">
                    <LockSimpleIcon aria-hidden focusable="false" className="size-3.5 shrink-0" />
                    <Typography size="xs" text={enrollToOpenLabel} />
                </span>
            ) : null}
        </button>
    )
}
