"use client"

import React from "react"
import { ArrowRightIcon } from "@phosphor-icons/react"
import type { SearchCourseContentItem } from "@/modules/api/graphql/queries/types/search-course-content"
import { EntityResultRow, ENTITY_RESULT_PLACEHOLDER } from "@/components/blocks/learn/EntityResultRow"
import { SurfaceCardList, type SurfaceCardListItem } from "@/components/composites/cards/SurfaceCard"
import { Typography } from "@/components/atoms/text/Typography"

/** Props for the {@link ChatToolResult} block. */
export interface ChatToolResultProps {
    /** The matched sources to render as pickable rows. */
    items: Array<SearchCourseContentItem>
    /** Header label (e.g. "Flashcard", "Related lesson") — translated by the caller. */
    label: string
    /**
     * Optional kind icon from older callers. SurfaceCardList owns chrome now;
     * accepted and unused so ContentAiChat can stay on its held vertical.
     * Typed as `unknown` (not ReactNode) so this is not a content escape slot.
     */
    icon?: unknown
    /** While the tool runs, mirror the list shape with skeleton rows (no spinner). */
    isLoading?: boolean
    /** Show a kind chip per row — for a MIXED-kind list; off when the header already names one kind. */
    showKindChip?: boolean
    /** Fired when a row is picked — the caller owns navigation. */
    onSelect: (item: SearchCourseContentItem) => void
    /** Optional "see all" affordance below the list (opens the full search view). */
    onViewAll?: () => void
    /** Label for the view-all footer (translated by the caller). */
    viewAllLabel?: string
}

/** How many placeholder rows mirror the list while the tool is in flight. */
const SKELETON_ROW_COUNT = 2

/**
 * In-chat tool-result widget — a labeled, pickable list of RAG hits rendered
 * INLINE inside an assistant {@link import("@/components/blocks/feed/ChatBubble").ChatBubble}
 * (generative-UI message part). Surface-in-surface on the chat popover:
 * {@link SurfaceCardList} `variant="nested"` owns the face + separators; each
 * row body is the shared {@link EntityResultRow} (press on the list item).
 * Loading uses the same tree with `isSkeleton` placeholder items.
 *
 * @param props - {@link ChatToolResultProps}
 */
export const ChatToolResult = ({
    items,
    label,
    icon: _icon,
    isLoading = false,
    showKindChip = false,
    onSelect,
    onViewAll,
    viewAllLabel,
}: ChatToolResultProps) => {
    void _icon
    const resultItems: Array<SurfaceCardListItem> = isLoading
        ? Array.from({ length: SKELETON_ROW_COUNT }, (_row, index) => ({
            key: `skeleton-${index}`,
            content: () => (
                <EntityResultRow
                    item={ENTITY_RESULT_PLACEHOLDER}
                    showKindChip={showKindChip}
                    showSnippet
                    isSkeleton
                />
            ),
            hover: "underline",
        }))
        : items.map((item, index) => ({
            key: `${item.kind}-${item.contentId ?? item.deckId ?? item.taskId ?? index}`,
            content: () => (
                <EntityResultRow
                    item={item}
                    showKindChip={showKindChip}
                    showSnippet
                />
            ),
            onPress: () => onSelect(item),
            hover: "underline" as const,
        }))

    const listItems: Array<SurfaceCardListItem> = onViewAll && !isLoading
        ? [
            ...resultItems,
            {
                key: "view-all",
                content: () => (
                    <Typography
                        size="sm"
                        weight="medium"
                        color="accent"
                        suffixIcon={ArrowRightIcon}
                        text={viewAllLabel ?? ""}
                    />
                ),
                onPress: onViewAll,
                hover: "underline",
            },
        ]
        : resultItems

    return (
        <SurfaceCardList
            identity={{ tier: "block", component: "ChatToolResult" }}
            label={label}
            labelEnd={!isLoading && items.length > 0 ? String(items.length) : undefined}
            variant="nested"
            isSkeleton={isLoading}
            items={listItems}
        />
    )
}
