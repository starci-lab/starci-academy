"use client"

import React from "react"
import {
    useTranslations,
} from "next-intl"
import {
    FoundationCategoryCard,
} from "../../FoundationCategoryCard"
import {
    FoundationCategoryCardSkeleton,
} from "../../FoundationCategoryCard/FoundationCategoryCardSkeleton"
import type { FoundationCategoryEntity } from "@/modules/types/entities/foundation-category"
import { AsyncContentEmpty } from "@/components/composites/async/AsyncContent"
import { SurfaceListCard } from "@/components/blocks/cards/SurfaceListCard"

/** Props for {@link FoundationsCategoryGridBody}. */
export interface FoundationsCategoryGridBodyProps {
    /** Raw categories for the current page; `undefined` while still loading. */
    categories?: Array<FoundationCategoryEntity>
    /** Categories sorted for display (by order index). */
    sortedCategories: Array<FoundationCategoryEntity>
    /** First load, nothing in hand → the rows shimmer in place. Owned by the caller. */
    isSkeleton: boolean
}

/** Number of placeholder rows shown while the categories load. */
const SKELETON_ROWS = 6

/**
 * Foundations category list body: placeholder rows while loading, the empty state, or the
 * joined link-and-caret list.
 *
 * Rows ({@link FoundationCategoryCard}) own their own selection dispatch + navigation and
 * render inside one `p-0` house card surface (a joined list with full-width dividers);
 * this component only handles the container, ordering, and the loading state. The
 * placeholders render inside the SAME `SurfaceListCard` the loaded rows do — one tree, not
 * a second one kept in step by hand (`loading-and-skeleton.md`).
 */
export const FoundationsCategoryGridBody = ({
    categories,
    sortedCategories,
    isSkeleton,
}: FoundationsCategoryGridBodyProps) => {
    const t = useTranslations()

    // empty only once settled — while shimmering there is nothing to call empty yet.
    if (!isSkeleton && !categories?.length) {
        return <AsyncContentEmpty title={t("foundations.emptyCategories")} />
    }

    return (
        <SurfaceListCard identity={{ tier: "block", component: "FoundationsCategoryGridBody" }}>
            {isSkeleton
                ? Array.from({ length: SKELETON_ROWS }, (_row, index) => (
                    <FoundationCategoryCardSkeleton
                        key={index}
                        divider={index < SKELETON_ROWS - 1}
                    />
                ))
                : sortedCategories.map((category) => (
                    <FoundationCategoryCard
                        key={category.id}
                        category={category}
                    />
                ))}
        </SurfaceListCard>
    )
}
