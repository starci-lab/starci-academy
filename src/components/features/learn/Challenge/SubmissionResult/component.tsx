"use client"

import React, { useState } from "react"
import {
    ArrowSquareOutIcon,
    CheckCircleIcon,
    InfoIcon,
    LightbulbIcon,
    MapPinIcon,
    WarningCircleIcon,
    XCircleIcon,
} from "@phosphor-icons/react"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import { SurfaceCardAccordion, type SurfaceCardAccordionItem } from "@/components/composites/cards/SurfaceCard"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { ModelByline, VerdictIcon } from "@/components/blocks/grading/GradingByline"
import { BackLink } from "@/components/blocks/navigation/BackLink"
import { FlexWrapButtonRadio } from "@/components/blocks/navigation/FlexWrapButtonRadio"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { SubmissionResultHistoryDrawer } from "@/components/drawers/SubmissionResultHistoryDrawer"
import { MarkdownContent } from "@/components/blocks/rendering/MarkdownContent"
import { RelatedContentList } from "@/components/blocks/learn/RelatedContentList"
import { Typography } from "@/components/atoms/text/Typography"
import { Button } from "@/components/atoms/buttons/Button"
import { Chip } from "@/components/atoms/chips/Chip"
import { StackV, StackH } from "@/components/frames/Stack"
import { Cluster } from "@/components/frames/Cluster"
import { Container } from "@/components/frames/Container"
import { SubmissionFeedbackSeverity } from "@/modules/types/enums/submission-feedback-severity"
import type { AiModelCategory } from "@/modules/api/graphql/queries/query-ai-models"
import type { SubmissionAttemptEntity } from "@/modules/types/entities/submission-attempt"
import type { SubmissionFeedbackEntity } from "@/modules/types/entities/submission-feedback"

/** Icon + tone per finding severity (drives the accordion row's leading glyph — {@link SurfaceCardAccordionItem.titleStart}). */
const SEVERITY_VISUAL: Record<SubmissionFeedbackSeverity, { Icon: typeof WarningCircleIcon, text: string }> = {
    [SubmissionFeedbackSeverity.High]: { Icon: WarningCircleIcon, text: "text-danger-soft-foreground" },
    [SubmissionFeedbackSeverity.Medium]: { Icon: WarningCircleIcon, text: "text-warning-soft-foreground" },
    [SubmissionFeedbackSeverity.Low]: { Icon: InfoIcon, text: "text-muted" },
}

/** Render up to this many attempt buttons inline; beyond it, the newest few + a "+N" pill that opens the history drawer. */
const ATTEMPT_CHIPS_MAX = 6
/** When overflowing, how many newest attempts stay visible (the rest collapse into the "+N" pill). */
const ATTEMPT_CHIPS_VISIBLE = 5
/**
 * Placeholder pill count for the co-located attempts skeleton. `FlexWrapButtonRadio` has no
 * `isSkeleton` of its own (see the {@link SubmissionResult} report's `missingSkeletonSupport`) —
 * this mirrors it minimally, right where the real row sits, instead of a separate skeleton tree.
 */
const SKELETON_ATTEMPT_CHIPS = 2
/** Placeholder row count for the co-located findings skeleton (before the real count is known). */
const SKELETON_FEEDBACK_ROWS = 3
/** Panel body for a placeholder accordion row — never actually rendered (the atom's own skeleton branch short-circuits before reaching it), just satisfies the item shape. */
const noopFeedbackBody = () => null

/** One attempt as a ready-to-render selector button — already resolved (i18n'd label) by the connected {@link SubmissionResult}. */
export interface SubmissionResultAttemptItem {
    id: string
    score: number | null
    /** Already-translated "Attempt {n}" line. */
    label: string
}

/** The currently selected attempt's detail — already resolved by the connected {@link SubmissionResult}. */
export interface SubmissionResultSelectedAttempt {
    id: string
    score: number | null
    shortFeedback?: string | null
    submissionUrl?: string | null
    servedModel: string | null
    servedCategory?: AiModelCategory
    /** Already-translated relative time ("2 hours ago"); `null`/omitted when the attempt has no `processedAt`. */
    timeAgo?: string | null
}

