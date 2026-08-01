import React from "react"
import { Skeleton as HeroSkeleton } from "@heroui/react"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { ProgressMeter } from "@sb-components/composites/stats/ProgressMeter/ProgressMeter"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `ChallengeScoreCard`: "Your results" — the ONE aggregate fact for a
 * finished challenge attempt, the earned/max score read against the pass line.
 *
 * SIBLING OF `ChallengeDeliverableList`, NOT PART OF IT (per the task brief).
 * The deliverable list owns ONE ROW PER REQUIREMENT; this card owns the ROLL-UP
 * across all of them. Folding the total into the list would make the list's last
 * row secretly mean something different from the rest (a sum, not a requirement),
 * which is exactly the "quietly different row" trap `card.md` warns about.
 *
 * COMPOSED, NOT REBUILT (see `ContentModeNav`'s file header for the incident this
 * rule exists to prevent): the card face + label is `SurfaceCard` (labeled
 * variant), the bar is `ProgressMeter` with its `target` prop for the pass line —
 * nothing here hand-rolls a card shell or a progress track.
 *
 * 📐 ONE LEAF (§14d.2). `earnedScore` / `maxScore` / `passThreshold` never change
 * the SHAPE of the tree — same score row, same meter, same caption — only the
 * numbers inside them. That makes every combination a STATE of one leaf
 * (`ChallengeScoreCard`), not a family of leaves; only `isSkeleton` is a second
 * axis, and even that stays a state (§11f) since the tree shape does not change,
 * only which atoms are shimmering.
 *
 * ⭐ THE CAPTION IS FIXED, NOT A PROP (§14d.1). "Passing needs every requirement,
 * not just the total" is true for every attempt this card will ever render, so it
 * is wired straight into `SurfaceCard`'s own `description` slot instead of being
 * threaded through as a string prop nobody would ever vary. That also means the
 * caption's shimmer is free: `SurfaceCard.isSkeleton` already owns `description`.
 *
 * ⚠️ `ProgressMeter` HAS NO `isSkeleton` OF ITS OWN YET (same gap `ContinueCard`
 * already documents). While `isSkeleton`, this block substitutes a bar-shaped
 * `HeroSkeleton` sized to the meter's own track height (`h-1`) instead of one —
 * SAME position in the tree, so nothing jumps when the real data lands.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link ChallengeScoreCard}. */
export interface ChallengeScoreCardProps {
    /** Points the learner earned across every requirement. */
    earnedScore: number
    /** Points available in total — the denominator of the score row and the meter. */
    maxScore: number
    /**
     * Fraction of `maxScore` required to pass, in the `0..1` range (e.g. `0.8` for
     * "80%"). Rendered as the `ProgressMeter` target tick, never as a separate number.
     */
    passThreshold: number
    /** `true` → the score row and the meter switch to shimmer (card label + caption follow via `SurfaceCard`). */
    isSkeleton?: boolean
}

/**
 * The learner's aggregate result for a finished challenge attempt: earned/max
 * score, a meter reading against the pass line, and the fixed reminder that
 * passing takes every requirement. See the file header for why this stays one
 * leaf and why the caption is not a prop.
 *
 * @param props - {@link ChallengeScoreCardProps}
 */
const ChallengeScoreCard = ({
    earnedScore,
    maxScore,
    passThreshold,
    isSkeleton = false,
}: ChallengeScoreCardProps) => {
    // Guards a `max={0}` attempt (an ungraded/empty challenge) from a divide-by-zero
    // meter — same defensive floor `ProgressMeter` itself applies internally.
    const safeMax = maxScore > 0 ? maxScore : 1
    const targetScore = passThreshold * safeMax
    // AUDIT 2026-07-30 (feedback ChallengePage/Graded round-14, instructor: "the colors
    // don't really make sense"): the fill now ANSWERS the question this card exists to answer. It used to
    // ride `ProgressMeter`'s default `accent` — the brand tone — so a 52/70 attempt sitting
    // BELOW its own 80% pass line looked exactly like one sitting above it: the bar carried
    // a ratio but no verdict. `ProgressMeter`'s own prop doc already reserves the semantic
    // tones for "when the bar's VALUE carries meaning", which is precisely this case.
    // The target tick stays NEUTRAL (see `TargetMark`) so the two never compete for meaning.
    const meterColor = earnedScore >= targetScore ? "success" : "danger"

    // Score reading — earned score prominent, "/ max points" riding beside it as the unit
    // that gives it meaning (`tight`: a mark attached to the number, not a peer of it).
    // AUDIT 2026-07-30 (feedback ChallengePage/Graded, round-1): added `weight="bold"` —
    // the number STANDING ALONE as the card's focal point = Tier A, always bold; without
    // weight, HeroUI defaults to 600 (semibold), not the 700 (bold) canon requires. Cross-check:
    // `ChallengeHeader.tsx`, same role, already declares weight="bold" correctly.
    const scoreReading = (
        <>
            <Typography
                size="h3"
                weight="bold"
                tabularNums
                isSkeleton={isSkeleton}
                text={earnedScore}

            />
            <Typography
                size="sm"
                color="muted"
                tabularNums
                isSkeleton={isSkeleton}
                text={`/ ${maxScore} points`}

            />
        </>
    )

    const scoreBody = (
        <>
            <StackH gap={2} align="baseline" body={scoreReading} />
            {isSkeleton ? (
                <HeroSkeleton
                    className="h-1 w-full rounded-full"

                />
            ) : (
                <ProgressMeter
                    value={earnedScore}
                    max={safeMax}
                    color={meterColor}
                    target={targetScore}
                    targetLabel={`${Math.round(passThreshold * 100)}%`}

                />
            )}
        </>
    )

    return (
        <SurfaceCard
            label="Your results"
            description="Passing needs every requirement completed, not just the total score."
            isSkeleton={isSkeleton}


            body={() => <StackV gap={4} body={scoreBody} />}
        />
    )
}

export { ChallengeScoreCard }
