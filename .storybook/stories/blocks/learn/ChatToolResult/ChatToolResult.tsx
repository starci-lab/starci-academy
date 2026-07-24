import React from "react"
import { Typography } from "@heroui/react"
import { EntityResultRow, type SearchCourseContentItem } from "../EntityResultRow/EntityResultRow"
import { SurfaceListCardItem } from "../../cards/SurfaceListCard/SurfaceListCard"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"
import { NestedCard } from "../../cards/NestedCard/NestedCard"
import { SeeMoreLink } from "../../navigation/SeeMoreLink/SeeMoreLink"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — BLOCK (composite) ported from
 * `@/components/blocks/learn/ChatToolResult`. Authored in Storybook (not `src`); synced later.
 *
 * SHAPE = a {@link NestedCard} (border-only nested container + quiet eyebrow header
 * with a leading icon + trailing count + a footer slot) whose sections are shared
 * {@link EntityResultRow}s. The "Xem tất cả" footer is a {@link SeeMoreLink} (it OWNS
 * the arrow + hover-slide, §5b) — NOT a hand-rolled button+arrow. Loading mirrors the
 * row shape with skeletons; the caller renders a text fallback (not an empty card)
 * when nothing matched, so this block never renders an empty state itself.
 */

/** Props for the {@link ChatToolResult} block. */
export interface ChatToolResultProps {
    /** The matched sources to render as pickable rows. */
    items: Array<SearchCourseContentItem>
    /** Header label (e.g. "Flashcard", "Bài liên quan") — translated by the caller. */
    label: React.ReactNode
    /** Header eyebrow icon (phosphor) — signals the result kind at a glance. */
    icon?: React.ReactNode
    /** While the tool runs, mirror the list shape with skeleton rows (no spinner). */
    isLoading?: boolean
    /** Show a kind chip per row — for a MIXED-kind list; off when the header already names one kind. */
    showKindChip?: boolean
    /** Fired when a row is picked — the caller owns navigation. */
    onSelect: (item: SearchCourseContentItem) => void
    /** Optional "see all" affordance below the list (opens the full search view). */
    onViewAll?: () => void
    /** Label for the view-all footer (translated by the caller). */
    viewAllLabel?: React.ReactNode
    /** Extra classes on the outer card. */
    className?: string
    /**
     * Anatomy tag for the ROOT — lets a PARENT block badge this whole ChatToolResult as
     * ONE opaque node (drill into its own story for internals). Overrides the self-anatomy root tag.
     */
    anatPart?: string
    /** When on, emit `data-anat-part` on each part so a {@link BlockAnatomy} panel can badge them on-render. */
    showAnatomy?: boolean
}

/**
 * In-chat tool-result widget — a labeled, pickable list of RAG hits rendered
 * INLINE inside an assistant ChatBubble (generative-UI message part). Composes a
 * `compact bordered` {@link NestedCard} (surface-in-surface on the chat bubble) with
 * a leading kind icon + count in the header, shared {@link EntityResultRow}s as its
 * sections, and a {@link SeeMoreLink} footer.
 *
 * @param props - {@link ChatToolResultProps}
 */
export const ChatToolResult = ({
    items,
    label,
    icon,
    isLoading = false,
    showKindChip = false,
    onSelect,
    onViewAll,
    viewAllLabel,
    className,
    anatPart,
    showAnatomy = false,
}: ChatToolResultProps) => {
    const rows = isLoading
        ? [0, 1].map((row) => (
            <SurfaceListCardItem key={row} anatPart={showAnatomy ? "SurfaceListCardItem" : undefined}>
                <div className="flex flex-col gap-2">
                    {showKindChip ? (
                        <Skeleton.Chip />
                    ) : (
                        <Skeleton.Typography type="body-xs" width="1/3" />
                    )}
                    <Skeleton.Typography type="body-sm" width="3/4" />
                    <Skeleton.Typography type="body-xs" width="full" />
                </div>
            </SurfaceListCardItem>
        ))
        : items.map((item, index) => (
            <EntityResultRow
                key={`${item.kind}-${item.contentId ?? item.deckId ?? item.taskId ?? index}`}
                item={item}
                onSelect={onSelect}
                showKindChip={showKindChip}
                showSnippet
                anatPart={showAnatomy ? "EntityResultRow" : undefined}
                showAnatomy={showAnatomy}
            />
        ))

    return (
        <NestedCard
            compact
            bordered
            title={label}
            icon={icon}
            meta={
                !isLoading && items.length > 0 ? (
                    <Typography type="body-xs" color="muted">{items.length}</Typography>
                ) : undefined
            }
            footer={
                !isLoading && onViewAll ? (
                    <SeeMoreLink size="xs" onPress={onViewAll} anatPart={showAnatomy ? "SeeMoreLink" : undefined}>
                        {viewAllLabel}
                    </SeeMoreLink>
                ) : undefined
            }
            className={className}
            anatPart={anatPart ?? (showAnatomy ? "NestedCard" : undefined)}
        >
            {rows}
        </NestedCard>
    )
}
