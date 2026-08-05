import React from "react"
import { type SkeletonProps } from "@/components/composites/_slot"
import { Skeleton as HeroSkeleton } from "@heroui/react"
import { ArrowRightIcon, CheckCircleIcon, WarningCircleIcon, XCircleIcon } from "@phosphor-icons/react"
import { Chip } from "@/components/atoms/chips/Chip"
import { Typography } from "@/components/atoms/text/Typography"
import { Button } from "@/components/atoms/buttons/Button"
import { SurfaceCard, SurfaceCardCrossList, type SurfaceCardCrossListItem } from "@/components/composites/cards/SurfaceCard"
import { Callout, type CalloutIcon } from "@/components/composites/feedback/Callout"
import { ProgressMeter } from "@/components/composites/stats/ProgressMeter"
import { MarkdownContent } from "@/components/composites/viewers/MarkdownContent"
import { StackH, StackV } from "@/components/frames/Stack"

/**
 * `MockInterviewScorecard` — read-only render of one graded mock-interview run:
 * a verdict banner (`Callout`), hand-laid `ProgressMeter` rows for the score and
 * attribute breakdowns, and strengths/gaps via `SurfaceCard.CrossList`. Every
 * optional section — byline, attribute breakdown, strengths, gaps, follow-up,
 * weak-area tag, retry — is a state of one shape. Per-question model-answer review
 * is out of scope (no primitive for it yet).
 */

/** Pass / borderline / fail — reuses the interview verdict vocabulary verbatim from the BE contract. */
export type MockInterviewVerdict = "pass" | "borderline" | "fail"

/** One row of the score breakdown — a phase (design mode) or a question ordinal (Q&A mode), already display-labeled by the caller. */
export interface MockInterviewScoreRow {
    /** Stable React key. */
    key: string
    /** Display label — a resolved phase name or a question ordinal ("Question 1"), already localized/resolved by the caller. */
    label: string
    /** Points earned for this phase/question. */
    score: number
    /** Points available for this phase/question. */
    max: number
}

/** One row of the attribute breakdown (communication, structured thinking …), 0–100. */
export interface MockInterviewAttributeScoreRow {
    /** Stable React key. */
    key: string
    /** Display label, already localized/resolved by the caller. */
    label: string
    /** 0–100. */
    score: number
}

/** Props for {@link MockInterviewScorecard}. */
export interface MockInterviewScorecardProps {
    /** Pass / borderline / fail — drives the verdict callout's tone, icon and wording. */
    verdict: MockInterviewVerdict
    /** Overall score, 0–100. */
    overallScore: number
    /** Per-phase or per-question score breakdown, in display order. Section self-hides when empty (and `isSkeleton` is off). */
    phaseOrQuestionScores: Array<MockInterviewScoreRow>
    /** Per-attribute score breakdown, in display order. Section self-hides when empty. */
    attributeScores: Array<MockInterviewAttributeScoreRow>
    /** Concrete things done right, as markdown. Section self-hides when empty. */
    strengths: Array<string>
    /** Concrete gaps framed as "what to add", as markdown. Section self-hides when empty. */
    gaps: Array<string>
    /** A follow-up an interviewer would ask next, as markdown. Omit → the section does not render. */
    followUpQuestion?: string | null
    /** The weakest area, already resolved by the caller (which phase/attribute counts as "weak enough to push" is a screen-level call, not this block's). Omit → the primary CTA reads generically. */
    weakAreaLabel?: string
    /** Fired when the learner takes the primary CTA — go study the weak area. */
    onStudyWeakArea: () => void
    /** Fired when the learner picks the capstone hand-off CTA. */
    onCapstone: () => void
    /** Fired when the learner wants to run the interview again. Omit → the retry action does not render (e.g. a read-only history detail). */
    onRetry?: () => void
    /** The system/prompt this run interviewed on, shown as a header line when known. */
    promptTitle?: string
    /** When this attempt was graded, already formatted/localized by the caller (e.g. "Jul 28, 2026 · 14:32"). Omit for a live, just-finished session. */
    createdAt?: string
    /** `true` → every part this block renders itself mirrors as shimmer. */
    isSkeleton?: boolean
}

/** Verdict → callout tone. */
const VERDICT_STATUS: Record<MockInterviewVerdict, "success" | "warning" | "danger"> = {
    pass: "success",
    borderline: "warning",
    fail: "danger",
}

/** Verdict → callout indicator icon. */
const VERDICT_ICON: Record<MockInterviewVerdict, CalloutIcon> = {
    pass: CheckCircleIcon,
    borderline: WarningCircleIcon,
    fail: XCircleIcon,
}

