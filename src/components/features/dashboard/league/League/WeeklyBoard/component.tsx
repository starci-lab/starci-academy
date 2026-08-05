import React from "react"
import { AsyncContentEmpty } from "@/components/composites/async/AsyncContent"
import type { ComponentTypeWithSkeleton } from "@/components/composites/_slot"
import { StandingHeroCard } from "@/components/features/dashboard/league/StandingHeroCard"
import { Podium, type PodiumEntry } from "@/components/features/dashboard/league/Podium"
import { rankBadgeIcon } from "@/components/features/dashboard/league/rankBadge"
import { Confetti } from "@/components/features/dashboard/league/Confetti"
import { IconTile } from "@/components/blocks/identity/IconTile"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { UserCell } from "@/components/blocks/identity/UserCell"
import { RankDeltaCaret } from "@/components/features/profile/RankDeltaCaret"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { Typography } from "@/components/atoms/text/Typography"
import { Box } from "@/components/frames/Box"
import { StackV, StackH } from "@/components/frames/Stack"

/** Number of placeholder cohort rows (rank 4+) shown while the board shimmers. */
const SKELETON_ROW_COUNT = 6

/** "Your standing" hero — already resolved (i18n interpolated) by the connected `WeeklyBoard`. */
export interface WeeklyBoardHero {
    /** 1-based rank, drives the {@link rankBadgeIcon} art. */
    rank: number
    /** Primary line, e.g. "Rank #1 · Bronze" (already translated + interpolated). */
    rankLabel: string
    /** Secondary meta line — points · reset countdown (already translated + interpolated). */
    meta: string
    /** Optional goal-gradient meter toward the promotion cutoff. */
    progress?: {
        /** Fill ratio, `0..1`. */
        ratio: number
        /** Muted line above the meter (already translated + interpolated). */
        label: string
    }
}

/** One top-3 podium finisher — see {@link PodiumEntry}. */
export type WeeklyBoardPodiumEntry = PodiumEntry

/** One rank 4+ cohort row, already resolved by the connected `WeeklyBoard`. */
export interface WeeklyBoardRowEntry {
    /** Stable row identity. */
    userGlobalId: string
    /** 1-based rank. */
    rank: number
    /** True when this row is the viewer's own. */
    mine: boolean
    /** Resolved, locale-aware link to this user's public profile. */
    profileHref: string
    /** Display username — the viewer's own row already carries the "· you" suffix. */
    displayUsername: string
    /** Avatar URL, or `null` for the generated fallback. */
    avatar: string | null
    /** Pre-formatted points label (already translated). */
    pointsLabel: string
    /** Weekly rank movement (`>0` climbed, `<0` dropped, `0`/`null` unchanged/no baseline). */
    rankDelta: number | null
}

/** All display text, already localized by the connected `WeeklyBoard`; a story passes i18n keys. */
export interface WeeklyBoardLabels {
    /** Nothing to show until the viewer is placed in a cohort — funnel-to-courses title. */
    emptyTitle: string
    /** Funnel-to-courses supporting line under {@link WeeklyBoardLabels.emptyTitle}. */
    emptyDescription: string
    /** North-star CTA — shown both on the hero and as the empty-state retry action. */
    climbCta: string
    /** "you" suffix appended to the viewer's own podium finisher. */
    you: string
    /** Promote-zone legend line (already interpolated with the cohort's promote count). */
    legendPromote: string
    /** Demote-zone legend line (already interpolated with the cohort's demote count). */
    legendDemote: string
}

/** Props for {@link _WeeklyBoard} — presentational; all data resolved, no fetch/store/i18n. */
export interface WeeklyBoardProps {
    /** First load, nothing in hand → the whole tree shimmers in place (co-located). Owned by the connected file. */
    isSkeleton?: boolean
    /** Settled with no cohort placement → the empty message (funnel to courses). */
    isEmpty?: boolean
    /** The viewer's own standing hero — omitted when the viewer isn't placed in the loaded cohort. */
    hero?: WeeklyBoardHero
    /** Top-3 finishers, best → worst. */
    podiumEntries?: ReadonlyArray<WeeklyBoardPodiumEntry>
    /** Rank 4+ rows — the runners the podium can't hold. */
    rows?: ReadonlyArray<WeeklyBoardRowEntry>
    /** Bumped to fire a top-3 confetti burst (owned by the connected file's one-shot effect). */
    celebrateKey?: number
    /** North-star funnel — both the hero CTA and the empty-state retry action. */
    onClimb: () => void
    labels: WeeklyBoardLabels
    className?: string
}

