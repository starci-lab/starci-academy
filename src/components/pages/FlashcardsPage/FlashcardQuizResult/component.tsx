import React from "react"
import { CheckCircleIcon } from "@phosphor-icons/react"
import type { QuizSessionReadinessData, QuizSessionWeakTagData } from "@/modules/api/graphql/mutations/types/complete-flashcard-quiz-session"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import { MetricCard } from "@/components/composites/stats/MetricCard"
import { SurfaceCardList, type SurfaceCardListItem } from "@/components/composites/cards/SurfaceCard"
import type { SkeletonProps } from "@/components/frames/_slot"
import { Button } from "@/components/atoms/buttons/Button"
import { Chip } from "@/components/atoms/chips/Chip"
import { Typography } from "@/components/atoms/text/Typography"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { BackLink } from "@/components/blocks/navigation/BackLink"
import { RelatedContentList } from "@/components/blocks/learn/RelatedContentList"
import { Container } from "@/components/frames/Container"
import { StackV, StackH } from "@/components/frames/Stack"
import { Grid } from "@/components/frames/Grid"
import { RecapEnrollUpsell, RecapReadinessCallout, RecapWeakTagsCard } from "./recapBlocks"

/** How many placeholder rows the per-card breakdown shows on the FIRST load (outer `isSkeleton`, results count unknown yet). */
const SKELETON_ROW_COUNT = 5

/** One already-resolved per-card breakdown row — status tone + aria label + score chip text, built by the connected {@link import("./index").FlashcardQuizResult}. */
export interface FlashcardQuizResultPerCardRow {
    /** Stable React key (`${cardId}-${index}`). */
    key: string
    /** Card front text, or the already-translated fallback when the card text hasn't resolved. */
    title: string
    /** Pass/partial/fail tone for the status dot + score chip. */
    tone: "success" | "warning" | "danger"
    /** Already-translated aria-label for the status dot ("Fully correct" / "Partially correct" / "Incorrect"). */
    statusLabel: string
    /** Already-translated "n/m" score chip text. */
    scoreLabel: string
}

/** Props for {@link _FlashcardQuizResult} — presentational; all data resolved, no fetch/store/i18n. */
export interface FlashcardQuizResultProps {
    /** First load, nothing in hand → the whole tree shimmers in place (co-located). Owned by the connected file. */
    isSkeleton?: boolean
    /** Settled with no session to show (not found / not owned) → the empty message. */
    isEmpty?: boolean
    /** Truthy → the error message (beats loading + empty). The connected file passes its settled fetch error. */
    error?: unknown
    /** Retry handler for the error branch — re-runs the session fetch. */
    onRetry?: () => void
    /** Returns to the flashcards overview — the empty-branch action AND the closing CTA. */
    onBack: () => void

    breadcrumbLabel: string
    headerTitle: string
    headerDescription: string
    /** Shared title for both the error branch and the not-found empty branch (same text on both, existing behaviour). */
    fallbackTitle: string
    backToReviewLabel: string

    /** Final coverage (0..1), or `null` on a session with nothing to judge yet. */
    coverage?: number | null
    xpEarned?: number
    fullyCorrectCount?: number
    cardCount?: number
    coverageLabel: string
    xpLabel: string
    fullyCorrectLabel: string

    /** Whether today's daily XP cap clamped the grant (live path only). */
    dailyCapReached?: boolean
    dailyCapReachedLabel: string

    /** Whether the persisted session has any per-card results to break down. */
    hasPerCardResults?: boolean
    /** The per-card card-text fetch's own first-load flag (a NESTED async region, independent of the outer session load). */
    isPerCardSkeleton?: boolean
    /** Row count for the per-card skeleton once the outer session HAS resolved (`min(results.length, 5)`). */
    perCardSkeletonCount?: number
    perCardRows?: Array<FlashcardQuizResultPerCardRow>
    perCardHeading: string

    enrolled?: boolean
    enrollKnown?: boolean

    /** Top-3 weakest tags (state "empty" when none qualify). */
    topWeakTags?: Array<QuizSessionWeakTagData>
    /** Tags beyond the top-3, scrolled inside the same card. */
    overflowWeakTags?: Array<QuizSessionWeakTagData>
    /** Resolves a weak tag to its lesson route, or `null` when the mapping was ambiguous. */
    resolveTagHref?: (tag: QuizSessionWeakTagData) => string | null
    genericContinueHref?: string

    studyHeading: string
    /** Course id for the RAG "study this" child block. */
    courseId: string
    /** Course display id — needed for the same child's deep links. */
    courseDisplayId: string

    /** AI Mock Interview readiness (live path only, enrolled-only). */
    readiness?: QuizSessionReadinessData | null
    mockInterviewHref?: string
}

