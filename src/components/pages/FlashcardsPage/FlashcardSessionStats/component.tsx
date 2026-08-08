import React from "react"
import type { ReactNode } from "react"
import { CheckCircleIcon, WarningCircleIcon } from "@phosphor-icons/react"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import { SurfaceCard, SurfaceCardList, type SurfaceCardListItem } from "@/components/composites/cards/SurfaceCard"
import { Section } from "@/components/composites/layout/Section"
import { MetricCard } from "@/components/composites/stats/MetricCard"
import { ProgressMeter } from "@/components/composites/stats/ProgressMeter"
import { Button } from "@/components/atoms/buttons/Button"
import { Chip } from "@/components/atoms/chips/Chip"
import { Typography } from "@/components/atoms/text/Typography"
import { StackV, StackH } from "@/components/frames/Stack"
import { FillAvailable } from "@/components/frames/FillAvailable"
import { Grid, type GridItem } from "@/components/frames/Grid"
import { Container } from "@/components/frames/Container"
import type { SkeletonProps } from "@/components/frames/_slot"
import { BackLink } from "@/components/blocks/navigation/BackLink"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { RelatedContentList } from "@/components/blocks/learn/RelatedContentList"

/** How many placeholder rows the co-located skeleton shows for the weak-tags list. */
const SKELETON_WEAK_TAG_COUNT = 3

/**
 * One SM-2 grade bucket in the HERO distribution: its data key, i18n label key, and the
 * semantic meter tone (a low-recall grade must READ low; `good`/`easy` both share the
 * success tone). Kept here (not the connected file) because ORDER + TONE is a display
 * decision — only the label/count STRINGS need `t()`, resolved by the connected
 * `FlashcardSessionStats` (`tiers/split.md`).
 */
export const GRADE_ROW_DEFS = [
    { key: "again", labelKey: "flashcard.review.again", color: "danger" },
    { key: "hard", labelKey: "flashcard.review.hard", color: "warning" },
    { key: "good", labelKey: "flashcard.review.good", color: "success" },
    { key: "easy", labelKey: "flashcard.review.easy", color: "success" },
] as const

/** One resolved HERO grade row — label/count-percent already translated by the connected file. */
export interface FlashcardSessionStatsGradeRow {
    /** The SM-2 grade this row reports. */
    key: string
    /** Meter tone — a low-recall grade must read low. */
    color: "accent" | "success" | "warning" | "danger"
    /** Already-translated grade name ("Again", "Hard", …). */
    label: string
    /** Raw count — the meters' shared `max` is {@link FlashcardSessionStatsProps.gradeTotal}. */
    count: number
    /** Already-translated "N (P%)" readout. */
    countPercentLabel: string
}

/** One resolved "most forgotten" tag row. */
export interface FlashcardSessionStatsWeakTag {
    /** The tag text itself (not translated — content, not UI copy). */
    tag: string
    /** Already-translated "forgotten N times" readout. */
    forgotLabel: string
}

/** All display text, already localized by the connected `FlashcardSessionStats`; a story passes i18n keys. */
export interface FlashcardSessionStatsLabels {
    backLabel: string
    headerTitle: string
    headerDescription: string
    errorTitle: string
    retryLabel: string
    emptyTitle: string
    emptyDescription: string
    backToReviewLabel: string
    rollupLabel: string
    metricsLabel: string
    metricTotalLabel: string
    metricDurationLabel: string
    metricNextDueLabel: string
    metricXpLabel: string
    weakTagsHeading: string
    studyHeading: string
}

/** Props for {@link _FlashcardSessionStats} — presentational; all data resolved, no fetch/store/i18n. */
export interface FlashcardSessionStatsProps {
    /** First load, nothing in hand → the whole tree shimmers in place (co-located). Owned by the connected file. */
    isSkeleton?: boolean
    /** Settled with no honest per-grade breakdown (not found, or a legacy count-only session) → the fallback message. */
    isEmpty?: boolean
    /** Truthy → the error message (beats loading + empty). The connected file passes its settled fetch error. */
    error?: unknown
    /** Retry handler — paired with `labels.retryLabel` on the error branch. */
    onRetry?: () => void
    /** Returns to the flashcards study overview — the single onward path, never a dead end. */
    onBack: () => void
    /** The 4 SM-2 grade rows, in display order, already localized. */
    gradeRows: ReadonlyArray<FlashcardSessionStatsGradeRow>
    /** Sum of every grade row's count — the meters' shared `max`. */
    gradeTotal: number
    /** Already-formatted "reviewed" metric value. */
    metricTotalValue: string
    /** Already-formatted duration metric value ("45 seconds" / "6 minutes" / "—"). */
    metricDurationValue: string
    /** Already-formatted next-due-date metric value ("—" when nothing scheduled). */
    metricNextDueValue: string
    /** Already-formatted, already-translated XP metric value. */
    metricXpValue: string
    /** Every tag the learner forgot at least once, worst-first, already localized. */
    weakTags: ReadonlyArray<FlashcardSessionStatsWeakTag>
    /** Course id for the RAG study-suggestions child. */
    courseId: string
    /** Course display id — needed to build the study list's deep links. */
    courseDisplayId: string
    /** Weak-tag terms joined into one query string, driving the RAG "study this" list. */
    relatedQuery: string
    labels: FlashcardSessionStatsLabels
}

