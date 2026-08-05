import React from "react"
import type { ReactNode } from "react"
import Link from "next/link"
import {
    TrophyIcon,
} from "@phosphor-icons/react"
import {
    AsyncContentEmpty,
} from "@/components/composites/async/AsyncContent"
import {
    Typography,
} from "@/components/atoms/text/Typography"
import {
    Box,
} from "@/components/frames/Box"
import {
    StackV,
    StackH,
} from "@/components/frames/Stack"
import {
    Skeleton,
} from "@/components/blocks/skeleton/Skeleton"
import {
    UserCell,
} from "@/components/composites/lists/UserCell"
import {
    StandingHeroCard,
    type StandingHeroProgress,
} from "@/components/blocks/dashboard/StandingHeroCard"
import {
    Podium,
} from "@/components/blocks/dashboard/Podium"
import {
    IconTile,
} from "@/components/blocks/identity/IconTile"
import {
    SurfaceListCard,
    SurfaceListCardItem,
} from "@/components/blocks/cards/SurfaceListCard"
import {
    FollowButton,
} from "@/components/blocks/community/FollowButton"
import {
    Confetti,
} from "@/components/blocks/dashboard/Confetti"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** How many placeholder rank-4+ rows the co-located skeleton shows. */
const SKELETON_ROW_COUNT = 6

/** One top-3 podium finisher, already resolved (points formatted, "mine" decided). */
export interface GlobalBoardPodiumEntry {
    rank: number
    username: string | null
    avatar: string | null
    /** Already-translated points label, e.g. "1420 XP". */
    pointsLabel: string
    /** True when this finisher is the viewer — ring-accent avatar + accent name (`Podium`'s own contract). */
    isMe: boolean
}

/**
 * One rank-4+ row, already resolved: display name already carries the " · You"
 * suffix when it's the viewer's own row (matches the connected file's old
 * string composition), follow state resolved from the connected file's sets.
 */
export interface GlobalBoardRow {
    key: string
    rank: number
    isMine: boolean
    /** Already composed with the " · You" suffix when {@link GlobalBoardRow.isMine}. */
    displayName: string
    avatar: string | null
    profileHref: string
    /** Already-translated points label, e.g. "1420 XP". */
    pointsLabel: string
    following: boolean
    isPending: boolean
    onToggleFollow: () => void
}

/** The viewer's own pinned row, appended after an ellipsis when they sit below the fetched slice. */
export interface GlobalBoardSelfRow {
    rank: number
    /** Already composed with the " · You" suffix (matches the connected file's old string composition). */
    displayName: string
    avatar: string | null
    /** Already-translated points label. */
    pointsLabel: string
}

/** Props for {@link _GlobalBoard} — presentational; all data resolved, no fetch/store/i18n. */
export interface GlobalBoardProps extends WithClassNames<undefined> {
    /** First load, nothing in hand → the whole tree shimmers in place (co-located). Owned by the connected file. */
    isSkeleton?: boolean
    /** Settled with no ranked entries → the empty message (funnel to courses). */
    isEmpty?: boolean

    /** Rank-driven badge art for the standing hero (`rankBadgeIcon`) — already a built node (block API). */
    rankBadge?: ReactNode
    /** e.g. "Rank #9 platform-wide". */
    rankLabel?: string
    /** e.g. "1420 XP". */
    pointsMeta?: string
    /** Goal-gradient meter toward the next rank; omitted when the viewer is already #1 or has no baseline. */
    progress?: StandingHeroProgress
    /** North-star CTA label — funnels to courses. Shown on the hero and (as the retry action) on the empty state. */
    climbCtaLabel: string
    onClimb: () => void

    /** Top-3 finishers for the podium. */
    podiumEntries?: Array<GlobalBoardPodiumEntry>
    /** "You" suffix label for the podium's own finisher. */
    meLabel: string

    /** Rank 4+ rows. Shown whenever there's more than the podium, or the viewer sits below it. */
    rows?: Array<GlobalBoardRow>
    /** Whether the rank-4+ section renders at all (mirrors the connected file's old gate). */
    showRows?: boolean
    /** Pinned self-row appended after an ellipsis when the viewer sits below the fetched slice. */
    selfRow?: GlobalBoardSelfRow
    /** "{count} more" between the fetched slice and the pinned self-row; omitted when there's no gap. */
    hiddenBetweenLabel?: string

    /** Bumped to fire a confetti burst on a top-3 platform finish. */
    celebrateKey?: number

    emptyTitle: string
    emptyDescription: string
}