/** Verdict → the block's own wording (§14d.1 — a caller passes the enum, never a formatted string). */
const VERDICT_LABEL: Record<MockInterviewVerdict, string> = {
    pass: "Pass",
    borderline: "Borderline",
    fail: "Fail",
}

/**
 * Score bar/text color BY VALUE, not a fixed tone — a low score must read as
 * low. Ported unchanged from the source `scoreColorOf`.
 */
const scoreColorOf = (score: number, max: number): "success" | "warning" | "danger" => {
    const ratio = max > 0 ? score / max : 0
    return ratio < 0.5 ? "danger" : ratio < 0.75 ? "warning" : "success"
}

/** Placeholder row count while `isSkeleton` and the real breakdown length isn't known yet. */
const SKELETON_SCORE_ROWS = 3
const SKELETON_ATTRIBUTE_ROWS = 3

/** One labeled score row: a truncating label, a value-colored bar, and the raw "earned/max" beside it. */
const ScoreRow = ({
    label,
    score,
    max,
}: {
    label: string
    score: number
    max: number
}) => (
    <StackH
        gap={4}
        align="center"
        principles={["content-row"]}
        items={[
            () => <Typography size="sm" truncate classNames={["shrink-0"]} text={label} />,
            () => <ProgressMeter value={score} max={max} color={scoreColorOf(score, max)} classNames={["flex-1"]} />,
            () => <Typography size="xs" color="muted" tabularNums classNames={["shrink-0"]} text={`${score}/${max}`} />,
        ]}
    />
)

/** Same shape as {@link ScoreRow}, shimmering — `ProgressMeter` has no `isSkeleton` of its own (see file header). */
const ScoreRowSkeleton = () => (
    <StackH
        gap={4}
        align="center"
        principles={["content-row"]}
        items={[
            () => <Typography size="sm" isSkeleton classNames={["shrink-0", "w-1/4"]} />,
            () => <HeroSkeleton className="h-1 flex-1 rounded-full" />,
            () => <Typography size="xs" isSkeleton classNames={["shrink-0", "w-1/4"]} />,
        ]}
    />
)

/**
 * The graded-run scorecard. See the file header for the full contract, the
 * scope cut (no per-question review this pass), and why every optional
 * section stays a STATE of this one leaf.
 *
 * @param props - {@link MockInterviewScorecardProps}
 */