/** Status-dot tone → the class it paints (§4/§5: a bare decorative dot, sized+coloured once). */
const STATUS_DOT_CLASS: Record<"success" | "warning" | "danger", string> = {
    success: "size-2.5 shrink-0 rounded-full bg-success",
    warning: "size-2.5 shrink-0 rounded-full bg-warning",
    danger: "size-2.5 shrink-0 rounded-full bg-danger",
}

/**
 * A per-card breakdown row's leading status dot — colour carries the pass/partial/fail
 * tone, but never ALONE: `role="img"` + `aria-label` carry the same meaning for a
 * screen reader.
 */
const StatusDot = ({ tone, label }: { tone: "success" | "warning" | "danger"; label: string }) => (
    <span className={STATUS_DOT_CLASS[tone]} role="img" aria-label={label} />
)

/**
 * The URL-addressable RESULT surface for a finished "Quick quiz" run — the presentational
 * half of {@link import("./index").FlashcardQuizResult}. Mirrors
 * {@link import("../QuizSession/FlashcardQuizStats").FlashcardQuizStats}'s shell: a centered
 * `Container size="md"` column of canonical blocks — HERO = three metric tiles
 * (coverage · XP · fully-correct), the per-card cloze breakdown, the most-forgotten
 * tags, and a self-hiding RAG "study this" list keyed off those tags.
 *
 * Three states in the fixed order error → empty → content (`tiers/split.md`,
 * `loading-and-skeleton.md` §1): `error` falls to the shared `AsyncContentError` frame,
 * `isEmpty` to `AsyncContentEmpty`, and otherwise the ONE real tree renders with
 * `isSkeleton` threaded to every leaf that supports it. `PageHeader`/`BackLink` carry no
 * `isSkeleton` of their own (`missingSkeletonSupport`) but need none here — they render
 * static, already-translated chrome text, not fetched data, so they stay unconditional
 * across every branch (the original design's own choice, preserved). `RecapEnrollUpsell`
 * / `RecapWeakTagsCard` / `RecapReadinessCallout` / `RelatedContentList` also carry no
 * `isSkeleton` (`missingSkeletonSupport`) and, same as the original parallel skeleton
 * never drew them while loading, are gated behind `!isSkeleton` instead of mirrored.
 * `SurfaceCardList`'s `leading`/`meta` row slots do not auto-forward `isSkeleton`
 * (`missingSkeletonSupport`) — the per-card rows are built as two different item
 * arrays (skeleton vs real, `StatusDot`/bare `Skeleton` swapped in directly), the same
 * shape `FlashcardQuizStats` already uses for its own gap rows.
 *
 * See `tiers/split.md` — the connected `index.tsx` owns the two fetches (session +
 * per-card text), the redux enrollment reads, and every i18n string.
 *
 * @param props - {@link FlashcardQuizResultProps}
 */
