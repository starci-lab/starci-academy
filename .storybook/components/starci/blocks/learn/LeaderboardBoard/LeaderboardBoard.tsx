"use client"

import React, { useEffect, useMemo, useState } from "react"
import { type SkeletonProps } from "@sb-components/composites/_slot"
import { TrophyIcon } from "@phosphor-icons/react"
import { AnimatePresence, motion } from "framer-motion"
import { AsyncContent } from "@sb-components/composites/async/AsyncContent/AsyncContent"
import { SurfaceCard, SurfaceCardList, type SurfaceCardListItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { UserCell } from "@sb-components/composites/lists/UserCell/UserCell"
import { IconTile } from "@sb-components/atoms/display/IconTile/IconTile"
import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV, StackH } from "@sb-components/frames/Stack/Stack"

/**
 * `LeaderboardBoard` — the ranked board: async lifecycle, the viewer's own standing, a
 * top-3 podium, ranked rows with a pinned self-row + ellipsis, and top-3 confetti.
 *
 * Reuses `AsyncContent` (branch switch), `SurfaceCard.List` (rows), and `UserCell` (row
 * identity + `isOwnRow` accent). Two internal-only parts: `Podium` (a raised dais of
 * `Avatar` + `Typography`) and `Confetti` (a fixed decorative particle overlay pulsed by
 * `celebrateKey`).
 *
 * One leaf, many states. Two skeleton knobs: `isLoading` drives `AsyncContent`'s branch
 * from fixed placeholder counts (no data yet); `isSkeleton` flows into the real atoms
 * during a background revalidate. Builds the "Rank #N" sentence from typed
 * `standing.rank`; `primaryLabel`/`secondaryLabel` arrive pre-worded. `meLabel` rides as
 * an `sr-only` tag on the viewer's own rows.
 */

/** The viewer's own standing, shown above the podium. */
export interface LeaderboardStanding {
    /** The viewer's numeric position on the board. The block words this into "Rank #N" itself. */
    rank: number
    /** Primary stat line, already worded by the caller (screen-specific — e.g. an XP total). */
    primaryLabel: string
    /** Optional quiet context line under the primary stat (e.g. "Top 5% of the course"). */
    secondaryLabel?: string
}

/** One top-3 finisher shown on the {@link Podium}. */
export interface LeaderboardPodiumEntry {
    /** Podium position — only the top three ever reach this shape. */
    rank: 1 | 2 | 3
    /** Account username; drives the avatar fallback (same contract as {@link UserCell}). */
    username: string
    /** Uploaded avatar URL; resilient fallbacks handled by {@link Avatar}. */
    avatar?: string | null
    /** Already-worded score line (e.g. "1.240 XP"). */
    pointsLabel: string
    /** `true` when this entry is the viewer's own placement. */
    isMe?: boolean
}

/** One ranked row of the board (or the pinned self-row). */
export interface LeaderboardRow {
    /** Stable React key. */
    key: string
    /** This row's position on the board. */
    rank: number
    /** Account username; drives the avatar fallback (same contract as {@link UserCell}). */
    username: string
    /** Uploaded avatar URL; resilient fallbacks handled by {@link UserCell}. */
    avatar?: string | null
    /** Already-worded score line (e.g. "980 XP"), the row's equivalent of a podium entry's `pointsLabel`. */
    valueLabel: string
    /** `true` when this row is the viewer's own placement. */
    isMe?: boolean
    /** Navigates to the player's profile when set; the row stays static otherwise. */
    profileHref?: string
}

/** Props for {@link LeaderboardBoard}. */
export interface LeaderboardBoardProps {
    /** True while the first load is running — {@link AsyncContent}'s loading branch. */
    isLoading: boolean
    /** True (once loaded) → the board has no participants at all. */
    isEmpty: boolean
    /** Truthy → the board failed to load. Pass SWR's `error`. */
    error?: unknown
    /** Retry handler for the error branch. */
    onRetry: () => void
    /** The viewer's own standing, shown above the podium. Omitted when the viewer has no rank yet. */
    standing?: LeaderboardStanding
    /** Top-3 finishers, in any order — the block sorts them onto the dais itself. */
    podiumEntries: Array<LeaderboardPodiumEntry>
    /** The ranked rows below the podium, in display order. */
    rows: Array<LeaderboardRow>
    /**
     * The viewer's own row, pinned at the end of the list when it isn't already
     * inside `rows` — e.g. the viewer sits outside the visible top N.
     */
    selfRow?: LeaderboardRow
    /** How many ranks sit between the visible `rows` and `selfRow`. Paired with `selfRow`. */
    hiddenBetweenCount?: number
    /**
     * Bumping this number replays the top-3 confetti burst. The SCREEN decides
     * when a placement is worth celebrating (a fresh top-3 entry, not every
     * reload) — this block only reacts to the pulse.
     */
    celebrateKey: number
    /** Accessible tag for "this row is you" — already localized, read by screen readers only. */
    meLabel: string
    /** `true` → every atom this block owns switches to its own shimmer (data already loaded). */
    isSkeleton?: boolean
}