const MockInterviewScorecard = ({
    verdict,
    overallScore,
    phaseOrQuestionScores,
    attributeScores,
    strengths,
    gaps,
    followUpQuestion,
    weakAreaLabel,
    onStudyWeakArea,
    onCapstone,
    onRetry,
    promptTitle,
    createdAt,
    isSkeleton = false,
}: MockInterviewScorecardProps) => {
    const hasByline = isSkeleton || promptTitle != null || createdAt != null
    const hasScoreRows = isSkeleton || phaseOrQuestionScores.length > 0
    const hasAttributeRows = isSkeleton || attributeScores.length > 0
    const hasStrengths = isSkeleton || strengths.length > 0
    const hasGaps = isSkeleton || gaps.length > 0
    const hasFollowUp = isSkeleton || Boolean(followUpQuestion)

    const strengthItems: Array<SurfaceCardCrossListItem> = strengths.map((strength, index) => ({
        key: `strength-${index}`,
        mark: "check",
        tone: "success",
        text: strength,
    }))

    const gapItems: Array<SurfaceCardCrossListItem> = gaps.map((gap, index) => ({
        key: `gap-${index}`,
        mark: "cross",
        tone: "danger",
        text: gap,
    }))

    const primaryCtaLabel = weakAreaLabel ? `Review: ${weakAreaLabel}` : "Review your weak areas"

    const bylineRow = hasByline ? (
        <StackH
            gap={4}
            justify="between"
            at="sm"
            principles={["content-row"]}
            isSkeleton={isSkeleton}
            items={[
                () => (isSkeleton ? (
                    <Typography size="sm" weight="medium" isSkeleton classNames={["w-1/2"]} />
                ) : promptTitle != null ? (
                    <Typography size="sm" weight="medium" text={promptTitle} />
                ) : null),
                () => (isSkeleton ? (
                    <Typography size="xs" color="muted" isSkeleton classNames={["w-1/3"]} />
                ) : createdAt != null ? (
                    <Typography size="xs" color="muted" text={createdAt} />
                ) : null),
            ]}
        />
    ) : null

    const scoreBreakdownBody = (
        <>
            {isSkeleton
                ? Array.from({ length: SKELETON_SCORE_ROWS }, (_, index) => (
                    <ScoreRowSkeleton key={`score-skeleton-${index}`} />
                ))
                : phaseOrQuestionScores.map((row) => (
                    <ScoreRow key={row.key} label={row.label} score={row.score} max={row.max} />
                ))}
        </>
    )

    const attributeBreakdownBody = (
        <>
            {isSkeleton
                ? Array.from({ length: SKELETON_ATTRIBUTE_ROWS }, (_, index) => (
                    <ScoreRowSkeleton key={`attribute-skeleton-${index}`} />
                ))
                : attributeScores.map((row) => (
                    <ScoreRow key={row.key} label={row.label} score={row.score} max={100} />
                ))}
        </>
    )

    const strengthsBody = (
        <>
            <Typography size="sm" weight="medium" text="Strengths" />
            <SurfaceCardCrossList items={strengthItems} isSkeleton={isSkeleton} />
        </>
    )

    const gapsBody = (
        <>
            <Typography size="sm" weight="medium" text="Areas to improve" />
            <SurfaceCardCrossList items={gapItems} isSkeleton={isSkeleton} />
        </>
    )

    const weakAreaRow = weakAreaLabel != null && !isSkeleton ? (
        <StackH
            gap={2}
            align="center"
            principles={["icon-text"]}
            isSkeleton={isSkeleton}
            items={[
                ({ isSkeleton }: SkeletonProps) => <Typography size="xs" color="muted" text="Weakest:" isSkeleton={isSkeleton} />,
                ({ isSkeleton }: SkeletonProps) => <Chip tone="warning" text={weakAreaLabel} isSkeleton={isSkeleton} />,
            ]}
        />
    ) : null

    const ctaButtonRow = (
        <StackH
            gap={4}
            at="sm"
            principles={["flex-action"]}
            isSkeleton={isSkeleton}
            items={[
                () => (
                    <Button
                        isSkeleton={isSkeleton}
                        variant="primary"
                        size="lg"
                        label={primaryCtaLabel}
                        suffixIcon={ArrowRightIcon}
                        iconSlide
                        onPress={onStudyWeakArea}

                    />
                ),
                () => (
                    <Button
                        isSkeleton={isSkeleton}
                        variant="secondary"
                        size="lg"
                        label="Work on personal project"
                        onPress={onCapstone}

                    />
                ),
                ...(onRetry != null || isSkeleton ? [() => (
                    <Button
                        isSkeleton={isSkeleton}
                        variant="ghost"
                        size="lg"
                        label="Retry interview"
                        onPress={onRetry}

                    />
                )] : []),
            ]}
        />
    )

    const ctaSection = (
        <>
            {weakAreaRow}
            {ctaButtonRow}
        </>
    )

    const scorecardBody = (
        <>
            {bylineRow}

            {/* Verdict banner. `Callout` has no `isSkeleton` of its own (a message
                frame, not a data-bearing one) — a bare bar stands in, in the same slot. */}
            {isSkeleton ? (
                <HeroSkeleton className="h-20 w-full rounded-2xl" />
            ) : (
                <Callout
                    status={VERDICT_STATUS[verdict]}
                    icon={VERDICT_ICON[verdict]}
                    title={`${overallScore}/100 · ${VERDICT_LABEL[verdict]}`}

                />
            )}

            {hasScoreRows ? (
                <SurfaceCard
                    label="Score by section"


                    body={() => <StackV gap={4} isSkeleton={isSkeleton} items={[() => scoreBreakdownBody]} />}
                />
            ) : null}

            {hasAttributeRows ? (
                <SurfaceCard
                    label="Score by criterion"


                    body={() => <StackV gap={4} isSkeleton={isSkeleton} items={[() => attributeBreakdownBody]} />}
                />
            ) : null}

            {hasStrengths ? (
                <StackV gap={3} isSkeleton={isSkeleton} items={[() => strengthsBody]} />
            ) : null}

            {hasGaps ? (
                <StackV gap={3} isSkeleton={isSkeleton} items={[() => gapsBody]} />
            ) : null}

            {/* no icon here — §5a.2: a chat-bubble needs an ASSOCIATION step to read as
                "a question" (not a universal symbol like ✓/🔒), and the card's own
                label="Follow-up question" already carries the fact. */}
            {hasFollowUp ? (
                <SurfaceCard
                    label="Follow-up question"


                    body={() => (
                        <div className="italic [&_p]:m-0">
                            <MarkdownContent
                                source={followUpQuestion ?? ""}
                                measure="compact"
                                isSkeleton={isSkeleton}

                            />
                        </div>
                    )}
                />
            ) : null}

            <StackV gap={3} isSkeleton={isSkeleton} items={[() => ctaSection]} />
        </>
    )

    return (
        <div>
            <StackV gap={6} isSkeleton={isSkeleton} items={[() => scorecardBody]} />
        </div>
    )
}

export { MockInterviewScorecard }