export const _FlashcardQuizResult = ({
    isSkeleton = false,
    isEmpty = false,
    error,
    onRetry,
    onBack,
    breadcrumbLabel,
    headerTitle,
    headerDescription,
    fallbackTitle,
    backToReviewLabel,
    coverage = null,
    xpEarned = 0,
    fullyCorrectCount = 0,
    cardCount = 0,
    coverageLabel,
    xpLabel,
    fullyCorrectLabel,
    dailyCapReached = false,
    dailyCapReachedLabel,
    hasPerCardResults = false,
    isPerCardSkeleton = false,
    perCardSkeletonCount = 0,
    perCardRows = [],
    perCardHeading,
    enrolled = false,
    enrollKnown = false,
    topWeakTags = [],
    overflowWeakTags = [],
    resolveTagHref = () => null,
    genericContinueHref = "",
    studyHeading,
    courseId,
    courseDisplayId,
    readiness = null,
    mockInterviewHref = "",
}: FlashcardQuizResultProps) => {
    const coverageValue = coverage != null ? `${Math.round(coverage * 100)}%` : "—"
    const xpValue = `+${xpEarned}`
    const fullyCorrectValue = `${fullyCorrectCount}/${cardCount}`

    const header = () => (
        <PageHeader
            breadcrumb={<BackLink label={breadcrumbLabel} onPress={onBack} />}
            title={headerTitle}
            description={headerDescription}
        />
    )

    const body = () => {
        // error beats a stale loading flag; the not-found empty branch only reads once
        // settled — the shared `AsyncContent*` frames, not hand-written JSX (loading-and-skeleton.md §6).
        if (error) {
            return (
                <AsyncContentError
                    title={fallbackTitle}
                    onRetry={onRetry}
                    retryLabel={backToReviewLabel}
                />
            )
        }
        if (!isSkeleton && isEmpty) {
            return (
                <AsyncContentEmpty
                    icon={CheckCircleIcon}
                    title={fallbackTitle}
                    action={() => (
                        <Button size="sm" variant="primary" onPress={onBack} label={backToReviewLabel} />
                    )}
                />
            )
        }

        const showPerCard = isSkeleton || hasPerCardResults
        const perCardListSkeleton = isSkeleton || isPerCardSkeleton
        const perCardItems: Array<SurfaceCardListItem> = perCardListSkeleton
            ? Array.from({ length: isSkeleton ? SKELETON_ROW_COUNT : perCardSkeletonCount }, (_unused, index) => ({
                key: `pending-${index}`,
                leading: () => <Skeleton className="size-2.5 shrink-0 rounded-full" />,
                meta: () => <Chip isSkeleton />,
            }))
            : perCardRows.map((row) => ({
                key: row.key,
                title: row.title,
                leading: () => <StatusDot tone={row.tone} label={row.statusLabel} />,
                meta: () => <Chip tone={row.tone} text={row.scoreLabel} />,
            }))

        const showUpsell = !isSkeleton && enrollKnown && !enrolled
        const weakTagsPrimary = enrollKnown && enrolled
        const showStudyList = !isSkeleton && topWeakTags.length > 0
        const showReadiness = !isSkeleton && enrollKnown && enrolled && readiness != null

        return (
            <StackV gap={6} items={[
                // HERO — three authoritative metric tiles (outcome first).
                () => (
                    <Grid
                        gap={4}
                        columns={{ base: 1, sm: 3 }}
                        isSkeleton={isSkeleton}
                        items={[
                            {
                                key: "coverage",
                                content: ({ isSkeleton: cellSkeleton }: SkeletonProps) => (
                                    cellSkeleton
                                        ? <MetricCard isSkeleton />
                                        : <MetricCard value={coverageValue} label={coverageLabel} />
                                ),
                            },
                            {
                                key: "xp",
                                content: ({ isSkeleton: cellSkeleton }: SkeletonProps) => (
                                    cellSkeleton
                                        ? <MetricCard isSkeleton />
                                        : <MetricCard value={xpValue} label={xpLabel} />
                                ),
                            },
                            {
                                key: "fullyCorrect",
                                content: ({ isSkeleton: cellSkeleton }: SkeletonProps) => (
                                    cellSkeleton
                                        ? <MetricCard isSkeleton />
                                        : <MetricCard value={fullyCorrectValue} label={fullyCorrectLabel} />
                                ),
                            },
                        ]}
                    />
                ),
                ...(!isSkeleton && dailyCapReached ? [() => (
                    <Typography size="xs" color="muted" text={dailyCapReachedLabel} />
                )] : []),

                // PER-CARD breakdown — a NESTED async region (its own card-text fetch),
                // so it carries its own `isPerCardSkeleton` on top of the outer one.
                ...(showPerCard ? [() => (
                    <SurfaceCardList
                        label={perCardHeading}
                        isSkeleton={perCardListSkeleton}
                        items={perCardItems}
                    />
                )] : []),

                // enroll upsell (trial only) — the result's PRIMARY action for a trial
                // viewer, framed as a reward for the momentum just built.
                ...(showUpsell ? [() => <RecapEnrollUpsell />] : []),

                // weak-tags demand-bridge: PRIMARY when enrolled, a smaller secondary
                // link under the upsell when trial.
                ...(!isSkeleton ? [() => (
                    <RecapWeakTagsCard
                        weakTags={topWeakTags}
                        overflowWeakTags={overflowWeakTags}
                        resolveTagHref={resolveTagHref}
                        genericHref={genericContinueHref}
                        primary={weakTagsPrimary}
                    />
                )] : []),

                // quiet, self-hiding "study this too" — RAG search keyed off the same
                // weak tags (no typing); auto-hides when there are none.
                ...(showStudyList ? [() => (
                    <RelatedContentList
                        courseId={courseId}
                        courseDisplayId={courseDisplayId}
                        query={topWeakTags.map((tag) => tag.tag).join(" ")}
                        label={studyHeading}
                    />
                )] : []),

                // AI Mock Interview readiness — live-only (query-absent), enrolled-only.
                ...(showReadiness ? [() => (
                    <RecapReadinessCallout
                        readiness={readiness as QuizSessionReadinessData}
                        mockInterviewHref={mockInterviewHref}
                    />
                )] : []),

                // onward path — never a dead end, even with no weak tags.
                ...(!isSkeleton ? [() => (
                    <StackH gap={4} justify="center" items={[() => (
                        <Button variant="tertiary" onPress={onBack} label={backToReviewLabel} />
                    )]} />
                )] : []),
            ]} />
        )
    }

    return (
        <Container
            identity={{ tier: "block", component: "FlashcardQuizResult" }}
            size="md"
            padding={{ base: { x: 5, y: 6 }, sm: { x: 6 } }}
            body={() => <StackV gap={6} items={[header, body]} />}
        />
    )
}
