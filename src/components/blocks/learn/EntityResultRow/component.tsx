import React from "react"
import { Typography } from "@/components/atoms/text/Typography"
import { Chip, type ChipTone } from "@/components/atoms/chips/Chip"
import { StackV } from "@/components/frames/Stack"
import type { ComponentTypeWithSkeleton, SkeletonProps } from "@/components/frames/_slot"
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

/**
 * Empty hit used for skeleton placeholder rows — real fields are ignored while
 * `isSkeleton`; the row keeps the same chip/title/snippet slots so layout does
 * not jump when data lands.
 */
export const ENTITY_RESULT_PLACEHOLDER: SearchCourseContentItem = {
    kind: "content",
    title: "",
    breadcrumb: null,
    snippet: "",
    score: 0,
    moduleId: null,
    contentId: null,
    deckId: null,
    taskId: null,
    isLocked: false,
}

/** Props for {@link _EntityResultRow} — presentational; labels already resolved. */
export interface EntityResultRowProps {
    /** The RAG search hit to render (content/challenge/flashcard/milestone). */
    item: SearchCourseContentItem
    /**
     * Standalone press handler for hosts that have not yet moved press onto
     * {@link import("@/components/composites/cards/SurfaceCard").SurfaceCardListItem}
     * (ContentAiChat search). List-safe callers leave this unset.
     */
    onSelect?: (item: SearchCourseContentItem) => void
    /** Show a kind chip above the title (chat tool-result). Default off (quiet related-content list). */
    showKindChip?: boolean
    /** Show a one-line snippet under the title as context. Default off. */
    showSnippet?: boolean
    /** Already-localized kind-chip label (only rendered when `showKindChip` is set). */
    kindLabel: string
    /** Already-localized "Enrol to open" line, shown when `item.isLocked`. */
    enrollToOpenLabel: string
    /**
     * Resting state — Typography/Chip shimmer in place; press/hover/separators stay
     * on the owning {@link import("@/components/composites/cards/SurfaceCard").SurfaceCardListItem}.
     */
    isSkeleton?: boolean
}

/**
 * List-safe RAG result BODY — kind/breadcrumb + title (+ optional snippet / lock).
 * No outer button and no absolute separator: those belong to
 * {@link import("@/components/composites/cards/SurfaceCard").SurfaceCardList} /
 * {@link import("@/components/composites/cards/SurfaceCard").SurfaceCardListItem}
 * (`onPress` / `hover="underline"`). Shared by related-content, content-AI search,
 * and in-chat tool-result rows.
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
    isSkeleton = false,
}: EntityResultRowProps) => {
    const meta = metaForKind(item.kind)

    const slots: Array<ComponentTypeWithSkeleton> = []

    if (showKindChip) {
        slots.push(({ isSkeleton: slotSkeleton }: SkeletonProps) => {
            const resting = slotSkeleton ?? isSkeleton
            return resting
                ? <Chip tone={meta.color} isSkeleton />
                : <Chip tone={meta.color} text={kindLabel} />
        })
    } else if (isSkeleton || item.breadcrumb) {
        slots.push(({ isSkeleton: slotSkeleton }: SkeletonProps) => (
            <Typography
                size="xs"
                color="muted"
                truncate
                isSkeleton={slotSkeleton ?? isSkeleton}
                text={item.breadcrumb ?? ""}
            />
        ))
    }

    slots.push(({ isSkeleton: slotSkeleton }: SkeletonProps) => (
        <Typography
            size="sm"
            weight="medium"
            truncate
            underlineOnGroupHover
            isSkeleton={slotSkeleton ?? isSkeleton}
            text={item.title}
        />
    ))

    if (showSnippet && (isSkeleton || item.snippet)) {
        slots.push(({ isSkeleton: slotSkeleton }: SkeletonProps) => (
            <Typography
                size="xs"
                color="muted"
                truncate
                isSkeleton={slotSkeleton ?? isSkeleton}
                text={item.snippet}
            />
        ))
    }

    if (!isSkeleton && item.isLocked) {
        slots.push(() => (
            <Typography
                size="xs"
                color="warning"
                prefixIcon={LockSimpleIcon}
                text={enrollToOpenLabel}
            />
        ))
    }

    const body = (
        <StackV
            identity={{ tier: "block", component: "EntityResultRow" }}
            principle="sibling-stack"
            explain="Kind/breadcrumb, title, optional snippet and lock are peer lines of one result body — not group-boundary, because they are not separated regions."
            isSkeleton={isSkeleton}
            items={slots}
        />
    )

    if (!onSelect) {
        return body
    }

    return (
        <button
            type="button"
            onClick={() => onSelect(item)}
            className="group relative flex w-full cursor-pointer flex-col gap-2 px-4 py-3 text-left after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-surface-foreground/6 after:content-[''] last:after:hidden"
        >
            {body}
        </button>
    )
}