/** Every piece of display text, already localized by the connected {@link SubmissionResult}; a story passes i18n keys. */
export interface SubmissionResultLabels {
    backToChallenge: string
    attempts: string
    history: string
    emptyAttemptsTitle: string
    emptyAttemptsDescription: string
    /** Shared by both async regions (attempts + feedback) — matches the single translation key the legacy code reused for both. */
    error: string
    retry: string
    resultLabel: string
    passed: string
    failed: string
    /** Already-interpolated "at least N to pass" sentence. Omit when there is no honest pass line to show. */
    passNeeded?: string
    viewSubmission: string
    feedbackLabel: string
    noFeedback: string
    relatedContentLabel: string
}

/** Props for {@link _SubmissionResult} — presentational; all data resolved, no fetch/store/i18n. */
export interface SubmissionResultProps {
    onBackPress: () => void
    title: string
    description?: string

    /** First load, nothing in hand → the attempt strip shimmers in place (co-located). Owned by the connected file. */
    attemptsIsSkeleton?: boolean
    /** Settled with zero attempts → the empty message. */
    attemptsIsEmpty?: boolean
    /** Truthy → the attempts error message (beats skeleton + empty). The connected file passes its settled fetch error. */
    attemptsError?: unknown
    onRetryAttempts?: () => void
    attempts: Array<SubmissionResultAttemptItem>
    selectedAttemptId?: string
    onSelectAttempt: (id: string) => void

    maxScore: number
    passThreshold: number

    /** The selected attempt's own detail; omitted while none is resolved yet (mirrors the original "nothing renders below the strip until an attempt is selected" behaviour). */
    selectedAttempt?: SubmissionResultSelectedAttempt

    /** First load, nothing in hand → the findings accordion shimmers in place (its own `isSkeleton`, forwarded straight to {@link SurfaceCardAccordion}). */
    feedbacksIsSkeleton?: boolean
    /** Truthy → the feedback error message. */
    feedbacksError?: unknown
    onRetryFeedbacks?: () => void
    /** Findings, already ranked (severity, then stored order) by the connected file. */
    feedbacks: Array<SubmissionFeedbackEntity>

    courseId?: string
    courseDisplayId?: string

    labels: SubmissionResultLabels

    /** Full attempt entities + the model tier map, forwarded untouched to the (self-connected) history drawer. */
    rawAttempts: Array<SubmissionAttemptEntity>
    modelCategoryMap: Map<string, AiModelCategory>
}

/** Verdict against the pass line for a given score — a pure formula over already-resolved numeric props, not i18n. */
const isPassingScore = (score: number | null, maxScore: number, passThreshold: number): boolean =>
    passThreshold > 0 && maxScore > 0 && (score ?? 0) >= passThreshold * maxScore

/** "N/max" (or bare "N" with no honest max) — plain number formatting, not i18n. */
const scoreLabel = (score: number | null, maxScore: number): string =>
    maxScore > 0 ? `${score ?? 0}/${maxScore}` : `${score ?? 0}`

/** Absolute link to a finding's file location in the graded repo, when both are known. */
const findingLocationHref = (location: string | null | undefined, repositoryUrl: string | null | undefined): string | undefined =>
    location && repositoryUrl
        ? `${repositoryUrl.replace(/\.git$/, "")}/blob/HEAD/${location.replace(/^\//, "")}`
        : undefined

