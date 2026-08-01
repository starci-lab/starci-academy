import React from "react"
import { CheckCircleIcon, SparkleIcon, XCircleIcon } from "@phosphor-icons/react"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { EnumChip, type EnumChipEntry } from "@sb-components/composites/chips/EnumChip/EnumChip"
import { InlineIconLabel } from "@sb-components/composites/text/InlineIconLabel/InlineIconLabel"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `SubmissionScoreCard`: the #1 signal right after the attempt
 * selector on a graded-result page (a challenge, a mock interview) — how well
 * did THIS attempt do, and who said so.
 *
 * SIBLING OF `SubmissionResultHeader`, NOT A COPY. The header answers "where am
 * I, what was I graded on"; this card answers "how did it go" — the verdict
 * itself, one layer below.
 *
 * ⭐ PASS/FAIL TINTING + THRESHOLD WORDING IS OWNED HERE, mirroring the real
 * `SubmissionResult` component's `isPassing`/`scoreLabel` helpers: the hero
 * number and the verdict chip flip the SAME success/danger tone together (one
 * signal, not two disagreeing ones), and the "need N more points" sub-line does
 * the `passScore − score` subtraction itself rather than taking a pre-computed
 * string from the caller (§14d.1 — a block owns its own wording, never a
 * formatted string prop).
 *
 * ⭐ MODEL-CATEGORY VOCABULARY IS LOCAL, ON PURPOSE. `_legacy/designs/chips/
 * AiCategoryChip` already draws a tier badge, but it is out of reach from this
 * app folder (`_legacy` is read-only reference, never imported from `starci/`)
 * and it works over a 5-STEP HUE RAMP that `EnumChip` — the composite this tier
 * actually offers — cannot reproduce (`EnumChip` only carries the 5 SEMANTIC
 * tones: default/success/warning/danger/accent). Rather than smuggle a sixth
 * "tier" axis into `Chip`, this block maps the 5 categories onto the 5 semantic
 * tones it already has (free→default, economy→success, balanced→accent,
 * premium→warning, frontier→danger) and owns that table itself, the same way
 * `ContentModeNav` owns its own mode→label table. Revisit if a shared
 * tier-ramp primitive lands at this tier later.
 *
 * 📐 ONE LEAF (§14d.2), like `SubmissionResultHeader`. Nothing here changes the
 * SHAPE of what is composed — pass/fail only flips a TONE, and every optional
 * row (sub-line, feedback, submission link, model byline) is a presence/absence
 * of DATA, not a different arrangement of parts. So every difference below is a
 * STATE of the one `ScoreCard` leaf, not a leaf of its own.
 *
 * ⭐ THE MODEL BYLINE IS ONE ROW, GATED ON `gradedByModel`. Mirrors the ported
 * `ModelByline`'s own rule ("renders nothing when the served model wasn't
 * recorded"): with no model there is nothing to attribute, so the tier chip and
 * the relative time have nothing to sit next to either — the whole row drops,
 * not just the model name.
 *
 * `gradedByLabel` is an OPTIONAL override of the row's leading word (default
 * "Graded by", owned here). It exists for callers that need a different
 * attribution phrasing for the same shape — e.g. a re-grade — without handing
 * the block a whole pre-built sentence.
 * ─────────────────────────────────────────────────────────────────────────────
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
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
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

                    >
                        {`${gradedByLabel ?? "Graded by"} ${gradedByModel}`}
                    </InlineIconLabel>
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