// ─────────────────────────────────────────────────────────────────────────────
// Podium — the raised champion dais. NEW, internal to this block (see file header).
// ─────────────────────────────────────────────────────────────────────────────

/** Visual order left→right on the dais: 2nd, 1st (centre), 3rd. */
const PODIUM_VISUAL_ORDER: Record<1 | 2 | 3, number> = { 2: 1, 1: 2, 3: 3 }
/** Riser height by rank — 1st tallest, so the dais itself carries the ranking, not just a label. */
const PODIUM_RISER_HEIGHT: Record<1 | 2 | 3, string> = { 1: "h-20", 2: "h-14", 3: "h-10" }

/** Props for the internal {@link Podium} piece. */
interface PodiumProps {
    /** Top-3 finishers, in any order. */
    entries: Array<LeaderboardPodiumEntry>
    /** Accessible tag for "this is you", forwarded from the block. */
    meLabel: string
    isSkeleton: boolean
}

/** One podium dais entry: avatar, username, score line, ranked riser. */
const podiumEntryCard = (entry: LeaderboardPodiumEntry, meLabel: string, isSkeleton: boolean) => {
    const riser = (
        <div className={`flex w-full items-center justify-center rounded-t-xl bg-accent-soft ${PODIUM_RISER_HEIGHT[entry.rank]}`}>
            {/* real `src` (`Podium/index.tsx:103-112`): the rank number is a BARE div,
                declaring no size at all (inherits base/16px), just `font-bold` — not `lg`. */}
            <Typography
                size="base"
                weight="bold"
                tabularNums
                isSkeleton={isSkeleton}
                text={isSkeleton ? undefined : String(entry.rank)}
                color="accent-soft"

            />
        </div>
    )
    return (
        <div key={entry.rank} className="w-24">
            <StackV
                gap={2}
                align="center"
                isSkeleton={isSkeleton}
                items={[
                    () => (
                        <div>
                            <Avatar
                                name={entry.username}
                                src={entry.avatar ?? undefined}
                                seed={entry.username}
                                size={entry.rank === 1 ? "lg" : "md"}
                                isSkeleton={isSkeleton}

                            />
                        </div>
                    ),
                    () => (
                        <Typography
                            size="sm"
                            weight="medium"
                            color={entry.isMe ? "accent" : undefined}
                            truncate
                            align="center"
                            isSkeleton={isSkeleton}
                            text={isSkeleton ? undefined : entry.username}
                            classNames={["w-full"]}

                        />
                    ),
                    () => (
                        <Typography
                            size="xs"
                            color="muted"
                            isSkeleton={isSkeleton}
                            text={isSkeleton ? undefined : entry.pointsLabel}

                        />
                    ),
                    () => riser,
                    ...(entry.isMe ? [() => <span className="sr-only">{meLabel}</span>] : []),
                ]}
            />
        </div>
    )
}

const Podium = ({ entries, meLabel, isSkeleton }: PodiumProps) => (
    <StackH
        gap={3}
        justify="center"
        align="end"
        isSkeleton={isSkeleton}
        items={[...entries]
            .sort((a, b) => PODIUM_VISUAL_ORDER[a.rank] - PODIUM_VISUAL_ORDER[b.rank])
            .map((entry) => () => podiumEntryCard(entry, meLabel, isSkeleton))}
    />
)

// ─────────────────────────────────────────────────────────────────────────────
// Confetti — fixed, non-interactive falling-particle overlay. NEW, internal.
// ─────────────────────────────────────────────────────────────────────────────

const CONFETTI_PIECE_COUNT = 24
const CONFETTI_DURATION_MS = 2400
const CONFETTI_COLOR_CLASS = ["bg-accent", "bg-success", "bg-warning", "bg-danger"]

/** One falling piece's randomized flight. */
interface ConfettiPiece {
    key: number
    leftPercent: number
    delaySeconds: number
    durationSeconds: number
    rotateDegrees: number
    colorClass: string
}

/** Props for the internal {@link Confetti} effect. */
interface ConfettiProps {
    /** Bumping this replays the burst. */
    celebrateKey: number
}

/**
 * Fires a burst of falling particles every time `celebrateKey` changes (including
 * on first mount, since a fresh board can already open on a celebrated placement).
 * Self-clears after the flight so it never lingers as dead, invisible DOM.
 */
