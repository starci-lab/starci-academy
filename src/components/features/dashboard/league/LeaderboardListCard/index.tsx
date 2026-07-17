"use client"

import React from "react"
import {
    Link,
    Typography,
    cn,
} from "@heroui/react"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import type { VerdictBand } from "@/components/blocks/cards/verdict-band"
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
    /**
     * Optional left band (`SurfaceListCardItem.withVerdict`, `card.md` §3i) — a DATA
     * signal on this row (e.g. the weekly cohort's promote/demote zone). Pass the
     * canonical {@link VerdictBand} (`variant`/`color`) — NOT a free-form `className`,
     * which `verdictBandClassName` silently ignores (was the "invisible border" bug).
     */
    verdict?: VerdictBand
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
            <UserCell
                username={displayName}
                avatar={row.avatar ?? undefined}
                nameClassName={row.isMe ? "text-accent" : undefined}
            />
        )
        return (
            <SurfaceListCardItem key={row.key} withVerdict={row.verdict}>
                <div className="flex items-center gap-3">
                    {/* top-3 → place medal (🥇🥈🥉); rank 4+ → plain number. Number matches the
                        medal's w-6 CENTERED slot (thầy 2026-07-17 "4,5 còn lệch") at the same
                        text-sm foreground as the name (same-row same-size, `visual-hierarchy`). */}
                    {row.rank <= 3 ? (
                        <span className="flex w-6 shrink-0 items-center justify-center">
                            {placeMedalIcon(row.rank)}
                        </span>
                    ) : (
                        <span className="flex w-6 shrink-0 items-center justify-center text-sm text-foreground">
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
                    {/* value = meta → always muted + right-aligned tabular so the XP column
                        lines up across rows (thầy 2026-07-17: accent moves to the NAME, value
                        stays muted). */}
                    <Typography
                        type="body-sm"
                        color="muted"
                        className="shrink-0 text-right tabular-nums"
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
                    {/* viewer below the slice → collapsed-rows ellipsis + pinned self-row.
                        Renders as a REAL row (thầy 2026-07-17): a `SurfaceListCardItem` so it
                        gets the same `p-3` + full-bleed separator, a transparent bg that INHERITS
                        the card's `bg-surface` (no `bg-surface-secondary` banner), and `min-h-8`
                        on the inner box to match the avatar rows' height exactly (avatar sm =
                        size-8). The ⋯ sits in the same `w-6` centred slot as the rank number so it
                        aligns as one of the rows, not a strip between them. */}
                    {selfRow ? (
                        <>
                            <SurfaceListCardItem>
                                <div className="flex min-h-8 items-center gap-3">
                                    <span className="flex w-6 shrink-0 items-center justify-center text-base leading-none tracking-widest text-muted">
                                        ⋯
                                    </span>
                                    <Typography type="body-sm" color="muted">
                                        {ellipsisLabel}
                                    </Typography>
                                </div>
                            </SurfaceListCardItem>
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
