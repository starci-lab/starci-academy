import React from "react"
import { FlameIcon } from "@phosphor-icons/react"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { SegmentBar, type SegmentBarSegment } from "@sb-components/composites/stats/SegmentBar/SegmentBar"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `FlashcardMasteryStrip` — a mastery-first progress readout for a deck ("how much do
 * I own", not "how many are left today"). Composes `SurfaceCard` + `SegmentBar`, using
 * the bar's own `caption` slot for the retention / first-review line.
 *
 * Owns the 5-review retention floor and the wording for low-review states: below 1
 * review a nudge replaces the caption, between 1–4 the caption is omitted. Streak
 * rides in `SurfaceCard`'s `action` slot. `SegmentBar` has no skeleton of its own, so
 * it stays mounted flat/uncoloured while the two `Typography` numbers above it shimmer.
 */

/** Props for {@link FlashcardMasteryStrip}. */
export interface FlashcardMasteryStripProps {
    /** Cards the learner has fully mastered. */
    mastered: number
    /** Total cards in the deck. */
    total: number
    /** Cards still being learned (seen, not yet mastered). */
    learning: number
    /** Cards never reviewed. */
    newCount: number
    /** Current daily-study streak, in days. Omit → no streak chip (nothing to show yet). */
    streak?: number
    /** 30-day retention rate, 0–100. Only shown once {@link FlashcardMasteryStripProps.totalReviewed} clears the 5-review floor. */
    retention?: number
    /** Lifetime review count across the deck — the signal that decides which caption (if any) is honest to show. */
    totalReviewed: number
    /** `true` → the numbers shimmer and the bar goes inert while the deck's stats load. */
    isSkeleton?: boolean
}

/**
 * `SegmentBar` has no `isSkeleton`, so the loading state feeds it this one
 * inert, uncoloured segment (paired with `hideLegend`) instead of the real
 * mastered/learning/new split — see the file header's judgment call.
 */
const SKELETON_SEGMENTS: Array<SegmentBarSegment> = [
    { key: "loading", label: "", value: 1, color: "var(--default)" },
]

/**
 * Below the 5-review floor there is no honest retention number to show yet.
 * With zero reviews the caption becomes a nudge instead of a stat; between 1
 * and 4 it says nothing at all rather than print a number computed from too
 * little data.
 */
const masteryCaption = (totalReviewed: number, retention: number | undefined): string | undefined => {
    if (totalReviewed === 0) {
        return "Review your first card to start measuring retention."
    }
    if (totalReviewed >= 5 && retention != null) {
        return `${retention}% recall across ${totalReviewed} reviews.`
    }
    return undefined
}

/**
 * The deck's mastery readout. See the file header for the full contract.
 *
 * @param props - {@link FlashcardMasteryStripProps}
 */
const FlashcardMasteryStrip = ({
    mastered,
    total,
    learning,
    newCount,
    streak,
    retention,
    totalReviewed,
    isSkeleton = false,
}: FlashcardMasteryStripProps) => {
    const pct = total > 0 ? Math.round((mastered / total) * 100) : 0
    const hasStreak = streak != null

    const segments: Array<SegmentBarSegment> = [
        { key: "mastered", label: "Mastered", value: mastered, color: "var(--success)" },
        { key: "learning", label: "Learning", value: learning, color: "var(--warning)" },
        { key: "new", label: "New", value: newCount, color: "var(--muted)" },
    ]

    const ariaLabel = isSkeleton
        ? "Loading retention progress"
        : `Retention progress: ${mastered} mastered, ${learning} learning, ${newCount} new, out of ${total} cards`

    const masteryReadout = (
        <>
            <StackH
                gap={2}
                align="baseline"
                isSkeleton={isSkeleton}
                items={[
                    () => (
                        <Typography
                            size="h3"
                            weight="bold"
                            isSkeleton={isSkeleton}
                            text={`${mastered}/${total}`}

                        />
                    ),
                    () => (
                        <Typography
                            size="sm"
                            color="muted"
                            isSkeleton={isSkeleton}
                            text={`${pct}%`}

                        />
                    ),
                ]}
            />
            <SegmentBar
                segments={isSkeleton ? SKELETON_SEGMENTS : segments}
                max={isSkeleton ? undefined : total}
                hideLegend={isSkeleton}
                ariaLabel={ariaLabel}
                caption={isSkeleton ? undefined : masteryCaption(totalReviewed, retention)}

            />
        </>
    )

    return (
        <div>
            <SurfaceCard
                label="Mastered"
                action={() =>
                    isSkeleton ? (
                        <Chip isSkeleton />
                    ) : hasStreak ? (
                        <Chip
                            tone="warning"
                            icon={FlameIcon}
                            text={`${streak}-day streak`}

                        />
                    ) : undefined
                }
                isSkeleton={isSkeleton}


                body={() => <StackV gap={4} isSkeleton={isSkeleton} items={[() => masteryReadout]} />}
            />
        </div>
    )
}

export { FlashcardMasteryStrip }