/**
 * Loading placeholder for the "your standing" hero — mirrors {@link StandingHeroCard}'s shape
 * (badge · rank/meta lines · goal meter · CTA) since the block has no `isSkeleton` of its own.
 */
const HeroSkeleton = () => (
    <Box className="rounded-3xl bg-surface p-5 shadow-surface">
        <StackV gap={5} items={[
            () => (
                <StackH gap={5} items={[
                    () => <Skeleton className="size-10 shrink-0 rounded-2xl" />,
                    () => <StackV gap={2} classNames={["min-w-0", "flex-1"]} items={[
                        () => <Skeleton.Typography type="h6" width="1/2" />,
                        () => <Skeleton.Typography type="body-sm" width="1/3" />,
                    ]} />,
                ]} />
            ),
            () => (
                <StackV gap={2} items={[
                    () => <Skeleton.Typography type="body-xs" width="1/3" />,
                    () => <Skeleton.ProgressBar />,
                ]} />
            ),
            () => <Skeleton className="h-10 w-40 rounded-full" />,
        ]} />
    </Box>
)

/**
 * Loading placeholder for the top-3 dais — mirrors {@link Podium}'s shape (champion centered +
 * raised) since the block has no `isSkeleton` of its own.
 */
const PodiumSkeleton = () => (
    <StackH gap={4} justify="center" items={[false, true, false].map((isChampion) => () => (
        <StackV gap={3} align="center" items={[
            () => <Skeleton className={isChampion ? "size-14 shrink-0 rounded-full" : "size-12 shrink-0 rounded-full"} />,
            // The podium column's fixed width is not a member of the closed AllowedClassName
            // union, so it sits on Box — the frame tier's sanctioned escape hatch — rather than
            // widening that union for one skeleton.
            () => <Box className="w-20"><StackV gap={2} align="center" items={[
                () => <Skeleton.Typography type="body-sm" width="3/4" />,
                () => <Skeleton.Typography type="body-xs" width="1/2" />,
            ]} /></Box>,
            () => <Skeleton className={isChampion ? "h-16 w-20 rounded-t-2xl rounded-b-none" : "h-10 w-20 rounded-t-2xl rounded-b-none"} />,
        ]} />
    ))} />
)

/** Loading placeholder for one rank 4+ row — mirrors the [rank · avatar · name · points · caret] shape. */
const RowSkeleton = () => (
    <StackH gap={4} items={[
        () => <Skeleton className="h-3 w-6 shrink-0 rounded-sm" />,
        () => <Skeleton.Avatar size="sm" />,
        () => <Skeleton.Typography type="body-sm" width="1/3" className="min-w-0 flex-1" />,
        () => <Skeleton className="h-3 w-8 shrink-0 rounded-sm" />,
        () => <Skeleton className="h-4 w-8 shrink-0 rounded-sm" />,
    ]} />
)

/** One resolved rank 4+ row: rank cell · profile-linked user cell · points · movement caret. */
const Row = ({ row }: { row: WeeklyBoardRowEntry }) => (
    <StackH gap={4} items={[
        () => (
            <Box as="span" className="w-6 shrink-0 text-right">
                <Typography size="xs" color={row.mine ? "accent" : "muted"} weight={row.mine ? "semibold" : undefined} text={String(row.rank)} />
            </Box>
        ),
        () => (
            <Box className="min-w-0 flex-1">
                <UserCell username={row.displayUsername} avatar={row.avatar} nameClassName={row.mine ? "text-accent" : undefined} />
            </Box>
        ),
        () => (
            <Typography size="sm" color={row.mine ? "accent" : "muted"} weight={row.mine ? "semibold" : undefined} classNames={["shrink-0"]} text={row.pointsLabel} />
        ),
        () => <RankDeltaCaret delta={row.rankDelta} className="w-8 shrink-0 justify-end" />,
    ]} />
)

