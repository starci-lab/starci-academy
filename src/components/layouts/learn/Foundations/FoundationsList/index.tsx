"use client"

import React from "react"
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
import { useMemo } from "react"

/** Props for {@link FoundationsList}. */
export type FoundationsListProps = WithClassNames<undefined>

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
    const { data: foundationsData, isLoading } = useQueryFoundationsSwr()
    const isFirstLoad = isLoading && !foundationsData

    /** Foundations sorted into display order (StarCi video → roadmap → cheatsheet → rest). */
    const sortedFoundations = useMemo(() => {
        if (!foundations?.length) {
            return []
        }
        return [...foundations].sort(compareFoundations)
    }, [foundations])

    if (isFirstLoad) {
        return (
            <div className={cn("grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3", className)}>
                {Array.from({ length: 6 }).map((_, index) => (
                    <FoundationCardSkeleton key={index} />
                ))}
            </div>
        )
    }

    if (!foundations?.length || sortedFoundations.length === 0) {
        return <p className="text-muted text-sm">{t("foundations.empty")}</p>
    }

    return (
        <div className={cn("grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3", className)}>
            {sortedFoundations.map((foundation, index) => (
                <FoundationCard
                    key={foundation.id}
                    foundation={foundation}
                    displayIndex={index}
                />
            ))}
        </div>
    )
}
