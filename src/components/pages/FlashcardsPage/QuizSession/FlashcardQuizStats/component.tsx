import React from "react"
import { ArrowRightIcon, ChartLineUpIcon } from "@phosphor-icons/react"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import { SurfaceCard, SurfaceCardList, type SurfaceCardListItem } from "@/components/composites/cards/SurfaceCard"
import { Section } from "@/components/composites/layout/Section"
import { ProgressMeter } from "@/components/composites/stats/ProgressMeter"
import { ScoreValue } from "@/components/composites/text/ScoreValue"
import { Button } from "@/components/atoms/buttons/Button"
import { Chip } from "@/components/atoms/chips/Chip"
import { Typography } from "@/components/atoms/text/Typography"
import { StackV } from "@/components/frames/Stack"
import { RelatedContentList } from "@/components/blocks/learn/RelatedContentList"

/** Coverage-vs-target verdict floor (teacher's ruling per proposal §C — "an 80% target counts as knowing the module"). FE-only, no server field (contract). */
export const COVERAGE_TARGET = 80

/** Chip/meter severity BY coverage value (0..100). */
const coverageTone = (percent: number): "success" | "warning" | "danger" =>
    percent < 50 ? "danger" : percent < 70 ? "warning" : "success"

/** How many placeholder rows the co-located skeleton shows for zone 2. */
const SKELETON_ROW_COUNT = 4

/** One attempted tag with its coverage fraction (0..1) — the block turns it into a %. */
export interface FlashcardQuizStatsTag {
    tag: string
    coverage: number
}

/** All display text, already localized by the connected `FlashcardQuizStats`; a story passes i18n keys. */
export interface FlashcardQuizStatsLabels {
    errorTitle: string
    retry: string
    emptyTitle: string
    emptyDescription: string
    emptyAction: string
    coverageZone: string
    /** Full sentence — the connected file interpolates coverage/remaining/total. */
    coverageVerdict: string
    /** Caption under the meter — the connected file interpolates the target. */
    coverageSub: string
    /** Drill CTA — the connected file interpolates the untouched count. */
    coverageDrillCta: string
    gapZone: string
    topicOftenWrong: string
    topicNeverTried: string
    /** Suffix printed after the untouched-topic number in its chip. */
    topicEmptyChip: string
    studyHeading: string
}

/** Props for {@link _FlashcardQuizStats} — presentational; all data resolved, no fetch/store/i18n. */
export interface FlashcardQuizStatsProps {
    /** First load, nothing in hand → the whole tree shimmers in place (co-located). Owned by the connected file. */
    isSkeleton?: boolean
    /** Settled with no honest aggregate (insufficient data / no stats) → the empty message. */
    isEmpty?: boolean
    /** Truthy → the error message (beats loading + empty). The connected file passes its settled fetch error. */
    error?: unknown
    /** Retry handler — paired with `labels.retry` to show a retry button on the error branch. */
    onRetry?: () => void
    /** Coverage % vs the target; `null` on a course with zero tag data → zone 1 skipped. */
    coveragePercent?: number | null
    /** Attempted topics that were never covered — one honest aggregate row. */
    untouchedTopicCount?: number
    /** Every attempted tag, already ranked worst-first. */
    tags?: Array<FlashcardQuizStatsTag>
    /** Course id for the RAG study-suggestions child. */
    courseId: string
    /** Course display id — omitted (as in a story) → the self-fetching study zone is skipped. */
    displayId?: string
    onStartQuiz?: () => void
    labels: FlashcardQuizStatsLabels
}

/**
 * "Quick quiz" aggregate stats — the presentational half of {@link FlashcardQuizStats}, composed on the
 * tier-correct vocabulary (`Section` / `SurfaceCard` / `SurfaceCardList` / `ProgressMeter` / `ScoreValue`).
 * Four states in the fixed order error → loading → empty → content: `error` falls to the shared
 * `AsyncContentError` frame, `isEmpty` to `AsyncContentEmpty`, and otherwise the two-zone tree renders
 * with `isSkeleton` threaded to every leaf so the shimmer mirrors the loaded shape (loading-and-skeleton.md).
 * See `tiers/split.md` — the connected `index.tsx` owns the fetch and i18n.
 *
 * @param props - {@link FlashcardQuizStatsProps}
 */