/**
 * `_WeeklyBoard` — the presentational half of {@link import("./index").WeeklyBoard}: the full
 * weekly-league board shell shared with the global board — a {@link StandingHeroCard} of the
 * viewer's own standing, the top-3 {@link Podium}, the promote/demote legend, then rank 4+ in a
 * {@link SurfaceListCard}. Renders ONE tree with `isSkeleton` threaded to every leaf that supports
 * it; the sub-blocks that don't ({@link StandingHeroCard}, {@link Podium}, {@link SurfaceListCard},
 * {@link UserCell}, {@link RankDeltaCaret}) are mirrored in place with `Skeleton.*` at the exact
 * site they render, so the shimmer stays co-located instead of a hand-kept parallel tree
 * (`loading-and-skeleton.md`). See `tiers/split.md` — the connected `index.tsx` owns the fetch,
 * the async decisions, and every interpolated string.
 *
 * @param props - {@link WeeklyBoardProps}
 */
export const _WeeklyBoard = ({
    isSkeleton = false,
    isEmpty = false,
    hero,
    podiumEntries = [],
    rows = [],
    celebrateKey = 0,
    onClimb,
    labels,
    className,
}: WeeklyBoardProps) => {
    // empty only once settled — a first-load skeleton always wins over a structurally-empty isEmpty.
    if (!isSkeleton && isEmpty) {
        return (
            <AsyncContentEmpty
                title={labels.emptyTitle}
                description={labels.emptyDescription}
                onRetry={onClimb}
                retryLabel={labels.climbCta}
            />
        )
    }

    const showHero = isSkeleton || Boolean(hero)
    const showPodium = isSkeleton || podiumEntries.length > 0
    const showRows = isSkeleton || rows.length > 0

    const rowItems: Array<ComponentTypeWithSkeleton> = isSkeleton
        ? Array.from({ length: SKELETON_ROW_COUNT }, (_unused, index) => () => (
            <SurfaceListCardItem key={`pending-${index}`}>
                <RowSkeleton />
            </SurfaceListCardItem>
        ))
        : rows.map((row) => () => (
            <SurfaceListCardItem
                key={row.userGlobalId}
                href={row.profileHref}
                withVerdict={{
                    enable: (row.rankDelta ?? 0) !== 0,
                    variant: (row.rankDelta ?? 0) > 0 ? "success" : "danger",
                }}
            >
                <Row row={row} />
            </SurfaceListCardItem>
        ))

    return (
        <Box className={className} identity={{ tier: "block", component: "WeeklyBoard" }}>
            <StackV gap={6} items={[
                () => <Confetti fireKey={celebrateKey} />,

                // your standing hero — rank-driven badge · rank/meta · goal meter · CTA
                ...(showHero ? [() => (
                    isSkeleton || !hero
                        ? <HeroSkeleton />
                        : (
                            <StandingHeroCard
                                badge={<IconTile icon={rankBadgeIcon(hero.rank)} tone="neutral" size="sm" />}
                                rankLabel={hero.rankLabel}
                                meta={hero.meta}
                                progress={hero.progress}
                                ctaLabel={labels.climbCta}
                                onCta={onClimb}
                            />
                        )
                )] : []),

                // the winners' dais — top-3 (viewer's own column ringed)
                ...(showPodium ? [() => (
                    isSkeleton
                        ? <PodiumSkeleton />
                        : <Podium meLabel={labels.you} entries={[...podiumEntries]} />
                )] : []),

                // promote / demote legend
                () => (
                    <StackH gap={4} items={[
                        () => (
                            <StackH gap={3} items={[
                                () => <Box as="span" className="size-2 shrink-0 rounded-full bg-success" />,
                                () => <Typography size="xs" color="muted" isSkeleton={isSkeleton} text={labels.legendPromote} />,
                            ]} />
                        ),
                        () => (
                            <StackH gap={3} items={[
                                () => <Box as="span" className="size-2 shrink-0 rounded-full bg-danger" />,
                                () => <Typography size="xs" color="muted" isSkeleton={isSkeleton} text={labels.legendDemote} />,
                            ]} />
                        ),
                    ]} />
                ),

                // rank 4+ — the runners the podium can't hold; zone edge-markers via `withVerdict`
                ...(showRows ? [() => <SurfaceListCard>{rowItems.map((Item, index) => <Item key={index} isSkeleton={isSkeleton} />)}</SurfaceListCard>] : []),
            ]} />
        </Box>
    )
}
