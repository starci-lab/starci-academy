"use client"

import React from "react"
import {
    Link,
    Typography,
    cn,
} from "@heroui/react"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { IconTile } from "@/components/blocks/identity/IconTile"
import { UserCell } from "@/components/blocks/identity/UserCell"
import {
    placeMedalIcon,
    rankBadgeIcon,
} from "@/components/features/dashboard/league/rankBadge"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** One normalised leaderboard row (the container maps its query data into this). */
export interface LeaderboardRow {
    /** React key + stable id. */
    key: string
    /** 1-based rank — ≤3 renders a place medal, else the number. */
    rank: number
    /** Display username (null → dash). */
    username: string | null
    /** Avatar URL (null → generated fallback). */
    avatar?: string | null
    /** Pre-formatted trailing value (e.g. "640 điểm" / "1420 XP"). */
    valueLabel: React.ReactNode
    /** True → highlight as the viewer (accent value + `meLabel` suffix). */
    isMe?: boolean
    /** Profile link target; omit → the identity is non-clickable. */
    profileHref?: string
    /** Context action at the far right (rank-delta caret / follow button). */
    trailing?: React.ReactNode
}

/** The viewer's own standing shown as the card's header line. */
export interface LeaderboardStanding {
    /** Viewer's rank — drives the leading {@link IconTile} badge (medal ≤3 / cup 4+). */
    rank: number
    /** Primary line (e.g. "Hạng #1 · top 20%"). */
    primary: React.ReactNode
    /** Secondary muted line (e.g. "640 điểm · Reset sau 1 ngày 18 giờ"). */
    secondary?: React.ReactNode
}

/** Props for {@link LeaderboardListCard}. */
export interface LeaderboardListCardProps extends WithClassNames<undefined> {
    /**
     * Bare mode — skip the {@link LabeledCard} frame (`title`/`onSeeMore` ignored) and
     * render just the standing + list. For a full page that already has its own
     * `PageHeader` (the course leaderboard); the dashboard cards leave it off.
     */
    bare?: boolean
    /** Card label (LabeledCard heading). Ignored when `bare`. */
    title?: React.ReactNode
    /** "See more" handler (opens the full board). */
    onSeeMore?: () => void
    /** "See more" label. */
    seeMoreLabel?: React.ReactNode
    /** The viewer's own standing header line (omit when they have no rank). */
    standing?: LeaderboardStanding
    /**
     * Optional node between the standing and the list — e.g. a `Podium` on a spacious
     * page (course leaderboard). Dashboard cards omit it (compact, no podium).
     */
    topSlot?: React.ReactNode
    /** The ranked rows (top-N slice; when a podium is in `topSlot`, pass rank 4+). */
    rows: Array<LeaderboardRow>
    /** Pinned self-row when the viewer sits below the shown slice. */
    selfRow?: LeaderboardRow
    /** Ellipsis label above the pinned self-row (e.g. "còn 41 người"). */
    ellipsisLabel?: React.ReactNode
    /** "You" suffix appended to the viewer's own row name. */
    meLabel?: React.ReactNode
}

/**
 * The ONE shared render for a dashboard leaderboard preview — a {@link LabeledCard}
 * with the viewer's own standing (rank-driven {@link IconTile} badge: medal for the
 * podium, cup below) over a bordered {@link SurfaceListCard} of ranked rows (top-3
 * wear place medals). Both the weekly "League tuần" and the global "Top học viên"
 * cards map their data into this, so they render IDENTICALLY (thầy 2026-07-17 "2
 * mục y chang"); only the per-context `trailing` slot (rank-delta caret vs follow)
 * and the emergent badge differ. Presentational + props-only; containers own the fetch.
 *
 * @param props - {@link LeaderboardListCardProps}
 */
export const LeaderboardListCard = ({
    bare = false,
    title,
    onSeeMore,
    seeMoreLabel,
    standing,
    topSlot,
    rows,
    selfRow,
    ellipsisLabel,
    meLabel,
    className,
}: LeaderboardListCardProps) => {
    /** Render one row (shared by the ranked list and the pinned self-row). */
    const renderRow = (row: LeaderboardRow) => {
        const displayName = row.isMe && row.username && meLabel
            ? `${row.username} · ${meLabel}`
            : (row.username ?? "")
        const identity = (
            <UserCell username={displayName} avatar={row.avatar ?? undefined} />
        )
        return (
            <SurfaceListCardItem key={row.key}>
                <div className="flex items-center gap-3">
                    {/* top-3 → place medal (🥇🥈🥉); rank 4+ → plain number */}
                    {row.rank <= 3 ? (
                        <span className="flex w-6 shrink-0 items-center justify-center">
                            {placeMedalIcon(row.rank)}
                        </span>
                    ) : (
                        <span
                            className={cn(
                                "w-6 shrink-0 text-right text-xs",
                                row.isMe ? "font-semibold text-accent" : "text-muted",
                            )}
                        >
                            {row.rank}
                        </span>
                    )}
                    {row.profileHref ? (
                        <Link
                            href={row.profileHref}
                            className="flex min-w-0 flex-1 items-center text-foreground no-underline transition-opacity hover:opacity-60"
                        >
                            {identity}
                        </Link>
                    ) : (
                        <div className="flex min-w-0 flex-1 items-center">{identity}</div>
                    )}
                    <Typography
                        type="body-sm"
                        color={row.isMe ? undefined : "muted"}
                        className={cn("shrink-0", row.isMe && "font-semibold text-accent")}
                    >
                        {row.valueLabel}
                    </Typography>
                    {row.trailing ? (
                        <div className="flex shrink-0 items-center">{row.trailing}</div>
                    ) : null}
                </div>
            </SurfaceListCardItem>
        )
    }

    const content = (
        <>
            {/* viewer's own standing — rank-driven badge (medal/cup) + rank text */}
            {standing ? (
                <div className="flex items-center gap-3">
                    <IconTile icon={rankBadgeIcon(standing.rank)} tone="neutral" size="sm" />
                    <div className="flex min-w-0 flex-col">
                        <Typography type="body-sm" weight="bold" truncate>
                            {standing.primary}
                        </Typography>
                        {standing.secondary ? (
                            <Typography type="body-xs" color="muted">
                                {standing.secondary}
                            </Typography>
                        ) : null}
                    </div>
                </div>
            ) : null}

            {/* optional podium (spacious page) between standing and the list */}
            {topSlot}

            {/* skip the list card entirely when there are no rows (all on the podium) */}
            {rows.length > 0 || selfRow ? (
                <SurfaceListCard bordered>
                    {rows.map(renderRow)}
                    {/* viewer below the slice → ellipsis + pinned self-row */}
                    {selfRow ? (
                        <>
                            <div className="flex items-center justify-center gap-2 bg-surface-secondary px-3 py-2 text-xs text-muted">
                                <span className="text-base leading-none tracking-widest">⋯</span>
                                {ellipsisLabel}
                            </div>
                            {renderRow(selfRow)}
                        </>
                    ) : null}
                </SurfaceListCard>
            ) : null}
        </>
    )

    // bare → the page owns the frame (PageHeader); dashboard cards keep the LabeledCard
    if (bare) {
        return <div className={cn("flex flex-col gap-3", className)}>{content}</div>
    }

    return (
        <LabeledCard
            label={title}
            onSeeMore={onSeeMore}
            seeMoreLabel={seeMoreLabel}
            className={className}
            contentClassName="flex flex-col gap-3"
        >
            {content}
        </LabeledCard>
    )
}
