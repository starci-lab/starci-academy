import React from "react"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { ProgressMeter } from "@sb-components/composites/stats/ProgressMeter/ProgressMeter"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"

/**
 * `ChallengeScoreCard` — "Your result": the aggregate earned/max score for a
 * finished challenge attempt, read against the pass line. The roll-up sibling of
 * `ChallengeDeliverableList`. The card face is `SurfaceCard` (labeled, its
 * `description` slot the pass-condition caption); the bar is `ProgressMeter` with
 * a `target` for the pass line. `earnedScore`/`maxScore`/`passThreshold` and
 * `isSkeleton` only change the numbers.
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
    // The fill ANSWERS the question this card exists to answer: a 52/70 attempt sitting
    // BELOW its own 80% pass line must not look like one sitting above it. `ProgressMeter`'s
    // own prop doc reserves the semantic tones for "when the bar's VALUE carries meaning",
    // which is precisely this case. The target tick stays NEUTRAL (see `TargetMark`) so the
    // two never compete for meaning.
    const meterColor = earnedScore >= targetScore ? "success" : "danger"

    // Score reading — earned score prominent, "/ max points" riding beside it as the unit
    // that gives it meaning (`tight`: a mark attached to the number, not a peer of it).
    // `weight="bold"`: the number STANDING ALONE as the card's focal point = Tier A, always
    // bold; without weight, HeroUI defaults to 600 (semibold), not the 700 (bold) canon
    // requires. Cross-check: `ChallengeHeader.tsx`, same role, also declares weight="bold".
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
            <StackH gap={2} principle="title-subtitle"
                explain="Title over supporting line — not label-field, because neither line is a form control label."
                align="baseline" isSkeleton={isSkeleton} items={[() => scoreReading]}  />
            <ProgressMeter
                value={earnedScore}
                max={safeMax}
                color={meterColor}
                target={targetScore}
                targetLabel={`${Math.round(passThreshold * 100)}%`}
                isSkeleton={isSkeleton}
            />
        </>
    )

    return (
        <SurfaceCard
            label="Your results"
            description="Passing needs every requirement completed, not just the total score."
            isSkeleton={isSkeleton}


            body={() => <StackV gap={4} isSkeleton={isSkeleton} items={[() => scoreBody]} />}
        />
    )
}

export { ChallengeScoreCard }