/**
 * The global (all-users) leaderboard — presentational half of {@link import("./index").GlobalBoard}.
 * Same shell as the weekly board: a {@link StandingHeroCard} of the viewer's platform-wide standing,
 * the top-3 {@link Podium}, then rank 4+ as a followable {@link SurfaceListCard}. `isSkeleton`
 * threads down to every leaf; `StandingHeroCard`/`Podium`/`IconTile`/`SurfaceListCard`/`FollowButton`/
 * `UserCell` take no `isSkeleton` of their own (`missingSkeletonSupport`), so each is mirrored in
 * place with `Skeleton.*` at the exact position it renders, instead of a parallel skeleton tree. See
 * `tiers/split.md` — the connected `index.tsx` owns the fetch, the follow mutation, and every label.
 *
 * @param props - {@link GlobalBoardProps}
 */
export const _GlobalBoard = ({
    className,
    isSkeleton = false,
    isEmpty = false,
    rankBadge,
    rankLabel,
    pointsMeta,
    progress,
    climbCtaLabel,
    onClimb,
    podiumEntries = [],
    meLabel,
    rows = [],
    showRows = false,
    selfRow,
    hiddenBetweenLabel,
    celebrateKey = 0,
    emptyTitle,
    emptyDescription,
}: GlobalBoardProps) => {
    // settled, nothing to rank yet → funnel to courses (BLOCK-8: error/loading beat empty; this
    // component has no distinct error state — an SWR error settles with `!data`, which the
    // connected file already folds into `isEmpty`, exactly like the retired `AsyncContent` did).
    if (!isSkeleton && isEmpty) {
        return (
            <AsyncContentEmpty
                icon={TrophyIcon}
                title={emptyTitle}
                description={emptyDescription}
                onRetry={onClimb}
                retryLabel={climbCtaLabel}
            />
        )
    }

    const podiumRows = isSkeleton
        ? [false, true, false]
        : podiumEntries.slice(0, 3).map((entry) => entry.rank === 1)
    const skeletonRows = Array.from({ length: SKELETON_ROW_COUNT }, (_unused, index) => index)

    // `StackV`'s own `classNames` is the closed positioning-only allowlist (ATOM-4 vocabulary),
    // not a free-form passthrough — an incoming placement `className` from the caller needs the
    // frame tier's escape hatch (`Box`), which is the ONLY frame that takes a raw string.
    return (
        <Box className={className}>
            <StackV
                gap={6}
                identity={{ tier: "block", component: "GlobalBoard" }}
                items={[
                    // celebrate a top-3 platform finish — only meaningful once real data has settled
                    ...(!isSkeleton ? [() => <Confetti fireKey={celebrateKey} />] : []),

                    // ── your platform-wide standing ── `StandingHeroCard` has no `isSkeleton` of its
                    // own (missingSkeletonSupport): mirrored in place with `Skeleton.*`, same box.
                    () => (isSkeleton ? (
                        <Box className="flex flex-col gap-4 rounded-3xl bg-surface p-5 shadow-surface">
                            <StackH gap={5} align="center" items={[
                                () => <Skeleton className="size-10 shrink-0 rounded-2xl" />,
                                () => (
                                    <StackV gap={2} classNames={["min-w-0", "flex-1"]} items={[
                                        () => <Skeleton.Typography type="h6" width="1/2" />,
                                        () => <Skeleton.Typography type="body-sm" width="1/3" />,
                                    ]} />
                                ),
                            ]} />
                            <StackV gap={2} items={[
                                () => <Skeleton.Typography type="body-xs" width="1/3" />,
                                () => <Skeleton.ProgressBar />,
                            ]} />
                            <Skeleton className="h-10 w-40 rounded-full" />
                        </Box>
                    ) : (
                        <StandingHeroCard
                            badge={rankBadge ? <IconTile icon={rankBadge} tone="neutral" size="sm" /> : undefined}
                            rankLabel={rankLabel}
                            meta={pointsMeta}
                            progress={progress}
                            ctaLabel={climbCtaLabel}
                            onCta={onClimb}
                        />
                    )),

                    // ── the winners' dais ── `Podium` has no `isSkeleton` of its own
                    // (missingSkeletonSupport): mirrored in place, champion centered + raised.
                    () => (isSkeleton ? (
                        <StackH gap={4} align="end" justify="center" items={podiumRows.map((isChampion) => () => (
                            <StackV gap={2} align="center" items={[
                                () => <Skeleton className={isChampion ? "size-14 shrink-0 rounded-full" : "size-12 shrink-0 rounded-full"} />,
                                () => (
                                    <StackV gap={2} align="center" classNames={["w-full"]} items={[
                                        () => <Skeleton.Typography type="body-sm" width="3/4" />,
                                        () => <Skeleton.Typography type="body-xs" width="1/2" />,
                                    ]} />
                                ),
                                () => (
                                    <Box className={isChampion
                                        ? "h-16 w-20 rounded-t-2xl rounded-b-none"
                                        : "h-10 w-20 rounded-t-2xl rounded-b-none"}
                                    >
                                        <Skeleton className="h-full w-full rounded-t-2xl rounded-b-none" />
                                    </Box>
                                ),
                            ]} />
                        ))} />
                    ) : (
                        <Podium
                            meLabel={meLabel}
                            entries={podiumEntries.map((entry) => ({
                                rank: entry.rank,
                                username: entry.username,
                                avatar: entry.avatar,
                                pointsLabel: entry.pointsLabel,
                                isMe: entry.isMe,
                            }))}
                        />
                    )),

                    // ── rank 4+ ── a followable list; `SurfaceListCard`/`FollowButton`/`UserCell`
                    // have no `isSkeleton` of their own (missingSkeletonSupport): each row is
                    // mirrored in place with `Skeleton.UserCell` + bare bars, same row shape.
                    ...(isSkeleton || showRows ? [() => (
                        <SurfaceListCard>
                            {isSkeleton
                                ? skeletonRows.map((row) => (
                                    <SurfaceListCardItem key={row}>
                                        <StackH gap={4} align="center" items={[
                                            () => <Skeleton className="h-3 w-6 shrink-0 rounded-sm" />,
                                            () => <Skeleton.UserCell className="min-w-0 flex-1" withHandle={false} />,
                                            () => <Skeleton className="h-3 w-10 shrink-0 rounded-sm" />,
                                        ]} />
                                    </SurfaceListCardItem>
                                ))
                                : rows.map((row) => (
                                    <SurfaceListCardItem key={row.key}>
                                        <StackH gap={4} align="center" items={[
                                            () => (
                                                <Box className="w-6 shrink-0">
                                                    <Typography
                                                        size="xs"
                                                        align="end"
                                                        color={row.isMine ? "accent" : "muted"}
                                                        weight={row.isMine ? "semibold" : undefined}
                                                        text={String(row.rank)}
                                                    />
                                                </Box>
                                            ),
                                            () => (
                                                <Link
                                                    href={row.profileHref}
                                                    className="flex min-w-0 flex-1 items-center text-foreground no-underline transition-opacity hover:opacity-60"
                                                >
                                                    <UserCell username={row.displayName} avatar={row.avatar} />
                                                </Link>
                                            ),
                                            () => (
                                                <Typography
                                                    size="sm"
                                                    color={row.isMine ? "accent" : "muted"}
                                                    weight={row.isMine ? "semibold" : undefined}
                                                    classNames={["shrink-0"]}
                                                    text={row.pointsLabel}
                                                />
                                            ),
                                            ...(!row.isMine ? [() => (
                                                <FollowButton
                                                    className="shrink-0"
                                                    quiet
                                                    following={row.following}
                                                    isPending={row.isPending}
                                                    onToggle={row.onToggleFollow}
                                                />
                                            )] : []),
                                        ]} />
                                    </SurfaceListCardItem>
                                ))}

                            {/* viewer below the fetched slice → ellipsis + pinned self-row (hidden while shimmering) */}
                            {!isSkeleton && selfRow ? (
                                <>
                                    <Box className="bg-surface-secondary px-3 py-2 text-xs text-muted">
                                        <StackH gap={3} align="center" justify="center" items={[
                                            () => <span className="text-base leading-none tracking-widest">⋯</span>,
                                            ...(hiddenBetweenLabel ? [() => <Typography size="xs" color="muted" text={hiddenBetweenLabel} />] : []),
                                        ]} />
                                    </Box>
                                    <SurfaceListCardItem>
                                        <StackH gap={4} align="center" items={[
                                            () => (
                                                <Box className="w-6 shrink-0">
                                                    <Typography size="xs" align="end" color="accent" weight="semibold" text={String(selfRow.rank)} />
                                                </Box>
                                            ),
                                            () => (
                                                <Box className="min-w-0 flex-1">
                                                    <UserCell username={selfRow.displayName} avatar={selfRow.avatar} />
                                                </Box>
                                            ),
                                            () => (
                                                <Typography size="sm" color="accent" weight="semibold" classNames={["shrink-0"]} text={selfRow.pointsLabel} />
                                            ),
                                        ]} />
                                    </SurfaceListCardItem>
                                </>
                            ) : null}
                        </SurfaceListCard>
                    )] : []),
                ]}
            />
        </Box>
    )
}
