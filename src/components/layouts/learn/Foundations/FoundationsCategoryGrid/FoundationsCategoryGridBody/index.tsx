"use client"

import React from "react"
import {
    useTranslations,
} from "next-intl"
import type {
    WithClassNames,
} from "@/modules/types"
import { cn } from "@heroui/react"
import {
    FoundationCategoryCard,
} from "../../FoundationCategoryCard"
import {
    FoundationCategoryCardSkeleton,
} from "../../FoundationCategoryCard/FoundationCategoryCardSkeleton"

/** Props for {@link FoundationsCategoryGridBody}. */
export interface FoundationsCategoryGridBodyProps extends WithClassNames<undefined> {
    /** Raw categories for the current page; `undefined` while still loading. */
    categories?: Array<import("@/modules/types").FoundationCategoryEntity>
    /** Categories sorted for display (by order index). */
    sortedCategories: Array<import("@/modules/types").FoundationCategoryEntity>
    /** Whether the categories query is in flight. */
    isLoading: boolean
}

/**
 * Foundations category grid body: skeletons while loading, empty state, or the card grid.
 *
 * List items (`FoundationCategoryCard`) own their own selection dispatch and navigation;
 * this component only handles layout and loading state.
 * @param props.categories - Raw categories for empty-state check.
 * @param props.sortedCategories - Display-ordered categories.
 * @param props.isLoading - Shows skeletons when true and no data cached.
 * @param props.className - Optional root class names.
 */
export const FoundationsCategoryGridBody = ({
    categories,
    sortedCategories,
    isLoading,
    className,
}: FoundationsCategoryGridBodyProps) => {
    const t = useTranslations()

    if (isLoading) {
        return (
            <div className={cn("grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3", className)}>
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
        <div className={cn("grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3", className)}>
            {sortedCategories.map((category) => (
                <FoundationCategoryCard
                    key={category.id}
                    category={category}
                />
            ))}
        </div>
    )
}
