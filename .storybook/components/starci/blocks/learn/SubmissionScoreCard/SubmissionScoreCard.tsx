import React from "react"
import { CheckCircleIcon, SparkleIcon, XCircleIcon } from "@phosphor-icons/react"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { EnumChip, type EnumChipEntry } from "@sb-components/composites/chips/EnumChip/EnumChip"
import { InlineIconLabel } from "@sb-components/composites/text/InlineIconLabel/InlineIconLabel"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `SubmissionScoreCard` — the top signal after the attempt selector on a
 * graded-result page (challenge, mock interview): how well this attempt did and
 * who said so. Owns pass/fail tinting (hero number and verdict chip flip the
 * same success/danger tone) and the "need N more points" sub-line (computes
 * `passScore - score` itself). Maps the 5 model categories onto the 5 semantic
 * chip tones locally (free->default, economy->success, balanced->accent,
 * premium->warning, frontier->danger). One leaf; every optional row is a
 * presence/absence of data. The model byline gates on `gradedByModel`;
 * `gradedByLabel` is an optional override of the leading word (default "Graded
 * by").
 */

/** Cost/quality tier of the model that produced the grade. */
export type AiModelCategory = "free" | "economy" | "balanced" | "premium" | "frontier"

/** Category → `EnumChip` presentation. See the file header for why the ramp folds onto 5 semantic tones. */
export const MODEL_CATEGORY_MAP: Record<AiModelCategory, EnumChipEntry> = {
    free: { color: "default", label: "Free" },
    economy: { color: "success", label: "Economy" },
    balanced: { color: "accent", label: "Balanced" },
    premium: { color: "warning", label: "Premium" },
    frontier: { color: "danger", label: "Frontier" },
}

/** Props for {@link SubmissionScoreCard}. */
export interface SubmissionScoreCardProps {
    /** Points earned on this attempt. */
    score: number
    /** Points the attempt was scored out of. Omit when the scale isn't fixed (e.g. a raw points total). */
    maxScore?: number
    /** Whether this score cleared the pass bar — drives the tinting on the hero number and the verdict chip. */
    isPassing: boolean
    /** The pass bar itself, in points. Only used to compute the "need N more points" sub-line while failing. */
    passScore?: number
    /** A short line of grader feedback, plain text. */
    shortFeedback?: string
    /** Link to the full submission. Omit to hide the link entirely. */
    submissionUrl?: string
    /** Link text for {@link submissionUrl}. Defaults to "View submission". */
    submissionLabel?: string
    /** The model that produced this grade. Omit when no model was recorded — the whole byline row then drops. */
    gradedByModel?: string
    /** Cost/quality tier of {@link gradedByModel}, shown as a trailing chip. */
    modelCategory?: AiModelCategory
    /** Overrides the byline's leading word. Defaults to "Graded by". */
    gradedByLabel?: string
    /** Relative time since grading, already localized (e.g. "5 minutes ago"). */
    timeAgo?: string
    /** Section label above the card, e.g. "Grading result". */
    label: string
    /** `true` → every part this block renders itself mirrors as shimmer. */
    isSkeleton?: boolean
}

/**
 * The score signal card. See the file header for the tinting/wording/byline
 * rules this block owns.
 *
 * @param props - {@link SubmissionScoreCardProps}
 */
const SubmissionScoreCard = ({
    score,
    maxScore,
    isPassing,
    passScore,
    shortFeedback,
    submissionUrl,
    submissionLabel,
    gradedByModel,
    modelCategory,
    gradedByLabel,
    timeAgo,
    label,
    isSkeleton = false,
}: SubmissionScoreCardProps) => {
    // One tone drives BOTH the hero number and the verdict chip — a passing and a
    // failing score must never read as two independent signals.
    const verdictTone: "success" | "danger" = isPassing ? "success" : "danger"
    // Only meaningful while failing: a passing attempt has already cleared the bar,
    // so there is nothing left to need.
    const pointsNeeded = !isPassing && passScore != null ? Math.max(passScore - score, 0) : null

    const scoreRow = (
        <>
            <Typography
                size="h2"
                weight="bold"
                tabularNums
                color={verdictTone}
                isSkeleton={isSkeleton}
                text={String(score)}

            />
            {maxScore != null ? (
                <Typography
                    size="sm"
                    color="muted"
                    tabularNums
                    isSkeleton={isSkeleton}
                    text={`/ ${maxScore}`}

                />
            ) : null}
            <Chip
                tone={verdictTone}
                icon={isPassing ? CheckCircleIcon : XCircleIcon}
                text={isPassing ? "Passed" : "Not yet passed"}
                isSkeleton={isSkeleton}

            />
        </>
    )

    const modelByline = gradedByModel != null ? (
        <StackH
            gap={3}
            align="center"
            wrap

            body={
                <>
                    <InlineIconLabel
                        icon={SparkleIcon}
                        tone="default"
                        size="xs"
                        isSkeleton={isSkeleton}
                        label={`${gradedByLabel ?? "Graded by"} ${gradedByModel}`}
                    />
                    {modelCategory != null ? (
                        <EnumChip
                            value={modelCategory}
                            map={MODEL_CATEGORY_MAP}
                            isSkeleton={isSkeleton}

                        />
                    ) : null}
                    {timeAgo != null ? (
                        <Typography
                            size="xs"
                            color="muted"
                            isSkeleton={isSkeleton}
                            text={timeAgo}

                        />
                    ) : null}
                </>
            }
        />
    ) : null

    const scoreSummary = (
        <>
            <StackH gap={4} align="baseline" wrap body={scoreRow} />

            {pointsNeeded != null && pointsNeeded > 0 ? (
                <Typography
                    size="xs"
                    color="muted"
                    isSkeleton={isSkeleton}
                    text={`Need ${pointsNeeded} more points to reach the ${passScore}-point pass mark`}

                />
            ) : null}

            {shortFeedback != null ? (
                <Typography
                    size="sm"
                    isSkeleton={isSkeleton}
                    text={shortFeedback}

                />
            ) : null}

            {submissionUrl != null ? (
                <Typography
                    size="sm"
                    isLink
                    href={submissionUrl}
                    isSkeleton={isSkeleton}
                    text={submissionLabel ?? "View submission"}

                />
            ) : null}

            {modelByline}
        </>
    )

    return (
        <div>
            <SurfaceCard
                label={label}
                isSkeleton={isSkeleton}

                body={() => <StackV gap={4} body={scoreSummary} />}
            />
        </div>
    )
}

export { SubmissionScoreCard }
