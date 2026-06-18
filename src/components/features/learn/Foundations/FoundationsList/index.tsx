"use client"

import React, { useMemo } from "react"
import {
    useTranslations,
} from "next-intl"
import type {
    WithClassNames,
} from "@/modules/types"
import { cn } from "@heroui/react"
import { useAppSelector } from "@/redux"
import { useQueryFoundationsSwr } from "@/hooks"
import {
    FoundationCard,
} from "../FoundationCard"
import {
    FoundationCardSkeleton,
} from "../FoundationCardSkeleton"
import {
    compareFoundations,
} from "../utils"
import {
    AsyncContent,
} from "@/components/blocks"

/** Props for {@link FoundationsList}. */
export type FoundationsListProps = WithClassNames<undefined>

/** Shared responsive grid layout for cards + skeletons. */
const GRID_CLASS = "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"

/**
 * Foundations master list: reads from Redux + SWR; shows skeletons while loading,
 * empty state, or the card grid.
 * @param props.className - Optional root class names.
 */
export const FoundationsList = ({
    className,
}: FoundationsListProps) => {
    const t = useTranslations()
    const foundations = useAppSelector((state) => state.foundation.entities)
    const { data: foundationsData, isLoading, error } = useQueryFoundationsSwr()
    const isFirstLoad = (isLoading && !foundationsData) || foundations === undefined

    /** Foundations sorted into display order (StarCi video → roadmap → cheatsheet → rest). */
    const sortedFoundations = useMemo(() => {
        if (!foundations?.length) {
            return []
        }
        return [...foundations].sort(compareFoundations)
    }, [foundations])

    return (
        <AsyncContent
            isLoading={isFirstLoad}
            error={!foundationsData ? error : undefined}
            errorContent={{ title: t("foundations.empty") }}
            isEmpty={sortedFoundations.length === 0}
            emptyContent={{ title: t("foundations.empty") }}
            skeleton={(
                <div className={cn(GRID_CLASS, className)}>
                    {Array.from({ length: 6 }).map((_, index) => (
                        <FoundationCardSkeleton key={index} />
                    ))}
                </div>
            )}
        >
            <div className={cn(GRID_CLASS, className)}>
                {sortedFoundations.map((foundation, index) => (
                    <FoundationCard
                        key={foundation.id}
                        foundation={foundation}
                        displayIndex={index}
                    />
                ))}
            </div>
        </AsyncContent>
    )
}
