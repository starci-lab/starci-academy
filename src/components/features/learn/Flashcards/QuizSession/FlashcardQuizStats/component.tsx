import React from "react"
import { ArrowRightIcon, ChartLineUpIcon } from "@phosphor-icons/react"
import { AsyncContent } from "@sb-components/composites/async/AsyncContent/AsyncContent"
import { SurfaceCard, SurfaceCardList, type SurfaceCardListItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Section } from "@sb-components/composites/layout/Section/Section"
import { ProgressMeter } from "@sb-components/composites/stats/ProgressMeter/ProgressMeter"
import { ScoreValue } from "@sb-components/composites/text/ScoreValue/ScoreValue"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV } from "@sb-components/frames/Stack/Stack"
import { RelatedContentList } from "@/components/blocks/learn/RelatedContentList"

/** Coverage-vs-target verdict floor (teacher's ruling per proposal §C — "an 80% target counts as knowing the module"). FE-only, no server field (contract). */
export const COVERAGE_TARGET = 80

/** Chip/meter severity BY coverage value (0..100). */
const coverageTone = (percent: number): "success" | "warning" | "danger" =>
    percent < 50 ? "danger" : percent < 70 ? "warning" : "success"

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
    /** Async status, owned by the connected file. */
    isLoading?: boolean
    error?: unknown
    onRetry?: () => void
    /** `true` → no stats / insufficient data → the empty state. */
    isEmpty?: boolean
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
 * tier-correct storybook vocabulary (`Section` / `SurfaceCard` / `SurfaceCardList` / `ProgressMeter` /
 * `ScoreValue`). ZONE 1 judges COVERAGE against a target; ZONE 2 ranks every attempted tag worst-first
 * plus one honest aggregate row for topics never attempted; ZONE 3 is the passive RAG study block.
 * See `design/storybook/architecture/split.md` — the connected `index.tsx` owns the fetch and i18n.
 *
 * @param props - {@link FlashcardQuizStatsProps}
 */
export const _FlashcardQuizStats = ({
    isLoading = false,
    error,
    onRetry,
    isEmpty = false,
    coveragePercent = null,
    untouchedTopicCount = 0,
    tags = [],
    courseId,
    displayId,
    onStartQuiz,
    labels,
}: FlashcardQuizStatsProps) => {
    // ZONE 2 rows — each attempted tag worst-first, then one honest aggregate row for the never-tried topics.
    const gapRows: Array<SurfaceCardListItem> = [
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

    const loaded = (
        <StackV gap={6} items={[
            /* ZONE 1 — HERO "Coverage vs target": coverage judged against COVERAGE_TARGET (not a
                bare %). Null only on a course with zero tag data — nothing honest to judge, so the
                zone is skipped rather than faking a verdict. */
            ...(coveragePercent !== null ? [() => (
                <Section header={{ title: labels.coverageZone, level: 3 }} body={() => (
                    <SurfaceCard
                        body={() => (
                            <StackV gap={3} items={[
                                () => <ScoreValue points={coveragePercent} unit="%" />,
                                () => <Typography text={labels.coverageVerdict} />,
                                () => <Typography size="sm" color="muted" text={labels.coverageSub} />,
                                () => (
                                    <ProgressMeter
                                        value={coveragePercent}
                                        max={100}
                                        target={COVERAGE_TARGET}
                                        color={coverageTone(coveragePercent)}
                                    />
                                ),
                                ...(untouchedTopicCount > 0 && onStartQuiz ? [() => (
                                    <Button
                                        label={labels.coverageDrillCta}
                                        variant="primary"
                                        size="sm"
                                        suffixIcon={ArrowRightIcon}
                                        onPress={onStartQuiz}
                                    />
                                )] : []),
                            ]} />
                        )}
                    />
                )} />
            )] : []),

            /* ZONE 2 — "Weak topics": every attempted tag ranked worst-first, plus ONE honest
                aggregate row for topics never attempted — no per-topic name exists for those
                server-side, so the row states the real count instead of inventing identities. */
            ...(gapRows.length > 0 ? [() => (
                <Section header={{ title: labels.gapZone, level: 3 }} body={() => (
                    <SurfaceCardList variant="nested" items={gapRows} />
                )} />
            )] : []),

            /* ZONE 3 — passive RAG "Study suggestions": weakest-coverage tags → course-wide content
                search (self-hiding when empty / no match). Waits on the slug for deep links, so a
                story that omits `displayId` renders backend-free. RelatedContentList is a real block
                (self-fetching) — a presentational component may render a connected child (split.md). */
            ...(displayId ? [() => (
                <RelatedContentList
                    courseId={courseId}
                    courseDisplayId={displayId}
                    query={tags.map((tagStat) => tagStat.tag).join(" ")}
                    label={labels.studyHeading}
                />
            )] : []),
        ]} />
    )

    const skeleton = (
        <StackV gap={6} items={[
            () => (
                <Section header={{ title: labels.coverageZone, level: 3 }} body={() => (
                    <SurfaceCard
                        body={() => (
                            <StackV gap={3} items={[
                                () => <ScoreValue points={0} unit="%" isSkeleton />,
                                () => <Typography size="sm" isSkeleton classNames={["w-3/4"]} />,
                                () => <Typography size="xs" color="muted" isSkeleton classNames={["w-1/2"]} />,
                            ]} />
                        )}
                    />
                )} />
            ),
            () => (
                <Section header={{ title: labels.gapZone, level: 3 }} body={() => (
                    <SurfaceCardList
                        variant="nested"
                        isSkeleton
                        items={Array.from({ length: 4 }, (_unused, index) => ({
                            key: `skeleton-${index}`,
                            title: "Topic",
                            meta: () => <Chip isSkeleton />,
                        }))}
                    />
                )} />
            ),
        ]} />
    )

    return (
        <div data-principles="FlashcardQuizStats">
            <AsyncContent
                isLoading={isLoading}
                skeleton={() => skeleton}
                error={error}
                errorContent={{ title: labels.errorTitle, onRetry: () => { onRetry?.() }, retryLabel: labels.retry }}
                isEmpty={isEmpty}
                emptyContent={{
                    icon: ChartLineUpIcon,
                    title: labels.emptyTitle,
                    description: labels.emptyDescription,
                    action: onStartQuiz ? () => (
                        <Button label={labels.emptyAction} variant="secondary" size="sm" onPress={onStartQuiz} />
                    ) : undefined,
                }}
                content={() => loaded}
            />
        </div>
    )
}