/**
 * The end-of-session STATS surface for a "Study cards" review run (deck-review or cross-deck
 * due-review) — the presentational half of {@link FlashcardSessionStats}: the completion screen
 * AND the render for revisiting a finished session by URL. A centered column of canonical blocks —
 * HERO = the 4-grade SM-2 distribution (NOT a binary remembered/forgot ring), then session metric
 * tiles, the most-forgotten tags, and a self-hiding RAG "study this" list keyed off those weak tags.
 *
 * Four states in the fixed order error → loading → empty → content (`loading-and-skeleton.md`):
 * `error` falls to the shared `AsyncContentError` frame; a settled `isEmpty` (not found, or a
 * legacy/degraded session with no per-grade data) falls to `AsyncContentEmpty` — never an error;
 * otherwise the ONE real tree renders, with `isSkeleton` threaded to every leaf so the shimmer
 * mirrors the loaded shape and cannot drift. The page header stays outside this switch — it is the
 * route's own chrome, not part of the async region. See `tiers/split.md` — the connected
 * `index.tsx` owns the fetch and every `t()` call.
 *
 * @param props - {@link FlashcardSessionStatsProps}
 */
export const _FlashcardSessionStats = ({
    isSkeleton = false,
    isEmpty = false,
    error,
    onRetry,
    onBack,
    gradeRows,
    gradeTotal,
    metricTotalValue,
    metricDurationValue,
    metricNextDueValue,
    metricXpValue,
    weakTags,
    courseId,
    courseDisplayId,
    relatedQuery,
    labels,
}: FlashcardSessionStatsProps) => {
    // reached via the "Study cards"/"Review due cards" LIVE session route AND the
    // revisit-by-URL result route — the header is the route's own chrome, unaffected
    // by the stats fetch below, so it renders unconditionally.
    const header = (
        <PageHeader
            breadcrumb={<BackLink label={labels.backLabel} onPress={onBack} />}
            title={labels.headerTitle}
            description={labels.headerDescription}
        />
    )

    let contentNode: ReactNode
    // error beats a stale loading flag; empty only once settled (BLOCK-8) — the empty and
    // error surfaces are the shared `AsyncContent*` frames, not hand-written JSX (loading-and-skeleton.md §6).
    if (error) {
        contentNode = <AsyncContentError title={labels.errorTitle} onRetry={onRetry} retryLabel={labels.retryLabel} />
    } else if (!isSkeleton && isEmpty) {
        contentNode = (
            <AsyncContentEmpty
                icon={CheckCircleIcon}
                title={labels.emptyTitle}
                description={labels.emptyDescription}
                action={() => <Button label={labels.backToReviewLabel} variant="secondary" size="sm" onPress={onBack} />}
            />
        )
    } else {
        // most-forgotten tags — self-hiding: while shimmering, placeholder rows keep the
        // SAME list shape; otherwise only when there is at least one real tag.
        const showWeakTags = isSkeleton || weakTags.length > 0
        const weakTagItems: Array<SurfaceCardListItem> = isSkeleton
            ? Array.from({ length: SKELETON_WEAK_TAG_COUNT }, (_unused, index) => ({
                key: `pending-${index}`,
                title: "Tag",
                leadingIcon: WarningCircleIcon,
                leadingIconColor: "warning" as const,
                trailing: () => <Chip isSkeleton />,
            }))
            : weakTags.map((weak) => ({
                key: weak.tag,
                title: weak.tag,
                leadingIcon: WarningCircleIcon,
                leadingIconColor: "warning" as const,
                trailing: () => <Chip tone="danger" text={weak.forgotLabel} />,
            }))

        // session metric tiles — same 4-cell grid shape while shimmering (MetricCard's own
        // isSkeleton branch has no real value/label to check yet).
        const metricItems: Array<GridItem> = [
            {
                key: "total",
                content: ({ isSkeleton: cellSkeleton }: SkeletonProps) => (cellSkeleton
                    ? <MetricCard isSkeleton />
                    : <MetricCard value={metricTotalValue} label={labels.metricTotalLabel} />),
            },
            {
                key: "duration",
                content: ({ isSkeleton: cellSkeleton }: SkeletonProps) => (cellSkeleton
                    ? <MetricCard isSkeleton />
                    : <MetricCard value={metricDurationValue} label={labels.metricDurationLabel} />),
            },
            {
                key: "next-due",
                content: ({ isSkeleton: cellSkeleton }: SkeletonProps) => (cellSkeleton
                    ? <MetricCard isSkeleton />
                    : <MetricCard value={metricNextDueValue} label={labels.metricNextDueLabel} />),
            },
            {
                key: "xp",
                content: ({ isSkeleton: cellSkeleton }: SkeletonProps) => (cellSkeleton
                    ? <MetricCard isSkeleton />
                    : <MetricCard value={metricXpValue} label={labels.metricXpLabel} />),
            },
        ]

        contentNode = (
            <StackV gap={6} principle="block-boundary"
                explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
                isSkeleton={isSkeleton} items={[
                // HERO — the 4-grade SM-2 distribution (outcome first).
                    () => (
                        <SurfaceCard isSkeleton={isSkeleton} body={() => (
                            <StackV gap={5} principle="group-boundary"
                                explain="Section group spacing — not sibling-stack, because these blocks are distinct groups rather than same-kind peers."
                                isSkeleton={isSkeleton} items={[
                                    () => (
                                        <StackV gap={3} principle="sibling-stack"
                                            explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                                            isSkeleton={isSkeleton} items={gradeRows.map((row) => () => (
                                                <StackH gap={3} principle="content-row"
                                                    explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                                                    isSkeleton={isSkeleton} items={[
                                                        () => <Typography size="sm" classNames={["shrink-0"]} isSkeleton={isSkeleton} text={row.label} />,
                                                        () => (
                                                            <FillAvailable
                                                                at="base"
                                                                isSkeleton={isSkeleton}
                                                                body={() => (isSkeleton
                                                                    ? <ProgressMeter isSkeleton color={row.color} />
                                                                    : <ProgressMeter value={row.count} max={gradeTotal} color={row.color} />)}
                                                            />
                                                        ),
                                                        () => <Typography size="sm" color="muted" classNames={["shrink-0"]} isSkeleton={isSkeleton} text={row.countPercentLabel} />,
                                                    ]} />
                                            ))} />
                                    ),
                                    // subtle secondary rollup — never replaces the 4 grades above
                                    () => <Typography size="xs" color="muted" isSkeleton={isSkeleton} text={labels.rollupLabel} />,
                                ]} />
                        )} />
                    ),

                    // session metric tiles
                    () => (
                    // teacher-hold: flashcards-remain-session-stats-metric-grid-gap4-no-token —
                    // four metric tiles at preserved step 4; no card-grid token.
                        <Section
                            header={{ title: labels.metricsLabel, level: 3 }}
                            isSkeleton={isSkeleton}
                            body={() => <Grid columns={{ base: 2, md: 4 }} principle="content-row"
                                explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                                isSkeleton={isSkeleton} items={metricItems} />}
                        />
                    ),

                    // most-forgotten tags — grouped from grade-0 cards
                    ...(showWeakTags ? [() => (
                        <SurfaceCardList label={labels.weakTagsHeading} isSkeleton={isSkeleton} items={weakTagItems} />
                    )] : []),

                    // PRIMARY payoff — self-hiding RAG "study your weak spot" list, keyed off the
                    // weak tags. RelatedContentList is a real block (self-fetching) — a presentational
                    // component may render a connected child (split.md). Hidden while shimmering (it
                    // fetches its own state).
                    ...(!isSkeleton ? [() => (
                        <RelatedContentList
                            courseId={courseId}
                            courseDisplayId={courseDisplayId}
                            query={relatedQuery}
                            label={labels.studyHeading}
                        />
                    )] : []),

                    // onward path — never a dead end, even with no weak tags
                    ...(!isSkeleton ? [() => (
                        <Button variant="tertiary" label={labels.backToReviewLabel} onPress={onBack} classNames={["self-center"]} />
                    )] : []),
                ]} />
        )
    }

    return (
        <StackV identity={{ tier: "page", component: "FlashcardSessionStats" }} gap={1} padding={{ base: { x: 5, y: 6 }, sm: { x: 6 } }} items={[
            () => (
                <Container size="md" padding={1} body={() => (
                    <StackV gap={6} principle="block-boundary"
                        explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
                        items={[() => header, () => contentNode]}  />
                )} />
            ),
        ]} />
    )
}
