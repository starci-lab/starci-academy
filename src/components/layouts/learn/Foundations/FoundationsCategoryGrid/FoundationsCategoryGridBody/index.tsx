"use client"

import React from "react"
import {
    useTranslations,
} from "next-intl"
import type {
    FoundationCategoryEntity,
} from "@/modules/types"
import {
    FoundationCategoryCard,
} from "../../FoundationCategoryCard"
import {
    FoundationCategoryCardSkeleton,
} from "../../FoundationCategoryCard/FoundationCategoryCardSkeleton"

/** Props for {@link FoundationsCategoryGridBody}. */
export interface FoundationsCategoryGridBodyProps {
    /** Raw categories from the store; `undefined` while still loading. */
    categories?: Array<FoundationCategoryEntity>
    /** Categories sorted for display (by order index). */
    sortedCategories: Array<FoundationCategoryEntity>
    /** Whether the categories query is in flight. */
    isLoading: boolean
    /** Fired with the chosen category when a card is selected. */
    onSelect: (category: FoundationCategoryEntity) => void
}

/**
 * Foundations category grid body: skeletons while loading, empty state, or the card grid.
 *
 * Presentational: renders based on supplied data + select callback, no logic.
 * @param props - loading/sorted categories and the select callback
 */
export const FoundationsCategoryGridBody = ({
    categories,
    sortedCategories,
    isLoading,
    onSelect,
}: FoundationsCategoryGridBodyProps) => {
    const t = useTranslations()

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                    <FoundationCategoryCardSkeleton key={index} />
                ))}
            </div>
        )
    }

    if (!categories?.length) {
        return <p className="text-muted text-sm">{t("foundations.emptyCategories")}</p>
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sortedCategories.map((category) => (
                <FoundationCategoryCard
                    key={category.id}
                    category={category}
                    onPress={onSelect}
                />
            ))}
        </div>
    )
}
