import React from "react"
import { ScrollShadow, Typography, cn } from "@heroui/react"
import { AsyncContent } from "../../async/AsyncContent/AsyncContent"
import { SurfaceListCard, SurfaceListCardItem } from "../../cards/SurfaceListCard/SurfaceListCard"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"
import { EntityResultRow, type SearchCourseContentItem } from "../EntityResultRow/EntityResultRow"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — BLOCK (composite) ported from
 * `@/components/features/learn/ContentAiChat/index.tsx:1223-1267` (the chat's
 * "search view" — "Tìm nội dung khóa"). Authored in Storybook (not `src`); synced
 * to `src` later. Same PROPS-ONLY shape as {@link ../RelatedContentList/RelatedContentList}:
 * the caller (a data-fetching feature component) owns the SWR query + debounce and
 * passes the already-resolved `isLoading` / `isEmpty` / `hasError` + `query` (the
 * RAW, not-yet-debounced value — only used here to gate the idle hint, exactly the
 * `debouncedContentSearchQuery.trim().length === 0` check in the source).
 *
 * PORT FIX (GAP THẬT — thầy đã chỉ rõ): the source hand-rolls the LOADED results
 * frame as a raw `<div className="flex flex-col overflow-hidden rounded-2xl
 * border border-default">`, while its OWN skeleton for the exact same region uses
 * `SurfaceListCard bordered` (`rounded-3xl bg-surface border`) — two different
 * shapes for the same box, and the hand-rolled one drifts off the card-radius
 * canon (2xl vs the mandated 3xl). Fixed here: BOTH the skeleton branch and the
 * loaded-results branch share the SAME `SurfaceListCard bordered` frame, so the
 * loading footprint never jumps when data arrives.
 */

/** Inlined `contentAi` i18n strings (vi) — the caller normally passes these via next-intl. */
const STRINGS = {
    /** Idle hint (query blank) — `contentAi.searchContentHint`. */
    hint: "Gõ từ khoá để tìm nội dung trong khoá học",
    /** Shared empty/error line (source uses ONE string for both) — `contentAi.searchContentEmpty`. */
    emptyOrError: "Không tìm thấy nội dung phù hợp",
} as const

/** Three placeholder rows while the (debounced) search is in flight. */
const SKELETON_ROWS = [0, 1, 2]

/** Props for the {@link ContentSearchList} block. */
export interface ContentSearchListProps {
    /** RAG search hits. `kind: "milestone"` is filtered out here (source line 1207 — the chat never surfaces capstone tasks). */
    items: Array<SearchCourseContentItem>
    /** The (raw, not-yet-debounced) query text — blank drives the Idle hint, same as the source. */
    query: string
    /** True while the debounced search is in flight (caller resolves the debounce). */
    isLoading?: boolean
    /** True once resolved with zero (filtered) hits for a non-blank query. */
    isEmpty?: boolean
    /** Truthy → the shared empty/error line renders instead of results (source uses `swr.error`). */
    hasError?: boolean
    /** Fired when a row is picked — the caller owns navigation. */
    onSelect: (item: SearchCourseContentItem) => void
    /** Extra classes on the outer `ScrollShadow`. */
    className?: string
    /** Anatomy tag: names the ROOT so a parent block can badge this whole list as one opaque node. */
    anatPart?: string
    /** When on, emit `data-anat-part` on each composed part so a {@link BlockAnatomy} panel can badge them. */
    showAnatomy?: boolean
}

/**
 * The chatbox's "search content in this course" view: a self-bounded scroll
 * region running the standard error → loading → empty → content switch
 * ({@link AsyncContent}), with an Idle hint before anything is typed and shared
 * {@link EntityResultRow} hits once results land.
 *
 * @param props - {@link ContentSearchListProps}
 */
export const ContentSearchList = ({
    items,
    query,
    isLoading = false,
    isEmpty = false,
    hasError = false,
    onSelect,
    className,
    anatPart,
    showAnatomy = false,
}: ContentSearchListProps) => {
    // same exclusion as the in-chat tool-result widget: the chat never surfaces
    // capstone tasks, so the "see all" search view must not either (source :1207)
    const results = items.filter((item) => item.kind !== "milestone")
    const isIdle = query.trim().length === 0

    return (
        <ScrollShadow
            hideScrollBar
            data-anat-part={anatPart ?? (showAnatomy ? "ScrollShadow" : undefined)}
            className={cn("max-h-[55vh] min-h-0 flex-1 overflow-y-auto", className)}
        >
            <AsyncContent
                isLoading={isLoading}
                showAnatomy={showAnatomy}
                skeleton={
                    <SurfaceListCard bordered anatPart={showAnatomy ? "SurfaceListCard" : undefined}>
                        {SKELETON_ROWS.map((row) => (
                            <SurfaceListCardItem key={row} anatPart={showAnatomy ? "SurfaceListCardItem" : undefined}>
                                <div className="flex items-center gap-2">
                                    <div className="flex min-w-0 flex-1 flex-col gap-0">
                                        <Skeleton.Typography type="body-sm" width="2/3" anatPart={showAnatomy ? "Skeleton.Typography" : undefined} />
                                        <Skeleton.Typography type="body-xs" width="1/2" anatPart={showAnatomy ? "Skeleton.Typography" : undefined} />
                                    </div>
                                    <Skeleton className="size-4 shrink-0 rounded" anatPart={showAnatomy ? "Skeleton" : undefined} />
                                </div>
                            </SurfaceListCardItem>
                        ))}
                    </SurfaceListCard>
                }
                isEmpty={isEmpty}
                emptyContent={{ title: STRINGS.emptyOrError }}
                error={hasError}
                errorContent={{ title: STRINGS.emptyOrError }}
            >
                {isIdle ? (
                    <Typography type="body-sm" color="muted" data-anat-part={showAnatomy ? "Typography" : undefined}>
                        {STRINGS.hint}
                    </Typography>
                ) : (
                    <SurfaceListCard bordered anatPart={showAnatomy ? "SurfaceListCard" : undefined}>
                        {results.map((item, index) => (
                            <EntityResultRow
                                key={`${item.kind}-${item.contentId ?? item.deckId ?? item.taskId ?? index}`}
                                item={item}
                                showKindChip
                                showSnippet
                                onSelect={onSelect}
                                anatPart={showAnatomy ? "EntityResultRow" : undefined}
                                showAnatomy={showAnatomy}
                            />
                        ))}
                    </SurfaceListCard>
                )}
            </AsyncContent>
        </ScrollShadow>
    )
}
