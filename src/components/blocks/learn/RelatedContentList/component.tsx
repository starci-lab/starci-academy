import React from "react"
import { SurfaceCardList, type SurfaceCardListItem } from "@/components/composites/cards/SurfaceCard"
import { EntityResultRow, ENTITY_RESULT_PLACEHOLDER } from "@/components/blocks/learn/EntityResultRow"
import type { SearchCourseContentItem } from "@/modules/api/graphql/queries/types/search-course-content"

/** Props for {@link _RelatedContentList} — presentational; every result already resolved. */
export interface RelatedContentListProps {
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
 * (`searchCourseContent`) rendered as clickable rows (breadcrumb + title),
 * reusing the list-safe {@link EntityResultRow} body. Auto-triggered from a
 * CONTEXT query (no typing), so it is never a competing CTA — just a quiet,
 * optional aid a learner can click into or ignore. Renders nothing when
 * `results` is empty and not `isSkeleton` (blank query, error, or a genuinely
 * empty result all fold into that ONE condition — a passive recommendation
 * degrading to invisible is better than an apologetic "no suggestions found"
 * box).
 *
 * @param props - {@link RelatedContentListProps}
 */
export const _RelatedContentList = ({
    label,
    results,
    isSkeleton = false,
    skeletonRowCount,
    onSelectItem,
}: RelatedContentListProps) => {
    if (!isSkeleton && results.length === 0) {
        return null
    }

    const source: Array<SearchCourseContentItem> = isSkeleton
        ? Array.from({ length: skeletonRowCount }, () => ENTITY_RESULT_PLACEHOLDER)
        : results

    const items: Array<SurfaceCardListItem> = source.map((item, index) => ({
        key: isSkeleton
            ? `skeleton-${index}`
            : `${item.kind}-${item.contentId ?? item.deckId ?? item.taskId ?? index}`,
        content: () => (
            <EntityResultRow
                item={item}
                isSkeleton={isSkeleton}
            />
        ),
        onPress: isSkeleton ? undefined : () => onSelectItem(item),
        hover: "underline",
    }))

    return (
        <SurfaceCardList
            identity={{ tier: "block", component: "RelatedContentList" }}
            label={label}
            variant="nested"
            isSkeleton={isSkeleton}
            items={items}
        />
    )
}