const Confetti = ({ celebrateKey }: ConfettiProps) => {
    const [isPlaying, setIsPlaying] = useState(false)

    useEffect(() => {
        setIsPlaying(true)
        const timer = window.setTimeout(() => setIsPlaying(false), CONFETTI_DURATION_MS)
        return () => window.clearTimeout(timer)
    }, [celebrateKey])

    const pieces = useMemo<Array<ConfettiPiece>>(
        () =>
            Array.from({ length: CONFETTI_PIECE_COUNT }, (_, index) => ({
                key: index,
                leftPercent: Math.random() * 100,
                delaySeconds: Math.random() * 0.4,
                durationSeconds: 1.6 + Math.random() * 0.8,
                rotateDegrees: Math.random() * 360,
                colorClass: CONFETTI_COLOR_CLASS[index % CONFETTI_COLOR_CLASS.length],
            })),
        [celebrateKey],
    )

    if (!isPlaying) {
        return null
    }

    return (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
            <AnimatePresence>
                {pieces.map((piece) => (
                    <motion.span
                        key={piece.key}
                        className={`absolute top-[-5%] size-2 rounded-sm ${piece.colorClass}`}
                        style={{ left: `${piece.leftPercent}%` }}
                        initial={{ y: "-10vh", opacity: 1, rotate: 0 }}
                        animate={{ y: "110vh", opacity: [1, 1, 0], rotate: piece.rotateDegrees }}
                        transition={{ duration: piece.durationSeconds, delay: piece.delaySeconds, ease: "easeIn" }}
                    />
                ))}
            </AnimatePresence>
        </div>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// Board — standing + podium + ranked rows. The block's ONE leaf/state-switch content.
// ─────────────────────────────────────────────────────────────────────────────

/** Builds one row's free-form `SurfaceCard.List` content: rank number + the unchanged `UserCell`. */
const rowItem = (row: LeaderboardRow, meLabel: string, isSkeleton: boolean): SurfaceCardListItem => ({
    key: row.key,
    href: row.profileHref,
    content: () => (
        <StackH
            gap={3}
            align="center"
            isSkeleton={isSkeleton}
            items={[
                () => (
                    <Typography
                        size="sm"
                        color="muted"
                        tabularNums
                        align="center"
                        isSkeleton={isSkeleton}
                        text={isSkeleton ? undefined : `#${row.rank}`}
                        classNames={["w-1/4", "shrink-0"]}

                    />
                ),
                () => (
                    <div className="min-w-0 flex-1">
                        <UserCell
                            username={row.username}
                            avatar={row.avatar}
                            isOwnRow={row.isMe}
                            trailing={({ isSkeleton: slotSkeleton }: SkeletonProps) => (
                                <Typography
                                    size="sm"
                                    weight="medium"
                                    tabularNums
                                    isSkeleton={slotSkeleton}
                                    text={slotSkeleton ? undefined : row.valueLabel}

                                />
                            )}
                            isSkeleton={isSkeleton}

                        />
                    </div>
                ),
                ...(row.isMe ? [() => <span className="sr-only">{meLabel}</span>] : []),
            ]}
        />
    ),
})

/**
 * Assembles the list's rows: the visible `rows`, then — only when the viewer's
 * own row isn't already among them — an ellipsis marker (skipped when the gap is
 * zero) and the pinned `selfRow` at the end.
 */
const buildListItems = (
    rows: Array<LeaderboardRow>,
    selfRow: LeaderboardRow | undefined,
    hiddenBetweenCount: number | undefined,
    meLabel: string,
    isSkeleton: boolean,
): Array<SurfaceCardListItem> => {
    const rowItems = rows.map((row) => rowItem(row, meLabel, isSkeleton))
    if (!selfRow) {
        return rowItems
    }
    const ellipsisItem: SurfaceCardListItem | null =
        hiddenBetweenCount != null && hiddenBetweenCount > 0
            ? {
                key: "ellipsis",
                content: () => (
                    <Typography
                        size="xs"
                        color="muted"
                        align="center"
                        isSkeleton={isSkeleton}
                        text={isSkeleton ? undefined : `⋯ ${hiddenBetweenCount} more in between`}

                    />
                ),
            }
            : null
    return [...rowItems, ...(ellipsisItem ? [ellipsisItem] : []), rowItem(selfRow, meLabel, isSkeleton)]
}

/** Props for the internal {@link Board} content tree — reused for both the real render and the loading skeleton. */
interface BoardProps {
    standing?: LeaderboardStanding
    podiumEntries: Array<LeaderboardPodiumEntry>
    rows: Array<LeaderboardRow>
    selfRow?: LeaderboardRow
    hiddenBetweenCount?: number
    meLabel: string
    isSkeleton: boolean
}

const Board = ({ standing, podiumEntries, rows, selfRow, hiddenBetweenCount, meLabel, isSkeleton }: BoardProps) => {
    const standingLabels = standing ? (
        <StackV
            gap={1}
            isSkeleton={isSkeleton}
            items={[
                // The rank NUMBER is typed data; "Rank #N" is the block's own wording (§14d.1).
                () => (
                    <Typography
                        size="base"
                        weight="bold"
                        tabularNums
                        isSkeleton={isSkeleton}
                        text={isSkeleton ? undefined : `Rank #${standing.rank}`}

                    />
                ),
                () => (
                    <Typography
                        size="sm"
                        isSkeleton={isSkeleton}
                        text={isSkeleton ? undefined : standing.primaryLabel}

                    />
                ),
                ...(standing.secondaryLabel ? [() => (
                    <Typography
                        size="xs"
                        color="muted"
                        isSkeleton={isSkeleton}
                        text={isSkeleton ? undefined : standing.secondaryLabel}

                    />
                )] : []),
            ]}
        />
    ) : null

    const standingCard = standing ? (
        <SurfaceCard

            body={() => (
                <StackH
                    gap={3}
                    align="center"
                    isSkeleton={isSkeleton}
                    items={[
                        () => <IconTile icon={TrophyIcon} tone="accent" size="sm" isSkeleton={isSkeleton} />,
                        () => standingLabels,
                    ]}
                />
            )}
        />
    ) : null

    return (
        <StackV
            gap={6}
            isSkeleton={isSkeleton}
            items={[
                () => standingCard,
                ...(podiumEntries.length > 0 ? [() => (
                    <Podium entries={podiumEntries} meLabel={meLabel} isSkeleton={isSkeleton} />
                )] : []),
                ({ isSkeleton }: SkeletonProps) => (
                    <SurfaceCardList
                        items={buildListItems(rows, selfRow, hiddenBetweenCount, meLabel, isSkeleton ?? false)}
                        isSkeleton={isSkeleton}
                    />
                ),
            ]}
        />
    )
}

/** Fixed-shape placeholder rendered while {@link AsyncContentBaseProps.isLoading} — no real data exists yet. */
const LOADING_PODIUM: Array<LeaderboardPodiumEntry> = [
    { rank: 2, username: "", pointsLabel: "" },
    { rank: 1, username: "", pointsLabel: "" },
    { rank: 3, username: "", pointsLabel: "" },
]
const LOADING_ROWS: Array<LeaderboardRow> = Array.from({ length: 5 }, (_, index) => ({
    key: `loading-${index}`,
    rank: index + 4,
    username: "",
    valueLabel: "",
}))
const LOADING_STANDING: LeaderboardStanding = { rank: 0, primaryLabel: "" }

// ─────────────────────────────────────────────────────────────────────────────
// LeaderboardBoard — the exported block.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The ranked board itself. See the file header for the reuse contract, the two
 * new internal parts, and the single-leaf/multi-state read of the async switch.
 *
 * @param props - {@link LeaderboardBoardProps}
 */
const LeaderboardBoard = ({
    isLoading,
    isEmpty,
    error,
    onRetry,
    standing,
    podiumEntries,
    rows,
    selfRow,
    hiddenBetweenCount,
    celebrateKey,
    meLabel,
    isSkeleton = false,
}: LeaderboardBoardProps) => (
    <div>
        <AsyncContent
            isLoading={isLoading}
            skeleton={() => (
                <Board
                    standing={LOADING_STANDING}
                    podiumEntries={LOADING_PODIUM}
                    rows={LOADING_ROWS}
                    meLabel=""
                    isSkeleton

                />
            )}
            isEmpty={isEmpty}
            emptyContent={{
                title: "The leaderboard has no one yet",
                description: "Complete a lesson to claim the first spot.",
            }}
            error={error}
            errorContent={{
                title: "Couldn't load the leaderboard",
                description: "Try again to see the latest standings.",
                onRetry,
                retryLabel: "Try again",
            }}
            content={() => (
                <>
                    {/* Only the CONTENT branch celebrates — there is nothing worth confetting
                        over loading chrome, an empty board, or an error message. */}
                    <Confetti celebrateKey={celebrateKey} />
                    <Board
                        standing={standing}
                        podiumEntries={podiumEntries}
                        rows={rows}
                        selfRow={selfRow}
                        hiddenBetweenCount={hiddenBetweenCount}
                        meLabel={meLabel}
                        isSkeleton={isSkeleton}

                    />
                </>
            )}
        />
    </div>
)

export { LeaderboardBoard }
