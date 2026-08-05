import React from "react"
import { ArrowClockwiseIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackH } from "@sb-components/frames/Stack/Stack"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * `LeaderboardToolbar` — the strip above the ranking: "ranked by X" on the left, a
 * quiet last-updated fact beside it, a plain refresh button on the right. It sits
 * outside the board's async region, hence its own block. Hand-composed from atoms —
 * no composite draws this "label · muted timestamp · secondary button" shape. Owns
 * the "Ranked by …" template and the relative-time phrasing built from a plain
 * `updatedAt: Date`. Whether the timestamp has landed and whether a refresh is in
 * flight are states on the same three-slot row.
 */

/** Props for {@link LeaderboardToolbar}. */
export interface LeaderboardToolbarProps {
    /** What the ranking is sorted by, e.g. "this week's XP". The block builds the sentence around it. */
    categoryLabel: string
    /** When the board last refreshed. Omitted → nothing has loaded yet, so no timestamp is claimed. */
    updatedAt?: Date
    /** Fired when the reader asks for a fresh ranking. */
    onRefresh: () => void
    /** `true` → a refresh is in flight; the button carries its own busy skin and locks the press. */
    isRefreshing?: boolean
    /** Localized trigger word for the refresh button, e.g. "Refresh" (blocks carry no i18n). */
    refreshLabel: string
    /** Extra classes on the row, from the closed atom/frame union. */
    classNames?: Array<AllowedClassName>
}

/**
 * Vietnamese relative-time wording — this block's own vocabulary, built from a
 * plain `Date` so the caller never hands over a pre-formatted string.
 */
const formatUpdatedAt = (updatedAt: Date): string => {
    const diffMinutes = Math.floor((Date.now() - updatedAt.getTime()) / 60_000)
    if (diffMinutes < 1) return "Just updated"
    if (diffMinutes < 60) return `Updated ${diffMinutes} minutes ago`
    const diffHours = Math.floor(diffMinutes / 60)
    if (diffHours < 24) return `Updated ${diffHours} hours ago`
    const diffDays = Math.floor(diffHours / 24)
    return `Updated ${diffDays} days ago`
}

/**
 * The leaderboard's chrome strip. See the file header for why it is
 * hand-composed and why it stays one leaf.
 *
 * @param props - {@link LeaderboardToolbarProps}
 */
const LeaderboardToolbar = ({
    categoryLabel,
    updatedAt,
    onRefresh,
    isRefreshing = false,
    refreshLabel,
    classNames,
}: LeaderboardToolbarProps) => (
    <StackH
        gap={3}
        principle="flex-action"
        align="center"
        classNames={classNames}

        items={[
            () => (
                <Typography
                    size="sm"
                    weight="medium"
                    text={`Ranked by ${categoryLabel}`}

                />
            ),
            // no icon here — §5a.2: a clock needs an ASSOCIATION step to read as "time"
            // (not a universal symbol like check/locklock), and the text already carries the fact.
            ...(updatedAt != null ? [() => (
                <Typography
                    size="xs"
                    color="muted"
                    text={formatUpdatedAt(updatedAt)}

                />
            )] : []),
            // Pushes the refresh button to the row's trailing edge without a second
            // nested track — same spacer idiom `WorkSessionHeader` already uses.
            () => <span aria-hidden className="flex-1" />,
            () => (
                <Button
                    label={refreshLabel}
                    variant="secondary"
                    size="sm"
                    prefixIcon={ArrowClockwiseIcon}
                    isPending={isRefreshing}
                    onPress={onRefresh}
                />
            ),
        ]}
    />
)

export { LeaderboardToolbar }
