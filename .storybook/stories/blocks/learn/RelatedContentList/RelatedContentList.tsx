import React from "react"
import type { ReactNode } from "react"
import { Label, cn } from "@heroui/react"
import { SurfaceListCard, SurfaceListCardItem } from "../../cards/SurfaceListCard/SurfaceListCard"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"
import { AsyncContent } from "../../async/AsyncContent/AsyncContent"
import { EntityResultRow, type SearchCourseContentItem } from "../EntityResultRow/EntityResultRow"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — BLOCK (composite) ported from
 * `@/components/blocks/learn/RelatedContentList`. Composes the local primitives
 * `SurfaceListCard` (bordered frame) + `Skeleton` (loading rows) + the local
 * {@link EntityResultRow} sub-block; the `LabeledCard` (frameless) + `AsyncContent`
 * deps aren't ported yet so faithful local copies are inlined below.
 *
 * PORT DIVERGENCE (P4): the real block is DATA-FETCHING — it self-triggers a RAG
 * search via `useQuerySearchCourseContentSwr` and navigates via `useRouter`. It
 * cannot render in isolation. This storybook-local port is made PROPS-ONLY: it
 * accepts `results` + `isLoading` directly (the caller/story supplies them) and
 * keeps the pure self-hide + excludeId + limit logic. See the port report's P4 flag.
 */

// TODO: swap for LabeledCard local when the cards/LabeledCard primitive is ported.
/** Minimal faithful copy of `LabeledCard` (frameless): a section Label above content. */
const LabeledCardFrameless = ({
    label,
    children,
    className,
    showAnatomy = false,
}: {
    label: ReactNode
    children: ReactNode
    className?: string
    showAnatomy?: boolean
}) => (
    <section data-anat-part={showAnatomy ? "LabeledCard" : undefined} className={cn("flex flex-col gap-3", className)}>
        <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
                {/* literal display of the `label` prop — folded into LabeledCard's own node */}
                <Label>{label}</Label>
            </div>
        </div>
        <div>{children}</div>
    </section>
)

/** Props for the {@link RelatedContentList} block (storybook-local, props-only). */
export interface RelatedContentListProps {
    /**
     * The RAG search results to render. In `src` these come from
     * `useQuerySearchCourseContentSwr`; here the caller supplies them so the block
     * renders in isolation.
     */
    results: Array<SearchCourseContentItem>
    /** Section label (translated by the caller — each surface phrases this differently). */
    label: ReactNode
    /**
     * The context-derived search query. Blank → the block renders nothing (no
     * loading flash, no empty-state clutter for what is a quiet, optional aid).
     */
    query: string
    /** True while the (mock) search is in flight — shows the skeleton rows. */
    isLoading?: boolean
    /**
     * The current surface's OWN source id — filtered out of results so the block
     * never suggests the page the learner is already on.
     */
    excludeId?: string
    /** Max rows shown. Defaults to 3. */
    limit?: number
    /** Fired when a row is picked — the caller owns navigation (src uses `router.push`). */
    onSelect?: (item: SearchCourseContentItem) => void
    /** Extra classes on the section. */
    className?: string
    /** Dev/spec: tag each composed part so a {@link BlockAnatomy} panel can badge it. */
    showAnatomy?: boolean
}

/**
 * Passive, self-hiding "related content" list — course-wide RAG search rendered
 * as clickable rows (breadcrumb + title + snippet), reusing the exact
 * {@link EntityResultRow} shape the content-AI search view established.
 * Auto-triggered from a CONTEXT query (no typing), so it is never a competing CTA
 * — just a quiet, optional aid a learner can click into or ignore. Silently
 * renders nothing when the query is blank or came back empty.
 *
 * @param props - {@link RelatedContentListProps}
 */
export const RelatedContentList = ({
    results,
    label,
    query,
    isLoading = false,
    excludeId,
    limit = 3,
    onSelect,
    className,
    showAnatomy = false,
}: RelatedContentListProps) => {
    // drop the current surface's own source — a title-derived query always returns
    // itself as the top hit, and suggesting the page you're on reads as a bug.
    const filtered = results
        .filter((item) => !excludeId
            || (item.contentId !== excludeId && item.deckId !== excludeId && item.taskId !== excludeId))
        .slice(0, limit)

    if (!query.trim() || (!isLoading && filtered.length === 0)) {
        return null
    }

    return (
        <LabeledCardFrameless label={label} className={cn(className)} showAnatomy={showAnatomy}>
            <AsyncContent
                isLoading={isLoading}
                showAnatomy={showAnatomy}
                skeleton={
                    <SurfaceListCard bordered anatPart={showAnatomy ? "SurfaceListCard" : undefined}>
                        {Array.from({ length: Math.min(limit, 2) }).map((_, index) => (
                            <SurfaceListCardItem key={index} anatPart={showAnatomy ? "SurfaceListCardItem" : undefined}>
                                <div data-anat-part={showAnatomy ? "Skeleton" : undefined} className="flex flex-col gap-2">
                                    <Skeleton.Typography type="body-xs" width="1/3" />
                                    <Skeleton.Typography type="body-sm" width="3/4" />
                                    <Skeleton.Typography type="body-xs" width="full" />
                                </div>
                            </SurfaceListCardItem>
                        ))}
                    </SurfaceListCard>
                }
            >
                <SurfaceListCard bordered anatPart={showAnatomy ? "SurfaceListCard" : undefined}>
                    {filtered.map((item, index) => (
                        <EntityResultRow
                            key={`${item.kind}-${item.contentId ?? item.deckId ?? item.taskId ?? index}`}
                            item={item}
                            anatPart={showAnatomy ? "EntityResultRow" : undefined}
                            onSelect={(picked) => onSelect?.(picked)}
                        />
                    ))}
                </SurfaceListCard>
            </AsyncContent>
        </LabeledCardFrameless>
    )
}
