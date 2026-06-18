"use client"

import React from "react"
import {
    useTranslations,
} from "next-intl"
import type {
    FoundationCategoryEntity,
    WithClassNames,
} from "@/modules/types"
import { cn } from "@heroui/react"
import {
    FoundationCategoryCard,
} from "../../FoundationCategoryCard"
import {
    FoundationCategoryCardSkeleton,
} from "../../FoundationCategoryCard/FoundationCategoryCardSkeleton"
import {
    AsyncContent,
} from "@/components/blocks"

/** Props for {@link FoundationsCategoryGridBody}. */
export interface FoundationsCategoryGridBodyProps extends WithClassNames<undefined> {
    /** Raw categories for the current page; `undefined` while still loading. */
    categories?: Array<FoundationCategoryEntity>
    /** Categories sorted for display (by order index). */
    sortedCategories: Array<FoundationCategoryEntity>
    /** Whether the categories query is in flight. */
    isLoading: boolean
}

/** Shared responsive grid layout for cards + skeletons. */
const GRID_CLASS = "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"

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

    return (
        <AsyncContent
            isLoading={isLoading}
            isEmpty={!categories?.length}
            emptyContent={{ title: t("foundations.emptyCategories") }}
            skeleton={(
                <div className={cn(GRID_CLASS, className)}>
                    {Array.from({ length: 6 }).map((_, index) => (
                        <FoundationCategoryCardSkeleton key={index} />
                    ))}
                </div>
            )}
        >
            <div className={cn(GRID_CLASS, className)}>
                {sortedCategories.map((category) => (
                    <FoundationCategoryCard
                        key={category.id}
                        category={category}
                    />
                ))}
            </div>
        </AsyncContent>
    )
}
