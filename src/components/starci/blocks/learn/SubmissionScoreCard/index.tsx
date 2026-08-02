import React from "react"
import { CheckCircleIcon, SparkleIcon, XCircleIcon } from "@phosphor-icons/react"
import { Chip } from "@/components/atoms/chips/Chip"
import { Typography } from "@/components/atoms/text/Typography"
import { EnumChip, type EnumChipEntry } from "@/components/composites/chips/EnumChip"
import { InlineIconLabel } from "@/components/composites/text/InlineIconLabel"
import { SurfaceCard } from "@/components/composites/cards/SurfaceCard"
import { StackH, StackV } from "@/components/frames/Stack"

/**
 * `SubmissionScoreCard` — the headline signal after the attempt selector on a
 * graded-result page: a tinted pass/fail score hero, a verdict chip + "needs N more
 * points" sub-line, optional short feedback, an optional submission link, and an
 * optional model-byline row (who graded it, its tier, when). Sibling of
 * `SubmissionResultHeader` — the header answers "what was I graded on", this card
 * answers "how did it go". Pass/fail drives both the hero number's color and the
 * verdict chip's tone together. Every optional part and `isSkeleton` are states of
 * one shape.
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
            pattern="sibling-stack"
            align="center"
            at="sm"
            isSkeleton={isSkeleton}

            items={[
                () => (
                    <InlineIconLabel
                        icon={SparkleIcon}
                        tone="default"
                        size="xs"
                        isSkeleton={isSkeleton}
                        label={`${gradedByLabel ?? "Graded by"} ${gradedByModel}`}
                    />
                ),
                ...(modelCategory != null ? [() => (
                    <EnumChip
                        value={modelCategory}
                        map={MODEL_CATEGORY_MAP}
                        isSkeleton={isSkeleton}

                    />
                )] : []),
                ...(timeAgo != null ? [() => (
                    <Typography
                        size="xs"
                        color="muted"
                        isSkeleton={isSkeleton}
                        text={timeAgo}

                    />
                )] : []),
            ]}
        />
    ) : null

    const scoreSummary = (
        <>
            <StackH gap={4} pattern="value-row" align="baseline" at="sm" isSkeleton={isSkeleton} items={[() => scoreRow]} />

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

                body={() => <StackV gap={4} isSkeleton={isSkeleton} items={[() => scoreSummary]} />}
            />
        </div>
    )
}

export { SubmissionScoreCard }
