import React from "react"
import { TrophyIcon } from "@phosphor-icons/react"
import { AsyncContentEmpty } from "@/components/composites/async/AsyncContent"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import {
    LeaderboardListCard,
    type LeaderboardRow,
    type LeaderboardStanding,
} from "@/components/features/dashboard/league/LeaderboardListCard"
import { StackH, StackV } from "@/components/frames/Stack"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** How many placeholder rows the co-located skeleton mirror shows (mirrors {@link import("./index").TOP_N}). */
const SKELETON_ROW_COUNT = 5

/** All display text, already localized by the connected {@link import("./index").TopLearners}; a story passes i18n keys. */
export interface TopLearnersLabels {
    title: string
    seeMoreLabel: string
    noLeadersTitle: string
    noLeadersDescription: string
    meLabel: string
}

/** Props for {@link _TopLearners} — presentational; all data resolved, no fetch/store/i18n. */
export interface TopLearnersProps extends WithClassNames<undefined> {
    /** First load, nothing in hand → the whole tree shimmers in place (co-located). Owned by the connected file. */
    isSkeleton?: boolean
    /** Settled with no leaderboard entries → the empty message. */
    isEmpty?: boolean
    /** Opens the full leaderboard page. */
    onSeeMore?: () => void
    /** The viewer's own standing header line (rank-driven medal/cup badge). Omitted on a rankless viewer. */
    standing?: LeaderboardStanding
    /** The ranked rows (top-N slice), already mapped with their trailing follow control. */
    rows?: Array<LeaderboardRow>
    /** Pinned self-row when the viewer sits below the shown slice. */
    selfRow?: LeaderboardRow
    /** Ellipsis label above the pinned self-row (e.g. "41 more people"). */
    ellipsisLabel?: React.ReactNode
    labels: TopLearnersLabels
}

/**
 * Dashboard "Top Learners" card — the presentational half of {@link import("./index").TopLearners}.
 * Maps the global leaderboard into the shared `LeaderboardListCard` (standing header with a
 * rank-driven medal/cup badge over a medal-ranked list). Renders IDENTICALLY to the weekly
 * "League" `LeagueCardContent`; only the trailing slot differs — a quiet `FollowButton` per
 * stranger row, built by the connected file into each row's `trailing`.
 *
 * `LeaderboardListCard` takes no `isSkeleton` of its own, so the loading state is mirrored right
 * here, co-located at the SAME call site — the label + standing header + `SurfaceListCard` rows,
 * matching the real card's shape 1:1 so nothing jumps when it resolves (loading-and-skeleton.md).
 * error → skeleton → empty → content (BLOCK-8): error beats a stale loading flag; empty only once
 * settled. See `tiers/split.md` — the connected `index.tsx` owns the fetch, the follow mutation,
 * and every translated string.
 *
 * @param props - {@link TopLearnersProps}
 */
export const _TopLearners = ({
    isSkeleton = false,
    isEmpty = false,
    onSeeMore,
    standing,
    rows = [],
    selfRow,
    ellipsisLabel,
    labels,
    className,
}: TopLearnersProps) => {
    if (!isSkeleton && isEmpty) {
        return (
            <AsyncContentEmpty
                identity={{ tier: "block", component: "TopLearners" }}
                icon={TrophyIcon}
                title={labels.noLeadersTitle}
                description={labels.noLeadersDescription}
            />
        )
    }

    if (isSkeleton) {
        return (
            <StackV
                gap={3}
                identity={{ tier: "block", component: "TopLearners" }}
                items={[
                    // label
                    () => <Skeleton.Typography type="body-sm" width="1/3" />,
                    // standing header — badge + primary + secondary
                    () => (
                        <StackH gap={3} align="center" items={[
                            () => <Skeleton className="size-12 shrink-0 rounded-xl" />,
                            () => (
                                <StackV gap={1} classNames={["min-w-0", "flex-1"]} items={[
                                    () => <Skeleton.Typography type="body-sm" width="1/2" />,
                                    () => <Skeleton.Typography type="body-xs" width="1/3" />,
                                ]} />
                            ),
                        ]} />
                    ),
                    // leader rows — [rank · avatar · name · XP value · follow]
                    () => (
                        <SurfaceListCard bordered>
                            {Array.from({ length: SKELETON_ROW_COUNT }, (_row, index) => (
                                <SurfaceListCardItem key={index}>
                                    <StackH gap={3} align="center" items={[
                                        () => <Skeleton className="h-3 w-6 shrink-0 rounded-sm" />,
                                        () => <Skeleton.Avatar size="sm" />,
                                        () => <Skeleton.Typography type="body-sm" width="1/2" className="min-w-0 flex-1" />,
                                        () => <Skeleton className="h-3 w-10 shrink-0 rounded-sm" />,
                                        () => <Skeleton className="h-8 w-24 shrink-0 rounded-xl" />,
                                    ]} />
                                </SurfaceListCardItem>
                            ))}
                        </SurfaceListCard>
                    ),
                ]}
            />
        )
    }

    return (
        <LeaderboardListCard
            className={className}
            title={labels.title}
            onSeeMore={onSeeMore}
            seeMoreLabel={labels.seeMoreLabel}
            standing={standing}
            rows={rows}
            selfRow={selfRow}
            ellipsisLabel={ellipsisLabel}
            meLabel={labels.meLabel}
        />
    )
}
