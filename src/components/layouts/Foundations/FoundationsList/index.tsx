"use client"

import React from "react"
import {
    useTranslations,
} from "next-intl"
import type {
    FoundationEntity,
} from "@/modules/types"
import {
    FoundationCard,
} from "../FoundationCard"
import {
    FoundationCardSkeleton,
} from "../FoundationCardSkeleton"

/** Props for {@link FoundationsList}. */
export interface FoundationsListProps {
    /** The raw foundations from the store; `undefined` while still loading. */
    foundations?: Array<FoundationEntity>
    /** Foundations sorted for display (master list ordering). */
    sortedFoundations: Array<FoundationEntity>
    /** Fired with the chosen foundation row when a card is selected. */
    onSelect: (foundation: FoundationEntity) => void
}

/**
 * Foundations master list: skeletons while loading, empty state, or the card grid.
 *
 * Presentational: renders based on supplied data + select callback, no logic.
 * @param props - loading/sorted foundations and the select callback
 */
export const FoundationsList = ({
    foundations,
    sortedFoundations,
    onSelect,
}: FoundationsListProps) => {
    const t = useTranslations()

    if (!foundations) {
        return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                    <FoundationCardSkeleton key={index} />
                ))}
            </div>
        )
    }

    if (sortedFoundations.length === 0) {
        return <p className="text-muted text-sm">{t("foundations.empty")}</p>
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sortedFoundations.map((foundation, index) => (
                <FoundationCard
                    key={foundation.id}
                    foundation={foundation}
                    displayIndex={index}
                    onSelect={onSelect}
                />
            ))}
        </div>
    )
}
