import React from "react"
import { ArrowClockwiseIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackH } from "@sb-components/frames/Stack/Stack"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `LeaderboardToolbar`: the strip that sits ABOVE the ranking, OUTSIDE
 * its async region — "ranked by X" on the left, a quiet last-updated fact next
 * to it, a plain refresh button on the right. It renders even while the board
 * itself is loading or has errored in `src`, which is exactly why it cannot be
 * folded into whatever composite/frame wraps the ranked list.
 *
 * WHY HAND-COMPOSED FROM ATOMS, NOT A COMPOSITE: the catalog was checked first
 * (this file's header is the second draft of a lesson learned the hard way —
 * see `ContentModeNav`'s header for the exact bug a reach-past-the-composite
 * rebuild caused). `Toolbar` (composites/navigation) draws two TAB GROUPS —
 * this strip has no tabs at all, just a label, a fact and one button, so it
 * would be wrong to wrap it. `SurfaceCard`'s toolbar slot and the various
 * header composites all assume a title they lay out themselves; none has a
 * "label · muted timestamp · secondary button" slot. `ContentHeader` and
 * `LeaderboardHeader` hand-compose atoms for their meta rows for the same
 * reason — this is that same move, not a new pattern.
 *
 * OWNS TWO PIECES OF WORDING (§14d.1):
 *   • the "Ranked by …" template — the caller hands over the bare category
 *     (e.g. "this week's XP"), never the finished sentence;
 *   • the relative-time phrasing built from `updatedAt` (a `Date`, not a
 *     pre-formatted string) — "Just updated" / "N minutes ago" / "N hours ago" /
 *     "N days ago". A caller that could pass a ready-made string would decide
 *     the grouping and two callers could drift on wording.
 *   `refreshLabel` is the ONE exception, same idiom as `ariaLabel` on
 *   `ContentModeNav`/`WorkSessionHeader`'s `backLabel`/`finishLabel`: blocks
 *   carry no i18n, so a short trigger word is handed in already localized —
 *   it is not a pre-formatted SENTENCE, just a word like "Refresh".
 *
 * ⚠️ RELATIVE TIME IS COMPUTED AT RENDER, NOT LIVE-TICKING. `formatUpdatedAt`
 * reads `Date.now()` once per render. A toolbar strip is not a stopwatch — it
 * is fine for "5 minutes ago" to become "6 minutes ago" only the next time this
 * block re-renders (e.g. after the next successful refresh), rather than
 * wiring an interval that would re-render the whole strip every minute for a
 * fact nobody is staring at. Judgement call, flagged rather than silent.
 *
 * ONE LEAF. Whether `updatedAt` is known yet and whether a refresh is in
 * flight are DATA conditions on the exact same three-slot row — none of them
 * add or remove a composed node — so they are STATES, not separate leaves.
 * `Button`'s own `isPending` skin (spinner replaces the glyph, press locks)
 * IS the pending-refresh idiom this block owns; it never draws its own spinner.
 * ─────────────────────────────────────────────────────────────────────────────
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
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
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
    showAnatomy = false,
    anatPart,
}: LeaderboardToolbarProps) => (
    <StackH
        gap={3}
        align="center"
        classNames={classNames}
        anatPart={anatPart ?? (showAnatomy ? "StackH" : undefined)}
        body={
            <>
                <Typography
                    size="sm"
                    weight="medium"
                    text={`Ranked by ${categoryLabel}`}
                    showAnatomy={showAnatomy}
                />
                {/* no icon here — §5a.2: a clock needs an ASSOCIATION step to read as "time"
                    (not a universal symbol like ✓/🔒), and the text already carries the fact. */}
                {updatedAt != null ? (
                    <Typography
                        size="xs"
                        color="muted"
                        text={formatUpdatedAt(updatedAt)}
                        showAnatomy={showAnatomy}
                    />
                ) : null}
                {/* Pushes the refresh button to the row's trailing edge without a second
                    nested track — same spacer idiom `WorkSessionHeader` already uses. */}
                <span aria-hidden className="flex-1" />
                <Button
                    label={refreshLabel}
                    variant="secondary"
                    size="sm"
                    prefixIcon={ArrowClockwiseIcon}
                    isPending={isRefreshing}
                    onPress={onRefresh}
                />
            </>
        }
    />
)

export { LeaderboardToolbar }
