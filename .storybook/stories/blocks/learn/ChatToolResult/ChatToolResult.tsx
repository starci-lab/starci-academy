import React from "react"
import { Typography, cn } from "@heroui/react"
import { ArrowRightIcon } from "@phosphor-icons/react"
import { EntityResultRow, type SearchCourseContentItem } from "../EntityResultRow/EntityResultRow"
import { SurfaceListCardItem } from "../../cards/SurfaceListCard/SurfaceListCard"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — BLOCK (composite) ported from
 * `@/components/blocks/learn/ChatToolResult`. Composes the local primitives
 * {@link EntityResultRow} (the pickable rows), `SurfaceListCardItem` (skeleton row
 * frame) + `Skeleton` (loading bars). Authored in Storybook (not `src`); synced later.
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
}

/**
 * In-chat tool-result widget — a labeled, pickable list of RAG hits rendered
 * INLINE inside an assistant ChatBubble (generative-UI message part). Surface-in-
 * surface on the chat popover: a border-only card (no stacked fill), a quiet
 * header (eyebrow icon + kind label + count), then shared {@link EntityResultRow}s.
 * Loading mirrors the row shape with skeletons; the caller renders a text fallback
 * (not an empty card) when nothing matched — so this block never renders an empty
 * state itself.
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
}: ChatToolResultProps) => {
    return (
        <div className={cn("overflow-hidden rounded-xl border border-default bg-transparent", className)}>
            <div className="flex items-center justify-between gap-2 border-b border-default px-3 py-2">
                <span className="flex min-w-0 items-center gap-2 text-muted">
                    {icon}
                    <Typography type="body-xs" color="muted" truncate>
                        {label}
                    </Typography>
                </span>
                {!isLoading && items.length > 0 ? (
                    <Typography type="body-xs" color="muted" className="shrink-0">
                        {items.length}
                    </Typography>
                ) : null}
            </div>

            {isLoading ? (
                <>
                    {[0, 1].map((row) => (
                        <SurfaceListCardItem key={row}>
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
                    ))}
                </>
            ) : (
                <>
                    {items.map((item, index) => (
                        <EntityResultRow
                            key={`${item.kind}-${item.contentId ?? item.deckId ?? item.taskId ?? index}`}
                            item={item}
                            onSelect={onSelect}
                            showKindChip={showKindChip}
                            showSnippet
                        />
                    ))}
                    {onViewAll ? (
                        // NOTE: port Button has no variant for a full-width, left-aligned plain-text
                        // footer link (all variants are centered, fixed-padding CTA buttons with their
                        // own bg/border) — forcing this into the port would fight its base styles and
                        // change the row's layout/visual. Left as hand-rolled markup — deferred.
                        <button
                            type="button"
                            onClick={onViewAll}
                            className="group flex w-full cursor-pointer items-center gap-1 px-4 py-2 text-left text-sm font-medium text-accent-soft-foreground"
                        >
                            {viewAllLabel}
                            <ArrowRightIcon
                                aria-hidden
                                focusable="false"
                                className="size-4 transition-transform group-hover:translate-x-0.5"
                            />
                        </button>
                    ) : null}
                </>
            )}
        </div>
    )
}