export const _FlashcardQuizStats = ({
    isSkeleton = false,
    isEmpty = false,
    error,
    onRetry,
    coveragePercent = null,
    untouchedTopicCount = 0,
    tags = [],
    courseId,
    displayId,
    onStartQuiz,
    labels,
}: FlashcardQuizStatsProps) => {
    // error → skeleton → empty → content (BLOCK-8): error beats a stale loading flag; the empty and
    // error surfaces are the shared `AsyncContent*` frames, not hand-written JSX (loading-and-skeleton.md §6).
    if (error) {
        return <AsyncContentError title={labels.errorTitle} onRetry={onRetry} retryLabel={labels.retry} />
    }
    if (!isSkeleton && isEmpty) {
        return (
            <AsyncContentEmpty
                icon={ChartLineUpIcon}
                title={labels.emptyTitle}
                description={labels.emptyDescription}
                action={onStartQuiz ? () => (
                    <Button label={labels.emptyAction} variant="secondary" size="sm" onPress={onStartQuiz} />
                ) : undefined}
            />
        )
    }

    // ZONE 2 rows — while shimmering, placeholder rows keep the SAME `SurfaceCardList` shape; otherwise
    // every attempted tag worst-first, then one honest aggregate row for the never-tried topics.
    const gapRows: Array<SurfaceCardListItem> = isSkeleton
        ? Array.from({ length: SKELETON_ROW_COUNT }, (_unused, index) => ({
            key: `pending-${index}`,
            title: "Topic",
            meta: () => <Chip isSkeleton />,
        }))
        : [
            ...tags.map((tagStat, index) => {
                const percent = Math.round(tagStat.coverage * 100)
                return {
                    key: tagStat.tag,
                    title: tagStat.tag,
                    // only flag the single worst tag — the ranked chips already speak for the rest
                    subtitle: index === 0 && percent < 70 ? labels.topicOftenWrong : undefined,
                    meta: () => <Chip tone={coverageTone(percent)} text={`${percent}%`} />,
                }
            }),
            ...(untouchedTopicCount > 0
                ? [{
                    key: "__never-tried",
                    title: labels.topicNeverTried,
                    meta: () => <Chip text={`${untouchedTopicCount} ${labels.topicEmptyChip}`} />,
                }]
                : []),
        ]

    // Zones render while shimmering too (placeholder values) so the skeleton mirrors the loaded shape.
    const showCoverage = isSkeleton || coveragePercent !== null
    const showGap = isSkeleton || gapRows.length > 0

    return (
        <StackV gap={6} principle="block-boundary" items={[
            // ZONE 1 — HERO "Coverage vs target": coverage judged against COVERAGE_TARGET (not a bare %).
            ...(showCoverage ? [() => (
                <Section header={{ title: labels.coverageZone, level: 3 }} isSkeleton={isSkeleton} body={() => (
                    <SurfaceCard isSkeleton={isSkeleton} body={() => (
                        <StackV gap={3} principle="sibling-stack" items={[
                            () => <ScoreValue points={coveragePercent ?? 0} unit="%" isSkeleton={isSkeleton} />,
                            () => <Typography text={labels.coverageVerdict} isSkeleton={isSkeleton} classNames={isSkeleton ? ["w-3/4"] : undefined} />,
                            () => <Typography size="sm" color="muted" text={labels.coverageSub} isSkeleton={isSkeleton} classNames={isSkeleton ? ["w-1/2"] : undefined} />,
                            () => (isSkeleton
                                ? <ProgressMeter isSkeleton />
                                : <ProgressMeter value={coveragePercent ?? 0} max={100} target={COVERAGE_TARGET} color={coverageTone(coveragePercent ?? 0)} />),
                            ...(!isSkeleton && untouchedTopicCount > 0 && onStartQuiz ? [() => (
                                <Button label={labels.coverageDrillCta} variant="primary" size="sm" suffixIcon={ArrowRightIcon} onPress={onStartQuiz} />
                            )] : []),
                        ]} />
                    )} />
                )} />
            )] : []),

            // ZONE 2 — "Weak topics": attempted tags ranked worst-first + one honest never-tried row.
            ...(showGap ? [() => (
                <Section header={{ title: labels.gapZone, level: 3 }} isSkeleton={isSkeleton} body={() => (
                    <SurfaceCardList variant="nested" isSkeleton={isSkeleton} items={gapRows} />
                )} />
            )] : []),

            // ZONE 3 — passive RAG "Study suggestions": weakest-coverage tags → course-wide content search.
            // Waits on the slug for deep links, so a story that omits `displayId` renders backend-free.
            // RelatedContentList is a real block (self-fetching) — a presentational component may render a
            // connected child (split.md). Hidden while shimmering (it fetches its own state).
            ...(!isSkeleton && displayId ? [() => (
                <RelatedContentList
                    courseId={courseId}
                    courseDisplayId={displayId}
                    query={tags.map((tagStat) => tagStat.tag).join(" ")}
                    label={labels.studyHeading}
                />
            )] : []),
        ]} />
    )
}
