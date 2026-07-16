import React from "react"
import { Icon } from "@iconify/react"

/**
 * `fluent-emoji-flat` art id for a 1-based leaderboard rank: the podium places
 * (1–3) get their place medal, everyone below gets the trophy/cup. Same art lib
 * as {@link import("@/components/features/dashboard/LeagueTierBadge").LeagueTierBadge}.
 */
const PLACE_MEDAL: Record<number, string> = {
    1: "fluent-emoji-flat:1st-place-medal",
    2: "fluent-emoji-flat:2nd-place-medal",
    3: "fluent-emoji-flat:3rd-place-medal",
}

export const rankBadgeIconId = (rank: number): string =>
    PLACE_MEDAL[rank] ?? "fluent-emoji-flat:trophy"

/**
 * The rank-badge art node for an {@link import("@/components/blocks/identity/IconTile").IconTile}
 * `icon` slot — a place medal (rank 1–3) or the trophy (rank 4+). The tile owns
 * the size (`[&_svg]:size-6`), so the art is passed bare (no width/height); its
 * multicolor fills ignore the tile's `neutral` tone. Rank-driven (NOT tier-driven)
 * so a rank-5 viewer never shows a bronze medal.
 */
export const rankBadgeIcon = (rank: number): React.ReactNode => (
    <Icon icon={rankBadgeIconId(rank)} aria-hidden />
)
