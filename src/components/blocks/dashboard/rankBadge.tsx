import React from "react"
import { Icon } from "@iconify/react"

/**
 * `fluent-emoji-flat` art id for a 1-based leaderboard rank. The first three
 * places get their place medal; every lower place gets the trophy art.
 */
const PLACE_MEDAL: Record<number, string> = {
    1: "fluent-emoji-flat:1st-place-medal",
    2: "fluent-emoji-flat:2nd-place-medal",
    3: "fluent-emoji-flat:3rd-place-medal",
}

/** Iconify id for the place medal or trophy matching a 1-based leaderboard rank. */
export const rankBadgeIconId = (rank: number): string =>
    PLACE_MEDAL[rank] ?? "fluent-emoji-flat:trophy"

/**
 * Rank-badge art for an identity tile icon slot. The tile owns the rendered
 * size, so this component supplies only the rank-selected multicolor artwork.
 */
export const rankBadgeIcon = (rank: number): React.ReactNode => (
    <Icon icon={rankBadgeIconId(rank)} aria-hidden />
)

/**
 * Compact place-medal art for a leaderboard row. Ranks one through three use
 * medal artwork; lower ranks return `null` so the caller can show plain text.
 */
export const placeMedalIcon = (rank: number): React.ReactNode | null => (
    rank <= 3
        ? <Icon icon={rankBadgeIconId(rank)} aria-hidden className="size-5" />
        : null
)
