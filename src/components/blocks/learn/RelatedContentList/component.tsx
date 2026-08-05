import React from "react"
import { cn } from "@heroui/react"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { EntityResultRow } from "@/components/blocks/learn/EntityResultRow"
import type { SearchCourseContentItem } from "@/modules/api/graphql/queries/types/search-course-content"

/** Props for {@link _RelatedContentList} — presentational; every result already resolved. */
export interface RelatedContentListProps extends WithClassNames<undefined> {
    /** Section label (translated by the caller — each surface phrases this differently). */
    label: string
    /**
     * Already-filtered + already-limited results. An EMPTY array (while not
     * `isSkeleton`) renders NOTHING — the connected half folds every hide
     * condition (blank query, error, genuinely empty) into this one array so
     * the block keeps a single render path.
     */
    results: Array<SearchCourseContentItem>
    /** `true` → a skeleton mirror instead of self-hiding (first load only). */
    isSkeleton?: boolean
    /** How many skeleton rows to show while `isSkeleton`. */
    skeletonRowCount: number
    /** Fired when a row is picked — the connected half owns navigation. */
    onSelectItem: (item: SearchCourseContentItem) => void
}

/**
 * Passive, self-hiding "related content" list — course-wide RAG search
 * (`searchCourseContent`) rendered as clickable rows (kind chip + breadcrumb +
 * title + snippet), reusing the exact row shape `ContentAiChat`'s search view
 * established. Auto-triggered from a CONTEXT query (no typing), so it is never
 * a competing CTA — just a quiet, optional aid a learner can click into or
 * ignore. Renders nothing when `results` is empty and not `isSkeleton` (blank
 * query, error, or a genuinely empty result all fold into that ONE condition —
 * a passive recommendation degrading to invisible is better than an apologetic
 * "no suggestions found" box).
 *
 * @param props - {@link RelatedContentListProps}
 */
export const _RelatedContentList = ({
    label,
    results,
    isSkeleton = false,
    skeletonRowCount,
    onSelectItem,
    className,
}: RelatedContentListProps) => {
    if (!isSkeleton && results.length === 0) {
        return null
    }

    return (
        <LabeledCard label={label} frameless className={cn(className)}>
            <SurfaceListCard bordered>
                {isSkeleton
                    ? Array.from({ length: skeletonRowCount }).map((_row, index) => (
                        <SurfaceListCardItem key={index}>
                            <div className="flex flex-col gap-2">
                                <Skeleton.Typography type="body-xs" width="1/3" />
                                <Skeleton.Typography type="body-sm" width="3/4" />
                                <Skeleton.Typography type="body-xs" width="full" />
                            </div>
                        </SurfaceListCardItem>
                    ))
                    : results.map((item, index) => (
                        <EntityResultRow
                            key={`${item.kind}-${item.contentId ?? item.deckId ?? item.taskId ?? index}`}
                            item={item}
                            onSelect={onSelectItem}
                        />
                    ))}
            </SurfaceListCard>
        </LabeledCard>
    )
}
