import React, { type ComponentType } from "react"
import type { ReactNode } from "react"
import { ArrowRightIcon, ChartLineUpIcon } from "@phosphor-icons/react"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { SectionCard } from "@/components/blocks/cards/SectionCard"
import { SurfaceListCard, SurfaceListCardRow } from "@/components/blocks/cards/SurfaceListCard"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { VerdictHeroCard, type VerdictHeroBand } from "@/components/blocks/stats/VerdictHeroCard"
import { RelatedContentList } from "@/components/blocks/learn/RelatedContentList"
import { Button } from "@/components/atoms/buttons/Button"
import { Chip } from "@/components/atoms/chips/Chip"
import { Typography } from "@/components/atoms/text/Typography"
import { Box } from "@/components/frames/Box"
import { StackH, StackV } from "@/components/frames/Stack"

/** Retention band BY VALUE — drives `VerdictHeroCard`'s color + every retention chip here. */
export const retentionColorOf = (percent: number): VerdictHeroBand =>
    percent < 50 ? "danger" : percent < 75 ? "warning" : "success"

/** Below this many lifetime reviews the aggregates are noise — mirrors
 *  `FlashcardStatsStrip`'s own `RETENTION_MIN_REVIEWS` gate constant. */
export const RETENTION_MIN_REVIEWS = 5

/** Healthy-memory retention mark the hero meter aims at (`stats-insight-redesign`
 *  proposal — FE-side constant; the BE intentionally has no such column). */
export const RETENTION_TARGET = 85

/** How many placeholder rows the co-located skeleton shows for the weak-topics list. */
const WEAK_TOPIC_SKELETON_ROW_COUNT = 4

/** One worst-first weak topic — chip text already resolved (interpolated) by the connected half. */
export interface FlashcardReviewWeakTag {
    /** Topic/tag name. */
    tag: string
    /** Retention percentage for this tag. */
    retention: number
    /** Already-translated `"{retention}% recall"` chip text. */
    chipLabel: string
}

/** All display text, already localized by the connected `FlashcardReviewStats`; a story passes i18n keys. */
export interface FlashcardReviewStatsLabels {
    errorTitle: string
    retry: string
    emptyTitle: string
    emptyDescription: string
    emptyAction: string
    memoryHealthLabel: string
    /** Rich verdict sentence (embeds a `<b>`) — already picked BY BAND and resolved. */
    verdict: ReactNode
    /** Evidence caption under the verdict — already interpolated (retention/target). */
    sub: string
    /** CTA label — already picked BY BAND ("ease off new cards" vs "review weakest deck"). */
    cta: string
    /** "Well-learned cards (mature)" + its caption, already joined with a line break. */
    matureSplitLabel: ComponentType
    /** "New cards (young)" + its caption, already joined with a line break. */
    youngSplitLabel: ComponentType
    weakTopicMapLabel: string
    studyHeading: string
}

/** Props for {@link _FlashcardReviewStats} — presentational; all data resolved, no fetch/store/i18n. */
export interface FlashcardReviewStatsProps {
    /** First load, nothing in hand → the whole tree shimmers in place (co-located). Owned by the connected file. */
    isSkeleton?: boolean
    /** Settled with fewer than `RETENTION_MIN_REVIEWS` lifetime reviews → the empty message. */
    isEmpty?: boolean
    /** Truthy → the error message (beats loading + empty). The connected file passes its settled fetch error. */
    error?: unknown
    /** Retry handler — paired with `labels.retry` to show a retry button on the error branch. */
    onRetry?: () => void
    /** Jumps the overview tab strip back to the study overview (empty-state action). */
    onStartReview?: () => void
    /** Course-scoped lifetime retention — the hero card's headline value. */
    retentionRate?: number
    matureRetention?: number
    youngRetention?: number
    /** Every attempted tag, already ranked worst-first, chip text pre-resolved. */
    weakTags?: Array<FlashcardReviewWeakTag>
    /** Deck to drill from a CTA — the lowest-retention deck, else the top leech card's own deck. */
    weakestDeckId?: string | null
    /** Already-resolved "Review \"{tag}\" (weakest)" CTA — `undefined` hides the button (no deck to drill). */
    weakTopicDrillCta?: string
    /** Already-resolved "Overall average is …" caption — `undefined` hides the caption. */
    weakTopicAvgCaption?: string
    /** Opens a deck's reviewer — the single onward action every row/CTA here shares. */
    onOpenDeck: (deckId: string) => void
    /** Course id for the RAG study-suggestions child. */
    courseId: string
    /** Course display id — omitted (as in a story) → the self-fetching study zone is skipped. */
    displayId?: string
    labels: FlashcardReviewStatsLabels
}

