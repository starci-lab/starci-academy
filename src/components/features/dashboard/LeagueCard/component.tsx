"use client"

import React from "react"
import { AsyncContentEmpty } from "@/components/composites/async/AsyncContent"
import { InfoTooltip } from "@/components/blocks/feedback/InfoTooltip"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import {
    SurfaceListCard,
    SurfaceListCardItem,
} from "@/components/blocks/cards/SurfaceListCard"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import {
    LeaderboardListCard,
    type LeaderboardRow,
    type LeaderboardStanding,
} from "@/components/features/dashboard/league/LeaderboardListCard"
import { RankDeltaCaret } from "@/components/features/profile/RankDeltaCaret"
import { StackH, StackV } from "@/components/frames/Stack"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Number of placeholder cohort rows the co-located skeleton shows (mirrors the capped top rows). */
const SKELETON_ROWS = 5

/**
 * One resolved cohort entry, already mapped + translated by the connected {@link
 * import("./index").LeagueCard} — the presentational half turns it into a {@link LeaderboardRow}.
 */
export interface LeagueCardEntry {
    /** React key + stable id. */
    userGlobalId: string
    /** 1-based rank — ≤3 renders a place medal, else the number. */
    rank: number
    /** Display username (null → dash). */
    username: string | null
    /** Avatar URL (null → generated fallback). */
    avatar?: string | null
    /** Rank movement vs last week (mirrors the ▴▾ {@link RankDeltaCaret}). */
    rankDelta: number | null
    /** True → highlight as the viewer (accent name + `meLabel` suffix). */
    isMe: boolean
    /** Profile link target. */
    profileHref: string
    /** Already-translated "N pts" label for this entry. */
    pointsLabel: string
}

/** Props for {@link _LeagueCard} — presentational; all data/text resolved, no fetch/store/i18n. */
export interface LeagueCardProps extends WithClassNames<undefined> {
    /** First load, nothing in hand → the whole tree shimmers in place (co-located). Owned by the connected file. */
    isSkeleton?: boolean
    /** Settled with no cohort placement → the empty message. */
    isEmpty?: boolean
    /**
     * Kept for API compatibility with the container; the card is always framed
     * (a `LabeledCard`, via {@link LeaderboardListCard}) now.
     */
    framed?: boolean
    /** League title (already translated). */
    title: string
    /** Help text for the title's {@link InfoTooltip} (already translated). */
    titleHelp: string
    /** "See more" handler (opens the full board). */
    onSeeMore?: () => void
    /** "See more" label (already translated). */
    seeMoreLabel?: string
    /** The viewer's own standing header line (omit when they have no rank). Text pre-resolved. */
    standing?: LeaderboardStanding
    /** Top-of-cohort entries (already sliced by the container). */
    entries?: Array<LeagueCardEntry>
    /** Pinned self-row when the viewer sits below the shown slice. */
    selfEntry?: LeagueCardEntry
    /** Ellipsis label above the pinned self-row (already translated). */
    ellipsisLabel?: string
    /** "You" suffix appended to the viewer's own row name (already translated). */
    meLabel?: string
    /** Empty-state title (already translated). */
    emptyTitle: string
    /** Empty-state description (already translated). */
    emptyDescription: string
}

/** Map one resolved {@link LeagueCardEntry} → a {@link LeaderboardRow} (caret trailing + movement band). */
const toRow = (entry: LeagueCardEntry): LeaderboardRow => ({
    key: entry.userGlobalId,
    rank: entry.rank,
    username: entry.username,
    avatar: entry.avatar,
    valueLabel: entry.pointsLabel,
    isMe: entry.isMe,
    profileHref: entry.profileHref,
    trailing: <RankDeltaCaret delta={entry.rankDelta} className="w-8 justify-end" />,
    verdict: entry.rankDelta
        ? { enable: true, variant: entry.rankDelta > 0 ? "success" : "danger" }
        : undefined,
})

/**
 * Dashboard "Weekly League" card — the presentational half of {@link import("./index").LeagueCard}.
 * Renders identically to the global {@link import("../TopLearners").TopLearners} card through the
 * shared {@link LeaderboardListCard}; only the trailing slot (caret vs follow) differs (instructor's
 * call, 2026-07-17, "two identical sections").
 *
 * {@link LeaderboardListCard} takes no `isSkeleton` of its own (it owns the label + standing header
 * + row list as one opaque block), so the LOADING branch mirrors its exact structure by hand, right
 * at this call site — the same `LabeledCard` label, standing header, and bordered `SurfaceListCard`
 * rows, with `Skeleton.*` swapped in for every content node (`loading-and-skeleton.md` §3/§6). This
 * is co-located (one file, one call site), not a separate skeleton component to keep in sync.
 *
 * @param props - {@link LeagueCardProps}
 */
export const _LeagueCard = ({
    className,
    isSkeleton = false,
    isEmpty = false,
    title,
    titleHelp,
    onSeeMore,
    seeMoreLabel,
    standing,
    entries = [],
    selfEntry,
    ellipsisLabel,
    meLabel,
    emptyTitle,
    emptyDescription,
}: LeagueCardProps) => {
    // settled with no cohort placement (BLOCK-8) → translated empty state (join hint), not self-hide
    if (!isSkeleton && isEmpty) {
        return <AsyncContentEmpty title={emptyTitle} description={emptyDescription} />
    }

    if (isSkeleton) {
        return (
            <LabeledCard
                className={className}
                label={<Skeleton.Typography type="body-sm" width="1/3" />}
                contentClassName="flex flex-col gap-3"
            >
                {/* standing header — IconTile badge + primary + secondary, mirrored bar-for-bar */}
                <StackH gap={4} align="center" items={[
                    () => <Skeleton className="size-12 shrink-0 rounded-xl" />,
                    () => (
                        <StackV gap={2} classNames={["min-w-0", "flex-1"]} items={[
                            () => <Skeleton.Typography type="body-sm" width="1/2" />,
                            () => <Skeleton.Typography type="body-xs" width="1/3" />,
                        ]} />
                    ),
                ]} />
                {/* cohort rows — [rank · avatar · name · value · caret] */}
                <SurfaceListCard bordered>
                    {Array.from({ length: SKELETON_ROWS }, (_row, index) => (
                        <SurfaceListCardItem key={index}>
                            <StackH gap={4} align="center" items={[
                                () => <Skeleton className="h-3 w-6 shrink-0 rounded-sm" />,
                                () => <Skeleton.Avatar size="sm" />,
                                () => <Skeleton.Typography type="body-sm" width="1/2" className="min-w-0 flex-1" />,
                                () => <Skeleton className="h-3 w-10 shrink-0 rounded-sm" />,
                                () => <Skeleton className="h-4 w-8 shrink-0 rounded-sm" />,
                            ]} />
                        </SurfaceListCardItem>
                    ))}
                </SurfaceListCard>
            </LabeledCard>
        )
    }

    return (
        <LeaderboardListCard
            className={className}
            title={(
                <InfoTooltip title={title} description={titleHelp}>
                    {title}
                </InfoTooltip>
            )}
            onSeeMore={onSeeMore}
            seeMoreLabel={seeMoreLabel}
            standing={standing}
            rows={entries.map(toRow)}
            selfRow={selfEntry ? toRow(selfEntry) : undefined}
            ellipsisLabel={ellipsisLabel}
            meLabel={meLabel}
        />
    )
}
