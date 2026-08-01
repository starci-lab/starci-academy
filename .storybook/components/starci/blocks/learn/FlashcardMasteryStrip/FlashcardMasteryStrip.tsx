import React from "react"
import { FlameIcon } from "@phosphor-icons/react"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { SegmentBar, type SegmentBarSegment } from "@sb-components/composites/stats/SegmentBar/SegmentBar"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `FlashcardMasteryStrip`: mastery-first progress readout for a deck —
 * "how much of this do I actually own", not "how many cards are left today".
 * Maps to the real `FlashcardStatsStrip`.
 *
 * WHY A BLOCK ON TOP OF `SurfaceCard` + `SegmentBar`: neither composite knows
 * what "mastered" means for a deck, that a streak is a study-habit signal worth
 * its own chip, or that a retention number only means something once the
 * learner has actually reviewed enough cards. That vocabulary — the 5-review
 * floor, the wording for zero reviews, which segment is which colour — is what
 * this block owns (§14d.1); the two composites just draw a labelled card face
 * and a proportion bar.
 *
 * ⭐ REUSED `SegmentBar`'S OWN `caption` SLOT instead of hand-building a second
 * muted text row underneath it. This is the exact trap the catalog header for
 * this run points at (`ContentModeNav`'s file header, re: `ContentTabBar`): the
 * composite already carries a caption slot built for "a quiet takeaway sentence
 * under the bar", which is precisely what the retention/first-review line is —
 * duplicating it as a sibling `Typography` would be a second implementation of
 * the same idea sitting one prop away from the one that already exists.
 *
 * ⭐ JUDGMENT CALL — `SegmentBar` HAS NO `isSkeleton` OF ITS OWN (checked: grepped
 * the composite, confirmed). This block cannot add one — sibling agents are
 * editing other blocks against the same composite catalog in this run, so only
 * `FlashcardMasteryStrip.tsx` is in scope here. Rather than fork a parallel
 * "fake bar" tree (which would violate skeleton-flows-into-real-atoms, §12c, in
 * spirit even if there's no atom to flow into), the SAME `SegmentBar` node stays
 * mounted through the loading state: it is fed one flat, uncoloured segment and
 * told to hide its legend/caption, so the DOM shape never changes and only the
 * two `Typography` numbers above it — which DO own `isSkeleton` — actually
 * shimmer. No fabricated mastered/learning/new split is ever shown as if real.
 *
 * 📐 LEAF BY STRUCTURE (§14d.2). Streak present/absent is the `action` slot on
 * `SurfaceCard` appearing or disappearing — same shape of call as `ContentHeader`
 * `isRead` chip. Retention caption vs. the first-review hint is a second
 * structural branch: below 1 lifetime review nothing has been measured yet, so
 * the block swaps the WHOLE caption for a nudge instead of printing a retention
 * number computed from zero data. Between 1 and 4 reviews (not enough signal
 * yet, but not zero either) the caption is simply omitted — no leaf claims a
 * fake number belongs there either.
 * ─────────────────────────────────────────────────────────────────────────────
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

                body={
                    <>
                        <Typography
                            size="h3"
                            weight="bold"
                            isSkeleton={isSkeleton}
                            text={`${mastered}/${total}`}

                        />
                        <Typography
                            size="sm"
                            color="muted"
                            isSkeleton={isSkeleton}
                            text={`${pct}%`}

                        />
                    </>
                }
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


                body={() => <StackV gap={4} body={masteryReadout} />}
            />
        </div>
    )
}

export { FlashcardMasteryStrip }
