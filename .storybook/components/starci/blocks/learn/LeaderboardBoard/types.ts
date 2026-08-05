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

/** Props for the internal {@link Board} content tree — reused for both the real render and the loading skeleton. */
export interface BoardProps {
    standing?: LeaderboardStanding
    podiumEntries: Array<LeaderboardPodiumEntry>
    rows: Array<LeaderboardRow>
    selfRow?: LeaderboardRow
    hiddenBetweenCount?: number
    meLabel: string
    isSkeleton: boolean
}
