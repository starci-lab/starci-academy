"use client"

import React, { useEffect, useMemo, useState } from "react"
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
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `LeaderboardBoard`: the ranked board itself — async lifecycle, the
 * viewer's own standing, the top-3 podium, the ranked rows with a pinned
 * self-row + ellipsis, and the top-3 confetti celebration.
 *
 * ⭐ WHY THIS FILE IS MOSTLY REUSE. This task's whole reason for existing is a
 * previous block that reached PAST a composite it should have used and rebuilt a
 * worse version by hand. So the loading/empty/error/content switch here is
 * `AsyncContent` WHOLESALE (not a hand-rolled if/else ladder), the bordered row
 * list is `SurfaceCard.List` WHOLESALE (not a new list composite), and every row's
 * identity + "this is me" accent is the `UserCell` atom UNCHANGED — `isOwnRow`
 * already does the accent, `trailing` already takes the score. Reaching past any
 * of these to hand-roll a row would be the exact mistake this file exists to
 * avoid repeating.
 *
 * TWO GENUINELY NEW PARTS, both INTERNAL to this block (no catalog equivalent,
 * and deliberately not their own screen-facing blocks — nothing else in the tree
 * needs a dais or a particle overlay today):
 *   • `Podium` — the raised champion dais. Composes ONLY `Avatar` + `Typography`;
 *     nothing under `stats/*`/`cards/*` draws a stepped riser.
 *   • `Confetti` — a fixed, non-interactive falling-particle overlay, pulsed by
 *     `celebrateKey`. Not an atom (no size/skeleton contract, purely decorative,
 *     unmounts itself) and not reusable outside a "you just placed" moment.
 *
 * ⭐ ONE LEAF, MANY STATES (§11f). Loading / empty / error / content are DATA
 * conditions of the same async region, not different shapes this block draws —
 * `AsyncContent` already treats them that way (its own file calls itself "the
 * ONE async-state FRAME"), so a block wrapping it inherits the same read: the
 * leaf is "Board", and loading/empty/error/content are its states.
 *
 * ⭐ TWO INDEPENDENT SKELETON KNOBS, on purpose. `isLoading` drives `AsyncContent`'s
 * branch switch — BEFORE any real shape exists, so its skeleton slot is built from
 * fixed placeholder counts, not from the caller's arrays. `isSkeleton` flows into
 * the REAL standing/podium/row atoms once data exists (§12c: a caller-held flag
 * for a background revalidate) — an entirely different moment from "no data yet".
 * Conflating the two would mean a screen mid-revalidate has no way to shimmer
 * without also discarding the board that's already on screen.
 *
 * ⭐ THE RANK NUMBER IS BLOCK WORDING, `primaryLabel`/`secondaryLabel` ARE NOT.
 * `standing.rank` is typed domain data (a number); the sentence "Rank #12" is
 * built HERE (§14d.1 — typed data in, a sentence out). `primaryLabel`/
 * `secondaryLabel` arrive pre-worded from the caller because they carry
 * screen-specific business phrasing (which stat counts as "primary" this season)
 * that does not belong to a generic board.
 *
 * ⭐ `meLabel` IS AN ACCESSIBLE TAG, NOT VISIBLE CHROME. `isOwnRow`/color already
 * carries the "this is me" signal for sighted readers; a screen reader gets
 * nothing from a colour change, so `meLabel` rides as an `sr-only` span next to
 * every row/podium entry/pinned self-row that is the viewer's own. Rendering it
 * as visible chrome next to every "me" occurrence (podium AND pinned row) would
 * repeat the same badge on screen twice for one viewer.
 *
 * ⭐ THE ELLIPSIS + PINNED SELF-ROW IS ONE SHAPE, NOT A SEPARATE LEAF. Whether the
 * viewer's own row needs pinning is a DATA condition (`selfRow` set + a gap to
 * bridge), so it lives inside the same `SurfaceCard.List` as an extra couple of
 * rows — never a second list composite bolted on below the first.
 * ─────────────────────────────────────────────────────────────────────────────
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
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
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
    showAnatomy: boolean
}

/** One podium dais entry: avatar, username, score line, ranked riser. */
const podiumEntryCard = (entry: LeaderboardPodiumEntry, meLabel: string, isSkeleton: boolean, showAnatomy: boolean) => {
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
                showAnatomy={showAnatomy}
            />
        </div>
    )
    return (
        <StackV
            key={entry.rank}
            gap={2}
            align="center"
            className="w-24"
            anatPart={showAnatomy ? "StackV" : undefined}
            body={
                <>
                    <div data-anat-part={showAnatomy ? "Avatar" : undefined}>
                        <Avatar
                            name={entry.username}
                            src={entry.avatar ?? undefined}
                            seed={entry.username}
                            size={entry.rank === 1 ? "lg" : "md"}
                            isSkeleton={isSkeleton}
                            showAnatomy={showAnatomy}
                        />
                    </div>
                    <Typography
                        size="sm"
                        weight="medium"
                        color={entry.isMe ? "accent" : undefined}
                        truncate
                        align="center"
                        isSkeleton={isSkeleton}
                        text={isSkeleton ? undefined : entry.username}
                        classNames={["w-full"]}
                        showAnatomy={showAnatomy}
                    />
                    <Typography
                        size="xs"
                        color="muted"
                        isSkeleton={isSkeleton}
                        text={isSkeleton ? undefined : entry.pointsLabel}
                        showAnatomy={showAnatomy}
                    />
                    {riser}
                    {entry.isMe ? <span className="sr-only">{meLabel}</span> : null}
                </>
            }
        />
    )
}