/**
 * "Study Cards" aggregate stats — the presentational half of {@link FlashcardReviewStats},
 * insight-first (verdict → evidence → action, `stats-canonical-fold`): (1) memory-health hero
 * (mature/young split vs target), (2) full weak-topic map worst-first, (3) passive RAG study
 * suggestions. Four states in the fixed order error → loading → empty → content: `error` falls
 * to the shared `AsyncContentError` frame, `isEmpty` to `AsyncContentEmpty`, and otherwise the
 * tree renders with `isSkeleton` threaded to every leaf that supports it
 * (loading-and-skeleton.md). `VerdictHeroCard`/`SectionCard`/`LabeledCard`/`SurfaceListCard`
 * carry no `isSkeleton` of their own — the hero zone swaps to a hand-mirrored `Skeleton.*` tree
 * in the SAME position while shimmering (its headline `value` is a plain number, not a slot a
 * shimmer can sit in); the weak-topic rows instead feed `Skeleton`/atom-`isSkeleton` content
 * straight through `SurfaceListCardRow`'s own `title`/`meta` slots. See `tiers/split.md` — the
 * connected `index.tsx` owns the fetch, the band decision, and i18n.
 *
 * @param props - {@link FlashcardReviewStatsProps}
 */
export const _FlashcardReviewStats = ({
    isSkeleton = false,
    isEmpty = false,
    error,
    onRetry,
    onStartReview,
    retentionRate = 0,
    matureRetention = 0,
    youngRetention = 0,
    weakTags = [],
    weakestDeckId = null,
    weakTopicDrillCta,
    weakTopicAvgCaption,
    onOpenDeck,
    courseId,
    displayId,
    labels,
}: FlashcardReviewStatsProps) => {
    // error → skeleton → empty → content (BLOCK-8): error beats a stale loading flag; the empty
    // and error surfaces are the shared `AsyncContent*` frames, not hand-written JSX (§6).
    if (error) {
        return <AsyncContentError title={labels.errorTitle} onRetry={onRetry} retryLabel={labels.retry} />
    }
    if (!isSkeleton && isEmpty) {
        return (
            <AsyncContentEmpty
                icon={ChartLineUpIcon}
                title={labels.emptyTitle}
                description={labels.emptyDescription}
                action={onStartReview ? () => (
                    <Button label={labels.emptyAction} variant="secondary" size="sm" onPress={onStartReview} />
                ) : undefined}
            />
        )
    }

    // band drives VerdictHeroCard's color coding — computed presentationally from the same
    // value the connected half already used (via the same pure function) to pick its text keys.
    const band = retentionColorOf(retentionRate)

    // ZONE 2 rows — `title`/`meta` are buildable slots now (never a pre-rendered element), so a
    // shimmering placeholder can no longer smuggle a `Typography isSkeleton` through `title`; it
    // hand-mirrors the row's own `p-3` + meta-pushed-right shape instead (the row itself has no
    // `isSkeleton`). Otherwise every attempted tag worst-first.
    const gapRows = isSkeleton
        ? Array.from({ length: WEAK_TOPIC_SKELETON_ROW_COUNT }, (_unused, index) => (
            <div key={`pending-${index}`} className="flex items-center gap-3 p-3">
                <Skeleton.Typography type="body-sm" width="1/3" />
                <Box principles={["push-end"]} className="ml-auto shrink-0">
                    <Skeleton.Chip />
                </Box>
            </div>
        ))
        : weakTags.map((tagStat) => (
            <SurfaceListCardRow
                key={tagStat.tag}
                title={tagStat.tag}
                meta={() => <Chip tone={retentionColorOf(tagStat.retention)} text={tagStat.chipLabel} />}
            />
        ))
    const showGap = isSkeleton || gapRows.length > 0
    // action row (drill CTA + avg caption) shows while shimmering (placeholder) or once either
    // resolved string is present.
    const showActionRow = isSkeleton || Boolean(weakTopicDrillCta) || Boolean(weakTopicAvgCaption)

    return (
        <StackV gap={6} items={[
            // ZONE 1 — "Memory health" hero (◎ vs target). `VerdictHeroCard` has no `isSkeleton`
            // of its own — while shimmering this swaps to a hand-mirrored `Skeleton.*` tree in
            // the exact same position instead (missingSkeletonSupport).
            () => (
                <LabeledCard label={labels.memoryHealthLabel} frameless>
                    {isSkeleton ? (
                        <SectionCard>
                            <StackV gap={4} items={[
                                () => (
                                    <StackH gap={2} align="baseline" items={[
                                        () => <Skeleton className="h-9 w-20 rounded" />,
                                        () => <Skeleton className="h-[14px] w-6 rounded" />,
                                    ]} />
                                ),
                                () => <Skeleton.Typography type="body-sm" width="3/4" />,
                                () => <Skeleton.Typography type="body-xs" width="1/2" />,
                                () => <Skeleton.ProgressBar />,
                                () => (
                                    <Box className="overflow-hidden rounded-2xl border border-default">
                                        <StackH gap={1} align="stretch" divider items={[
                                            () => (
                                                <StackV gap={2} padding={4} classNames={["flex-1"]} items={[
                                                    () => <Skeleton.Typography type="body-xs" width="2/3" />,
                                                    () => <Skeleton className="h-5 w-14 rounded" />,
                                                ]} />
                                            ),
                                            () => (
                                                <StackV gap={2} padding={4} classNames={["flex-1"]} items={[
                                                    () => <Skeleton.Typography type="body-xs" width="2/3" />,
                                                    () => <Skeleton className="h-5 w-14 rounded" />,
                                                ]} />
                                            ),
                                        ]} />
                                    </Box>
                                ),
                                () => <Skeleton.Button width="w-40" />,
                            ]} />
                        </SectionCard>
                    ) : (
                        <VerdictHeroCard
                            value={retentionRate}
                            unit="%"
                            band={band}
                            verdict={labels.verdict}
                            sub={labels.sub}
                            meter={{ value: retentionRate, max: 100, target: RETENTION_TARGET }}
                            splits={[
                                {
                                    label: labels.matureSplitLabel,
                                    value: `${matureRetention}%`,
                                    band: retentionColorOf(matureRetention),
                                },
                                {
                                    label: labels.youngSplitLabel,
                                    value: `${youngRetention}%`,
                                    band: retentionColorOf(youngRetention),
                                },
                            ]}
                            action={weakestDeckId ? () => (
                                <Button
                                    variant="primary"
                                    size="sm"
                                    suffixIcon={ArrowRightIcon}
                                    label={labels.cta}
                                    onPress={() => onOpenDeck(weakestDeckId)}
                                />
                            ) : undefined}
                        />
                    )}
                </LabeledCard>
            ),

            // ZONE 2 — "Weak points by topic" (▽ split by tag, → drill CTA). FULL worst-first
            // list. Card's main content is a LIST → a labeled list-surface-card (LabeledCard
            // frameless → SurfaceListCard); the drill CTA + avg caption live OUTSIDE the card
            // (buttons never inside a list card).
            ...(showGap ? [() => (
                <StackV gap={4} items={[
                    () => (
                        <LabeledCard label={labels.weakTopicMapLabel} frameless>
                            <SurfaceListCard>{gapRows}</SurfaceListCard>
                        </LabeledCard>
                    ),
                    ...(showActionRow ? [() => (
                        <StackV gap={3} items={[
                            ...(isSkeleton ? [() => (
                                <Skeleton.Button width="w-44" className="self-start" />
                            )] : weakTopicDrillCta && weakestDeckId ? [() => (
                                <Button
                                    variant="primary"
                                    size="sm"
                                    suffixIcon={ArrowRightIcon}
                                    label={weakTopicDrillCta}
                                    onPress={() => onOpenDeck(weakestDeckId)}
                                    classNames={["self-start"]}
                                />
                            )] : []),
                            ...(isSkeleton ? [() => (
                                <Skeleton.Typography type="body-xs" width="2/3" />
                            )] : weakTopicAvgCaption ? [() => (
                                <Typography size="xs" color="muted" text={weakTopicAvgCaption} />
                            )] : []),
                        ]} />
                    )] : []),
                ]} />
            )] : []),

            // ZONE 3 — passive RAG "Study suggestions": weak tags → course-wide content search
            // (self-hiding when there's nothing weak / no match). Needs the slug for result
            // deep links, so it waits on `displayId`; hidden while shimmering (it fetches its
            // own state).
            ...(!isSkeleton && displayId ? [() => (
                <RelatedContentList
                    courseId={courseId}
                    courseDisplayId={displayId}
                    query={weakTags.map((tagStat) => tagStat.tag).join(" ")}
                    label={labels.studyHeading}
                />
            )] : []),
        ]} />
    )
}
