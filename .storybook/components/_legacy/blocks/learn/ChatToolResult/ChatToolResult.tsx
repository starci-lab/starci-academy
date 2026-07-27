import React from "react"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { EntityResultRow, type SearchCourseContentItem } from "@sb-components/_legacy/blocks/learn/EntityResultRow/EntityResultRow"
import { SurfaceCardNested } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { LinkSeeMore } from "@sb-components/atoms/navigation/Link/Link"
/**
 * STORYBOOK-LOCAL DESIGN SPEC — BLOCK (composite) ported from
 * `@/components/blocks/learn/ChatToolResult`. Authored in Storybook (not `src`); synced later.
 *
 * SHAPE = a `SurfaceCardNested` (border-only nested container + quiet eyebrow header
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
 * `radius="xl" variant="nested"` `SurfaceCardNested` (surface-in-surface on the chat bubble; codemod
 * 2026-07-26, formerly `compact bordered`) with
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
            // Skeleton MIRROR of one result row. `SurfaceCardList` can't frame it (a
            // repeating list is now DATA-only and would add its own surface INSIDE the
            // nested card), so the mirror keeps the row box it always had: same `p-3`
            // + full-bleed inset separator as the old free-form list row.
            <div
                key={row}
                data-anat-part={showAnatomy ? "SurfaceListCardItem" : undefined}
                className="relative block w-full p-3 text-left after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-surface-foreground/6 after:content-[''] last:after:hidden"
            >
                <div className="flex flex-col gap-2">
                    {showKindChip ? (
                        <Chip isSkeleton />
                    ) : (
                        <Typography size="xs" isSkeleton className="w-1/3" />
                    )}
                    <Typography size="sm" isSkeleton className="w-3/4" />
                    <Typography size="xs" isSkeleton className="w-full" />
                </div>
            </div>
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
    // Codemod 2026-07-26: `compact` → `radius="xl"`, `bordered` → `variant="nested"`
    // (API 3-trục SurfaceCardNested).
    return (
        <SurfaceCardNested
            radius="xl"
            variant="nested"
            title={label}
            icon={icon}
            meta={
                !isLoading && items.length > 0 ? (
                    <Typography size="xs" color="muted" text={items.length} />
                ) : undefined
            }
            footer={
                !isLoading && onViewAll ? (
                    <LinkSeeMore
                        size="xs"
                        onPress={onViewAll}
                        anatPart={showAnatomy ? "SeeMoreLink" : undefined}
                        label={viewAllLabel}
                    />
                ) : undefined
            }
            className={className}
            anatPart={anatPart ?? (showAnatomy ? "NestedCard" : undefined)}
        >
            {rows}
        </SurfaceCardNested>
    )
}