import React from "react"
import {
    SurfaceCardList,
    type SurfaceCardListItem,
} from "@/components/composites/cards/SurfaceCard"

/** Props for {@link _TrendingContents} — presentational; rows and label already resolved. */
export interface TrendingContentsProps {
    /** First load → list rows shimmer in place on the owned surface. */
    isSkeleton?: boolean
    /** Settled empty or settled fetch error → hide the card. */
    isEmpty?: boolean
    /** Ranked lesson rows (or skeleton placeholders) for {@link SurfaceCardList}. */
    items?: Array<SurfaceCardListItem>
    /** Already-translated card label. */
    label: string
}

/**
 * "Trending this week" discovery card — presentational half. Empty hide stays here;
 * one {@link SurfaceCardList} owns label, rows, skeleton, and identity (no outer
 * label shell, legacy list block, or intermediate host).
 *
 * @param props - {@link TrendingContentsProps}
 */
export const _TrendingContents = ({
    isSkeleton = false,
    isEmpty = false,
    items = [],
    label,
}: TrendingContentsProps) => {
    if (!isSkeleton && isEmpty) {
        return null
    }

    return (
        <SurfaceCardList
            identity={{
                tier: "block",
                component: "TrendingContents",
            }}
            label={label}
            items={items}
            isSkeleton={isSkeleton}
        />
    )
}