/** One finding's panel body: detail text, a linked file location, and the suggested fix. */
const FindingBody = ({
    feedback,
    repositoryUrl,
}: {
    feedback: SubmissionFeedbackEntity
    repositoryUrl?: string | null
}) => {
    // Local `const`s (not repeated `feedback.x` property access) so narrowing survives into the
    // nested item closures below — TS drops a property-access narrow across a function boundary.
    const { detail, location, suggestion } = feedback
    const locationHref = findingLocationHref(location, repositoryUrl)
    return (
        <StackV gap={2} items={[
            ...(detail ? [() => (
                <MarkdownContent markdown={detail} className="text-sm text-muted [&_p]:m-0" />
            )] : []),
            ...(location ? [() => (
                <StackH gap={2} align="start" classNames={["min-w-0"]} items={[
                    () => <MapPinIcon aria-hidden focusable="false" className="mt-0 size-4 shrink-0 text-muted" />,
                    () => (locationHref ? (
                        <Typography
                            isLink
                            href={locationHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            underlineOnHover
                            size="xs"
                            color="muted"
                            text={location}
                        />
                    ) : (
                        <Typography size="xs" color="muted" text={location} />
                    )),
                ]} />
            )] : []),
            ...(suggestion ? [() => (
                <StackH gap={2} align="start" items={[
                    () => <LightbulbIcon aria-hidden focusable="false" className="mt-0 size-4 shrink-0 text-muted" />,
                    () => <MarkdownContent markdown={suggestion} className="text-sm text-muted [&_p]:m-0" />,
                ]} />
            )] : []),
        ]} />
    )
}

/** Builds one {@link SurfaceCardAccordion} row from a finding — severity glyph leading, location as the muted subtitle, detail/suggestion in the panel. */
const buildFeedbackItem = (feedback: SubmissionFeedbackEntity, repositoryUrl?: string | null): SurfaceCardAccordionItem => {
    const visual = SEVERITY_VISUAL[feedback.severity] ?? SEVERITY_VISUAL[SubmissionFeedbackSeverity.Medium]
    return {
        id: feedback.id,
        title: feedback.message,
        subtitle: feedback.location ?? undefined,
        titleStart: () => <visual.Icon aria-hidden focusable="false" className={`size-4 shrink-0 ${visual.text}`} />,
        body: () => <FindingBody feedback={feedback} repositoryUrl={repositoryUrl} />,
    }
}

/**
 * Challenge-result page (quality-gate report) — the presentational half of `SubmissionResult`.
 * TIER-1/2 {@link PageHeader} (back-link + requirement title); below it a single column: an
 * attempt selector (co-located skeleton/empty/error — a chip strip for few attempts, a
 * {@link Button} that opens the {@link SubmissionResultHistoryDrawer} for many), then the
 * selected attempt as two cards — "Result" ({@link LabeledCard}: score hero + verdict + the AI
 * model that graded it) and "Feedback" ({@link SurfaceCardAccordion}: findings, each an
 * expandable row).
 *
 * Both async regions follow error → skeleton → empty → content: `error` falls to the shared
 * `AsyncContentError` frame; the attempts strip mirrors its own skeleton/empty in place (loading-
 * and-skeleton.md), while the findings region forwards `isSkeleton`/`emptyState` straight into
 * `SurfaceCardAccordion`, which self-mirrors via the house `Accordion` atom (COMPOSITE-10) instead
 * of this layer building a second tree. See `tiers/split.md` — the connected `index.tsx` owns the
 * fetch and i18n.
 *
 * @param props - {@link SubmissionResultProps}
 */
export const _SubmissionResult = ({
    onBackPress,
    title,
    description,
    attemptsIsSkeleton = false,
    attemptsIsEmpty = false,
    attemptsError,
    onRetryAttempts,
    attempts,
    selectedAttemptId,
    onSelectAttempt,
    maxScore,
    passThreshold,
    selectedAttempt,
    feedbacksIsSkeleton = false,
    feedbacksError,
    onRetryFeedbacks,
    feedbacks,
    courseId,
    courseDisplayId,
    labels,
    rawAttempts,
    modelCategoryMap,
}: SubmissionResultProps) => {
    const [historyOpen, setHistoryOpen] = useState(false)

    // chip strip: render up to ATTEMPT_CHIPS_MAX buttons; beyond that show the newest few + a
    // "+N" pill that opens the full history drawer.
    const isOverflow = attempts.length > ATTEMPT_CHIPS_MAX
    const visibleAttempts = isOverflow ? attempts.slice(0, ATTEMPT_CHIPS_VISIBLE) : attempts
    const overflowCount = attempts.length - visibleAttempts.length

    const passing = selectedAttempt ? isPassingScore(selectedAttempt.score, maxScore, passThreshold) : false
    const showRelatedContent = !passing && Boolean(selectedAttempt) && Boolean(courseId) && Boolean(courseDisplayId)
    // query auto-built from the top-severity findings' own text — no typing
    const failingFindingsQuery = feedbacks.slice(0, 3).map((feedback) => feedback.message).join(" ")

    // ── attempt selector region — error → skeleton (leaf has no isSkeleton of its own, mirrored
    // minimally in place) → empty → content.
    let attemptsRegion: React.ReactNode
    if (attemptsError) {
        attemptsRegion = <AsyncContentError title={labels.error} onRetry={onRetryAttempts} retryLabel={labels.retry} />
    } else if (!attemptsIsSkeleton && attemptsIsEmpty) {
        attemptsRegion = <AsyncContentEmpty title={labels.emptyAttemptsTitle} description={labels.emptyAttemptsDescription} />
    } else if (attemptsIsSkeleton) {
        attemptsRegion = (
            <Cluster gap={3} items={Array.from({ length: SKELETON_ATTEMPT_CHIPS }, (_unused, index) => () => (
                <Skeleton key={index} className="h-9 w-32 rounded-full" />
            ))} />
        )
    } else {
        attemptsRegion = (
            <StackV gap={4} items={[
                () => <Typography size="sm" weight="medium" text={labels.attempts} />,
                () => (
                    <FlexWrapButtonRadio
                        ariaLabel={labels.history}
                        value={selectedAttemptId ?? ""}
                        onChange={onSelectAttempt}
                        items={visibleAttempts.map((attempt) => ({
                            value: attempt.id,
                            content: (
                                <>
                                    <VerdictIcon pass={isPassingScore(attempt.score, maxScore, passThreshold)} />
                                    <span>{attempt.label}</span>
                                    <span className="text-xs opacity-70">{scoreLabel(attempt.score, maxScore)}</span>
                                </>
                            ),
                        }))}
                        trailing={overflowCount > 0 ? (
                            <Button
                                variant="tertiary"
                                size="sm"
                                ariaLabel={labels.history}
                                label={`+${overflowCount}`}
                                onPress={() => setHistoryOpen(true)}
                            />
                        ) : undefined}
                    />
                ),
            ]} />
        )
    }

    // ── findings accordion region — error is the only branch this presentational layer still
    // hand-checks: skeleton + empty are owned by `SurfaceCardAccordion` itself (COMPOSITE-10 —
    // `isSkeleton` self-mirrors via the house `Accordion` atom, `emptyState` self-frames).
    const feedbackItems: Array<SurfaceCardAccordionItem> = feedbacksIsSkeleton
        ? Array.from({ length: SKELETON_FEEDBACK_ROWS }, (_unused, index) => ({ id: `pending-${index}`, title: "", body: noopFeedbackBody }))
        : feedbacks.map((feedback) => buildFeedbackItem(feedback, selectedAttempt?.submissionUrl))

    const feedbackRegion = feedbacksError ? (
        <AsyncContentError title={labels.error} onRetry={onRetryFeedbacks} retryLabel={labels.retry} />
    ) : (
        <SurfaceCardAccordion
            label={labels.feedbackLabel}
            items={feedbackItems}
            allowsMultipleExpanded
            isSkeleton={feedbacksIsSkeleton}
            emptyState={() => <AsyncContentEmpty title={labels.noFeedback} />}
        />
    )

    const resultBody = () => (
        <StackV gap={7} items={[
            () => (
                <PageHeader
                    breadcrumb={<BackLink label={labels.backToChallenge} onPress={onBackPress} />}
                    title={title}
                    description={description}
                />
            ),
            () => (
                <StackV gap={6} items={[
                    () => attemptsRegion,
                    ...(selectedAttempt ? [() => (
                        <StackV gap={6} items={[
                            () => (
                                <LabeledCard label={labels.resultLabel} contentClassName="flex flex-col gap-3">
                                    <StackV gap={4} divider items={[
                                        () => (
                                            // score hero — the #1 signal, tinted by pass/fail
                                            <StackH gap={4} align="start" items={[
                                                () => (
                                                    <StackH as="span" gap={1} align="baseline" items={[
                                                        () => (
                                                            <span className={`text-4xl font-bold leading-none ${passing ? "text-success-soft-foreground" : "text-danger-soft-foreground"}`}>
                                                                {selectedAttempt.score ?? 0}
                                                            </span>
                                                        ),
                                                        ...(maxScore > 0 ? [() => (
                                                            <span className="text-base text-muted">/{maxScore}</span>
                                                        )] : []),
                                                    ]} />
                                                ),
                                                () => (
                                                    <StackV gap={2} classNames={["min-w-0", "flex-1"]} items={[
                                                        () => (
                                                            <Cluster gap={3} items={[
                                                                () => (
                                                                    <Chip
                                                                        tone={passing ? "success" : "danger"}
                                                                        icon={passing ? CheckCircleIcon : XCircleIcon}
                                                                        text={passing ? labels.passed : labels.failed}
                                                                    />
                                                                ),
                                                                ...(labels.passNeeded ? [() => (
                                                                    <Typography size="sm" color="muted" text={labels.passNeeded ?? ""} />
                                                                )] : []),
                                                            ]} />
                                                        ),
                                                        ...(selectedAttempt.shortFeedback ? [() => (
                                                            <Typography size="sm" color="muted" text={selectedAttempt.shortFeedback ?? ""} />
                                                        )] : []),
                                                    ]} />
                                                ),
                                                ...(selectedAttempt.submissionUrl ? [() => (
                                                    // Typography's `isLink` branch renders no icon slot (atom gap) — a plain
                                                    // anchor is the only way to keep the trailing arrow, and `<a>` is not the
                                                    // banned "raw div with flex" shape.
                                                    <a
                                                        href={selectedAttempt.submissionUrl ?? undefined}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex shrink-0 items-center gap-2 text-sm text-accent-soft-foreground hover:underline underline-offset-4 decoration-[var(--separator-tertiary)]"
                                                    >
                                                        {labels.viewSubmission}
                                                        <ArrowSquareOutIcon aria-hidden focusable="false" className="size-5" />
                                                    </a>
                                                )] : []),
                                            ]} />
                                        ),
                                        () => (
                                            // model byline — which AI model actually graded this attempt + when
                                            <StackH gap={3} justify="between" items={[
                                                () => <ModelByline model={selectedAttempt.servedModel} category={selectedAttempt.servedCategory} withLabel />,
                                                ...(selectedAttempt.timeAgo ? [() => (
                                                    <Typography size="xs" color="muted" classNames={["shrink-0"]} text={selectedAttempt.timeAgo ?? ""} />
                                                )] : []),
                                            ]} />
                                        ),
                                    ]} />
                                </LabeledCard>
                            ),
                            () => feedbackRegion,
                            // quiet, self-hiding "what to read to fix this" — ONLY when the attempt failed.
                            // Query auto-built from the findings themselves, no typing.
                            ...(showRelatedContent && courseId && courseDisplayId ? [() => (
                                <RelatedContentList
                                    courseId={courseId}
                                    courseDisplayId={courseDisplayId}
                                    query={failingFindingsQuery}
                                    label={labels.relatedContentLabel}
                                />
                            )] : []),
                        ]} />
                    )] : []),
                ]} />
            ),
        ]} />
    )

    return (
        <>
            <Container size="lg" padding={6} body={resultBody} identity={{ tier: "block", component: "SubmissionResult" }} />
            <SubmissionResultHistoryDrawer
                isOpen={historyOpen}
                onOpenChange={setHistoryOpen}
                attempts={rawAttempts}
                selectedAttemptId={selectedAttemptId}
                maxScore={maxScore}
                passThreshold={passThreshold}
                modelCategoryMap={modelCategoryMap}
                onSelect={onSelectAttempt}
            />
        </>
    )
}
