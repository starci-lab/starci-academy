import React from "react"
import { Skeleton as HeroSkeleton } from "@heroui/react"
import { ArrowRightIcon, CheckCircleIcon, WarningCircleIcon, XCircleIcon } from "@phosphor-icons/react"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { SurfaceCard, SurfaceCardCrossList, type SurfaceCardCrossListItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Callout, type CalloutIcon } from "@sb-components/composites/feedback/Callout/Callout"
import { ProgressMeter } from "@sb-components/composites/stats/ProgressMeter/ProgressMeter"
import { MarkdownContent } from "@sb-components/composites/viewers/MarkdownContent/MarkdownContent"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `MockInterviewScorecard`: read-only render of one graded mock-interview
 * run — verdict, score breakdown, attribute breakdown, strengths, gaps, the
 * follow-up an interviewer would ask next, and the CTAs that turn a bad number
 * into the next thing to actually do.
 *
 * PORTED FROM `src/components/features/learn/MockInterview/MockInterviewScorecard`
 * — same verdict/score/attribute vocabulary as the real `MockInterviewGradeResult`
 * BE contract (`src/components/features/learn/MockInterview/types.ts`), carried
 * over VERBATIM (`verdict: "pass" | "borderline" | "fail"`, `phaseScores`,
 * `attributeScores` — never invented). SIBLING OF `MockInterviewSetup` (same
 * `learn` group, same feature) and of `SubmissionScoreCard`/`ChallengeScoreCard`
 * (same "graded-result card" family, different domain).
 *
 * ⭐ SCOPE CUT THIS PASS (task brief, §B3 — a gap left clearly absent beats a stub
 * that renders nothing real): the source component also renders a rolling
 * "where you stand" track snapshot, a RAG-matched-content citation line, a
 * passive related-content list, and — the one that matters most here — a
 * per-question model-answer review, one INDEPENDENTLY-EXPANDABLE card per
 * question (candidate answer vs. authored answer). That review is real scope
 * but a SECOND LEAF, blocked on a missing primitive: `SurfaceCard.Accordion`
 * expands/collapses its rows as ONE GROUP identity, not as N independently
 * addressable panels each carrying its own two-way diff body — building it
 * would mean either mis-using the accordion composite for a shape it does not
 * own, or hand-rolling a second accordion next to the one the system already
 * has (the exact `ContentModeNav` mistake this run exists to prevent). Left out
 * rather than faked; the other four blocks/composites and the CTA row are real.
 *
 * ⭐ `SurfaceCardCrossList` REPLACES A HAND-ROLLED ROW LIST for strengths/gaps —
 * an ADDITION to the brief's compose list, not a substitution away from it: it
 * lives in the SAME `SurfaceCard.tsx` file already imported, and it is
 * *exactly* "a marked row of text, N of them, in a bounded card, with its own
 * skeleton mirror" — precisely the shape `strengths`/`gaps` need. Hand-building
 * that row (an icon + a `MarkdownContent` in a `StackH`, in a `.map`) would have
 * rebuilt what this composite already owns down to its own divider and
 * skeleton-row count, which is the specific mistake this run's brief calls out
 * ("a new list is almost always wrong — reuse instead").
 *
 * ⭐ `Chip` TAGS THE WEAK AREA, NOT THE VERDICT. The verdict already has its own
 * signal (the callout's tone + icon) — a second chip repeating "Pass"/"Fail"
 * beside it would be two chips arguing about the same fact, the trap
 * `SubmissionScoreCard`'s header warns about ("one tone, not two disagreeing
 * signals"). Here `Chip` names a DIFFERENT fact — which area the CTA is about
 * to send the learner back into — so it sits once, next to the primary CTA.
 *
 * ⭐ TWO COMPOSITES HAVE NO `isSkeleton` OF THEIR OWN — `Callout` (a
 * message frame, not a data-bearing one) and `ProgressMeter` (same known gap
 * `ChallengeScoreCard`/`ModuleContinueBand` already document). Both fall back to
 * a bare `HeroSkeleton` sized to the box they would have drawn, in the SAME
 * position in the tree, so nothing jumps once the grade lands.
 *
 * ⭐ WEAK-AREA COMPUTATION STAYS OUT OF THIS BLOCK. The source component picks
 * "the single weakest phase below 60%" itself, from `phaseScores` plus a
 * hardcoded threshold — that is a SCREEN-level judgement call (which phase
 * counts as "weak enough to push"), not something a read-only card should
 * decide. `weakAreaLabel` arrives already resolved (or omitted, for a run
 * with nothing weak enough to call out); this block only builds the CTA
 * sentence and the tag around it.
 *
 * 📐 ONE LEAF (§14d.2), by the same reasoning `SubmissionScoreCard`'s own header
 * gives for its own optional rows: nothing below changes the verdict banner's
 * or the CTA row's SHAPE — `promptTitle`/`createdAt`/`attributeScores`/
 * `strengths`/`gaps`/`followUpQuestion`/`weakAreaLabel`/`onRetry` are each an
 * independent presence/absence of DATA, not a different arrangement of parts.
 * By the letter of §14d.2 a disappearing `SurfaceCard` reads as its own leaf
 * (as `ContentHeader`'s outcomes card is) — but that rule is sized for ONE
 * optional card. Here EIGHT independent facts can each be missing at once;
 * splitting every combination into its own leaf would be a combinatorial
 * explosion the letter of the rule was never meant to demand, so — like
 * `MockInterviewSetup` and `SubmissionScoreCard` before it — every combination
 * this pass covers is filed as a STATE of the one `MockInterviewScorecard`
 * leaf, `isSkeleton` included (it only changes which atoms shimmer, never the
 * shape of an already-built tree, §11f).
 * ─────────────────────────────────────────────────────────────────────────────
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
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
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

        body={
            <>
                <Typography size="sm" truncate classNames={["shrink-0"]} text={label} />
                <ProgressMeter value={score} max={max} color={scoreColorOf(score, max)} classNames={["flex-1"]} />
                <Typography size="xs" color="muted" tabularNums classNames={["shrink-0"]} text={`${score}/${max}`} />
            </>
        }
    />
)

/** Same shape as {@link ScoreRow}, shimmering — `ProgressMeter` has no `isSkeleton` of its own (see file header). */
const ScoreRowSkeleton = () => (
    <StackH
        gap={4}
        align="center"
        body={
            <>
                <Typography size="sm" isSkeleton classNames={["shrink-0", "w-1/4"]} />
                <HeroSkeleton className="h-1 flex-1 rounded-full" />
                <Typography size="xs" isSkeleton classNames={["shrink-0", "w-1/4"]} />
            </>
        }
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
        text: (
            <div className="[&_p]:m-0">
                <MarkdownContent source={strength} measure="compact" />
            </div>
        ),
    }))

    const gapItems: Array<SurfaceCardCrossListItem> = gaps.map((gap, index) => ({
        key: `gap-${index}`,
        mark: "cross",
        tone: "danger",
        text: (
            <div className="[&_p]:m-0">
                <MarkdownContent source={gap} measure="compact" />
            </div>
        ),
    }))

    const primaryCtaLabel = weakAreaLabel ? `Review: ${weakAreaLabel}` : "Review your weak areas"

    const bylineRow = hasByline ? (
        <StackH
            gap={4}
            justify="between"
            wrap

            body={
                <>
                    {isSkeleton ? (
                        <Typography size="sm" weight="medium" isSkeleton classNames={["w-1/2"]} />
                    ) : promptTitle != null ? (
                        <Typography size="sm" weight="medium" text={promptTitle} />
                    ) : null}
                    {isSkeleton ? (
                        <Typography size="xs" color="muted" isSkeleton classNames={["w-1/3"]} />
                    ) : createdAt != null ? (
                        <Typography size="xs" color="muted" text={createdAt} />
                    ) : null}
                </>
            }
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

            body={
                <>
                    <Typography size="xs" color="muted" text="Weakest:" />
                    <Chip tone="warning" text={weakAreaLabel} />
                </>
            }
        />
    ) : null

    const ctaButtonRow = (
        <StackH
            gap={4}
            wrap

            body={
                <>
                    <Button
                        isSkeleton={isSkeleton}
                        variant="primary"
                        size="lg"
                        label={primaryCtaLabel}
                        suffixIcon={ArrowRightIcon}
                        iconSlide
                        onPress={onStudyWeakArea}

                    />
                    <Button
                        isSkeleton={isSkeleton}
                        variant="secondary"
                        size="lg"
                        label="Work on personal project"
                        onPress={onCapstone}

                    />
                    {onRetry != null || isSkeleton ? (
                        <Button
                            isSkeleton={isSkeleton}
                            variant="ghost"
                            size="lg"
                            label="Retry interview"
                            onPress={onRetry}

                        />
                    ) : null}
                </>
            }
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


                    body={() => <StackV gap={4} body={scoreBreakdownBody} />}
                />
            ) : null}

            {hasAttributeRows ? (
                <SurfaceCard
                    label="Score by criterion"


                    body={() => <StackV gap={4} body={attributeBreakdownBody} />}
                />
            ) : null}

            {hasStrengths ? (
                <StackV gap={3} body={strengthsBody} />
            ) : null}

            {hasGaps ? (
                <StackV gap={3} body={gapsBody} />
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

            <StackV gap={3} body={ctaSection} />
        </>
    )

    return (
        <div>
            <StackV gap={6} body={scorecardBody} />
        </div>
    )
}

export { MockInterviewScorecard }
