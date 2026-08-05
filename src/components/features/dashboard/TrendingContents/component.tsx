import React from "react"
import {
    TrendingRow,
} from "./TrendingRow"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { StackH } from "@/components/frames/Stack"

/** Number of placeholder rows shown while the trending list first loads (mirrors resolver DEFAULT_LIMIT). */
const SKELETON_ROW_COUNT = 6

/** Per-row title-bar widths (varied so the placeholder list reads naturally, not a solid block). */
const SKELETON_ROW_WIDTHS = ["3/4", "1/2", "1/3", "3/4", "1/2", "2/3"] as const

/** One trending lesson row, already resolved by the connected {@link import("./index").TrendingContents}. */
export interface TrendingContentsItem {
    /** Opaque global id resolved to a route on press. */
    globalId: string
    /** Lesson title (truncated by the row). */
    title: string
}

/** Props for {@link _TrendingContents} — presentational; all data resolved, no fetch/i18n. */
export interface TrendingContentsProps extends WithClassNames<undefined> {
    /** First load, nothing in hand → the whole tree shimmers in place (co-located). Owned by the connected file. */
    isSkeleton?: boolean
    /** Settled with nothing to show — an empty list or a settled fetch error — → the card hides itself. */
    isEmpty?: boolean
    /** Most-read lessons this week, most-read first. */
    items?: Array<TrendingContentsItem>
    /** Already-translated card label. */
    label: string
}

/**
 * "Trending this week" discovery card for the explore feed — the presentational half of
 * {@link import("./index").TrendingContents}: the lessons read most across the platform in the
 * last 7 days, as clickable route tokens. A frameless `LabeledCard` over a `SurfaceListCard` of
 * rank-box + title rows. `isEmpty` covers BOTH a settled empty list and a settled fetch error —
 * there is nothing else to show either way, so the card hides itself (`return null`), the same
 * behaviour the legacy no-emptyContent/errorContent `AsyncContent` branch already had.
 *
 * {@link TrendingRow} carries no `isSkeleton` prop of its own (it is a sibling component, not
 * owned by this split), so the loading rows are mirrored inline with `Skeleton.*` pieces at the
 * same rank-box + title shape and the SAME row count, keeping the shimmer co-located with the
 * real tree instead of a separate skeleton file (`loading-and-skeleton.md`). See `tiers/split.md`
 * — the connected `index.tsx` owns the fetch and i18n.
 *
 * @param props - {@link TrendingContentsProps}
 */
export const _TrendingContents = ({
    className,
    isSkeleton = false,
    isEmpty = false,
    items = [],
    label,
}: TrendingContentsProps) => {
    // settled + nothing to show → hide the whole card (unchanged behaviour: error and empty both
    // fold into `isEmpty` upstream, since neither ever had its own message here).
    if (!isSkeleton && isEmpty) {
        return null
    }

    return (
        <LabeledCard
            frameless
            className={className}
            label={label}
        >
            <SurfaceListCard>
                {isSkeleton
                    ? SKELETON_ROW_WIDTHS.slice(0, SKELETON_ROW_COUNT).map((width, index) => (
                        <SurfaceListCardItem key={index}>
                            <StackH gap={3} items={[
                                () => <Skeleton className="h-4 w-5 shrink-0 rounded" />,
                                () => <Skeleton.Typography type="body-sm" width={width} />,
                            ]} />
                        </SurfaceListCardItem>
                    ))
                    : items.map((item, index) => (
                        <TrendingRow
                            key={item.globalId}
                            rank={index + 1}
                            title={item.title}
                            globalId={item.globalId}
                        />
                    ))}
            </SurfaceListCard>
        </LabeledCard>
    )
}