const Podium = ({ entries, meLabel, isSkeleton, showAnatomy }: PodiumProps) => (
    <StackH
        gap={3}
        justify="center"
        align="end"
        anatPart={showAnatomy ? "StackH" : undefined}
        body={[...entries]
            .sort((a, b) => PODIUM_VISUAL_ORDER[a.rank] - PODIUM_VISUAL_ORDER[b.rank])
            .map((entry) => podiumEntryCard(entry, meLabel, isSkeleton, showAnatomy))}
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
const rowItem = (row: LeaderboardRow, meLabel: string, isSkeleton: boolean, showAnatomy: boolean): SurfaceCardListItem => ({
    key: row.key,
    href: row.profileHref,
    content: (
        <StackH
            gap={3}
            align="center"
            anatPart={showAnatomy ? "StackH" : undefined}
            body={
                <>
                    <Typography
                        size="sm"
                        color="muted"
                        tabularNums
                        align="center"
                        isSkeleton={isSkeleton}
                        text={isSkeleton ? undefined : `#${row.rank}`}
                        classNames={["w-1/4", "shrink-0"]}
                        showAnatomy={showAnatomy}
                    />
                    <div className="min-w-0 flex-1" data-anat-part={showAnatomy ? "UserCell" : undefined}>
                        <UserCell
                            username={row.username}
                            avatar={row.avatar}
                            isOwnRow={row.isMe}
                            trailing={({ isSkeleton: slotSkeleton }: { isSkeleton?: boolean }) => (
                                <Typography
                                    size="sm"
                                    weight="medium"
                                    tabularNums
                                    isSkeleton={slotSkeleton}
                                    text={slotSkeleton ? undefined : row.valueLabel}
                                    showAnatomy={showAnatomy}
                                />
                            )}
                            isSkeleton={isSkeleton}
                            showAnatomy={showAnatomy}
                        />
                    </div>
                    {row.isMe ? <span className="sr-only">{meLabel}</span> : null}
                </>
            }
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
    showAnatomy: boolean,
): Array<SurfaceCardListItem> => {
    const rowItems = rows.map((row) => rowItem(row, meLabel, isSkeleton, showAnatomy))
    if (!selfRow) {
        return rowItems
    }
    const ellipsisItem: SurfaceCardListItem | null =
        hiddenBetweenCount != null && hiddenBetweenCount > 0
            ? {
                key: "ellipsis",
                content: (
                    <Typography
                        size="xs"
                        color="muted"
                        align="center"
                        isSkeleton={isSkeleton}
                        text={isSkeleton ? undefined : `⋯ ${hiddenBetweenCount} more in between`}
                        showAnatomy={showAnatomy}
                    />
                ),
            }
            : null
    return [...rowItems, ...(ellipsisItem ? [ellipsisItem] : []), rowItem(selfRow, meLabel, isSkeleton, showAnatomy)]
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
    showAnatomy: boolean
}

const Board = ({ standing, podiumEntries, rows, selfRow, hiddenBetweenCount, meLabel, isSkeleton, showAnatomy }: BoardProps) => {
    const standingLabels = standing ? (
        <StackV
            gap={1}
            anatPart={showAnatomy ? "StackV" : undefined}
            body={
                <>
                    {/* The rank NUMBER is typed data; "Rank #N" is the block's own wording (§14d.1). */}
                    <Typography
                        size="base"
                        weight="bold"
                        tabularNums
                        isSkeleton={isSkeleton}
                        text={isSkeleton ? undefined : `Rank #${standing.rank}`}
                        showAnatomy={showAnatomy}
                    />
                    <Typography
                        size="sm"
                        isSkeleton={isSkeleton}
                        text={isSkeleton ? undefined : standing.primaryLabel}
                        showAnatomy={showAnatomy}
                    />
                    {standing.secondaryLabel ? (
                        <Typography
                            size="xs"
                            color="muted"
                            isSkeleton={isSkeleton}
                            text={isSkeleton ? undefined : standing.secondaryLabel}
                            showAnatomy={showAnatomy}
                        />
                    ) : null}
                </>
            }
        />
    ) : null

    const standingCard = standing ? (
        <SurfaceCard
            anatPart={showAnatomy ? "SurfaceCard" : undefined}
            body={() => (
                <StackH
                    gap={3}
                    align="center"
                    anatPart={showAnatomy ? "StackH" : undefined}
                    body={
                        <>
                            <IconTile icon={TrophyIcon} tone="accent" size="sm" isSkeleton={isSkeleton} showAnatomy={showAnatomy} />
                            {standingLabels}
                        </>
                    }
                />
            )}
        />
    ) : null

    return (
        <StackV
            gap={6}
            anatPart={showAnatomy ? "StackV" : undefined}
            body={
                <>
                    {standingCard}
                    {podiumEntries.length > 0 ? (
                        <Podium entries={podiumEntries} meLabel={meLabel} isSkeleton={isSkeleton} showAnatomy={showAnatomy} />
                    ) : null}
                    <SurfaceCardList
                        items={buildListItems(rows, selfRow, hiddenBetweenCount, meLabel, isSkeleton, showAnatomy)}
                        anatPart={showAnatomy ? "SurfaceCardList" : undefined}
                        showAnatomy={showAnatomy}
                    />
                </>
            }
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
    showAnatomy = false,
    anatPart,
}: LeaderboardBoardProps) => (
    <div data-anat-part={anatPart}>
        <AsyncContent
            isLoading={isLoading}
            skeleton={
                <Board
                    standing={LOADING_STANDING}
                    podiumEntries={LOADING_PODIUM}
                    rows={LOADING_ROWS}
                    meLabel=""
                    isSkeleton
                    showAnatomy={showAnatomy}
                />
            }
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
            showAnatomy={showAnatomy}
        >
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
                showAnatomy={showAnatomy}
            />
        </AsyncContent>
    </div>
)

export { LeaderboardBoard }
