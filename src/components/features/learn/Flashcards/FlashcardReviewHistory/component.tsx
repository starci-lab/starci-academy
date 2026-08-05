"use client"

import React, { useMemo, useState } from "react"
import { CardsIcon, ClockCounterClockwiseIcon, ClockIcon } from "@phosphor-icons/react"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import { SurfaceCard } from "@/components/composites/cards/SurfaceCard"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { LabeledAccordionCard } from "@/components/blocks/cards/LabeledAccordionCard"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { TabsCard } from "@/components/blocks/navigation/TabsCard"
import { ProgressMeter } from "@/components/blocks/stats/ProgressMeter"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { Button } from "@/components/atoms/buttons/Button"
import { Chip } from "@/components/atoms/chips/Chip"
import { Typography } from "@/components/atoms/text/Typography"
import { Input } from "@/components/atoms/forms/Input"
import { StackV, StackH } from "@/components/frames/Stack"
import type { QueryFlashcardReviewHistoryItem } from "@/modules/api/graphql/queries/types/my-flashcard-review-history"
import { groupByTimeBucket } from "../historyBuckets"

/** This component's own `data-tier`/`data-component` identity (split.md — "identity is `data-tier` + `data-component`"). */
const IDENTITY = { tier: "block", component: "FlashcardReviewHistory" } as const

/** How the run list is grouped: by deck (accordion) or by time bucket. */
export type FlashcardReviewHistoryGroupMode = "deck" | "time"

/** How many placeholder rows the co-located skeleton shows while the first page loads. */
const SKELETON_ROW_COUNT = 4

/** The completion bar reads success at/above this reviewed-ratio, else warning. */
const STRONG_COMPLETION_RATIO = 0.8

/**
 * All display text, already localized by the connected `FlashcardReviewHistory`; a story
 * passes i18n keys. A few members are FUNCTIONS rather than plain strings — `cardCount` /
 * `xp` / `deckRunCount` / `timeBucket` / `runCount` interpolate PER ROW or PER GROUP, so a
 * single resolved string (the shape every other label in this system takes) cannot carry
 * them; the connected file still owns every `t()` call, it just hands down a resolver
 * instead of a value.
 */
export interface FlashcardReviewHistoryLabels {
    errorTitle: string
    retry: string
    emptyTitle: string
    emptyDescription: string
    emptyAction: string
    searchPlaceholder: string
    groupByDeck: string
    groupByTime: string
    filterEmpty: string
    loadMore: string
    /** Per-row "reviewed/total" caption. */
    cardCount: (reviewedCount: number, cardCount: number) => string
    /** Per-row XP chip text. */
    xp: (xpEarned: number) => string
    /** "N runs" — used both for the search result count and per-deck-group count. */
    deckRunCount: (count: number) => string
    /** Resolves a {@link TimeBucketKey} into its heading. */
    timeBucket: (key: string) => string
    /** "N runs" caption trailing a time-bucket heading. */
    runCount: (count: number) => string
}

/** Props for {@link _FlashcardReviewHistory} — presentational; all data resolved, no fetch/store/i18n. */
export interface FlashcardReviewHistoryProps {
    /** Runs fetched so far (accumulated across "load more" pages), `updatedAt DESC`. */
    items: Array<QueryFlashcardReviewHistoryItem>
    /** Total run count across every page — gates the "load more" button. */
    totalCount: number
    /** First load, nothing in hand → the whole tree shimmers in place (co-located). Owned by the connected file. */
    isSkeleton?: boolean
    /** Settled with zero runs at all → the empty message. */
    isEmpty?: boolean
    /** Truthy → the error message (beats loading + empty). The connected file passes its settled fetch error. */
    error?: unknown
    /** Retry handler — paired with `labels.retry` to show a retry button on the error branch. */
    onRetry?: () => void
    /** Fetches the next offset-paginated page. */
    onLoadMore: () => void
    /** True while a "load more" page is in flight — disables the load-more button. */
    isLoadingMore?: boolean
    /** Formats an ISO timestamp in the viewer's locale (medium date style) — resolved by the connected file so this stays store-free. */
    formatDate: (iso: string) => string
    /** Deep-links a run's deck into its reviewer. */
    onOpenDeck: (deckId: string) => void
    /** Jumps the overview tab strip back to the study overview (empty-state action). */
    onStartReview?: () => void
    labels: FlashcardReviewHistoryLabels
}

/**
 * "Study cards" run history — the presentational half of {@link FlashcardReviewHistory}, composed
 * on the tier-correct vocabulary (`Input.Search` / `TabsCard` / `LabeledAccordionCard` /
 * `LabeledCard` / `SurfaceListCard` / `ProgressMeter`). Three states in the fixed order
 * error → skeleton → empty → content (`loading-and-skeleton.md`): `error` falls to the shared
 * `AsyncContentError` frame, `isEmpty` (once settled) to `AsyncContentEmpty`, and otherwise the
 * ONE toolbar+list tree renders with `isSkeleton` threaded to every leaf that carries it.
 *
 * `TabsCard` / `LabeledAccordionCard` / `LabeledCard` / `ProgressMeter` carry no `isSkeleton` of
 * their own (missingSkeletonSupport) — their loading state is mirrored MINIMALLY, right where
 * they sit, with `Skeleton.*` instead of a parallel tree elsewhere in the file.
 *
 * @param props - {@link FlashcardReviewHistoryProps}
 */
export const _FlashcardReviewHistory = ({
    items,
    totalCount,
    isSkeleton = false,
    isEmpty = false,
    error,
    onRetry,
    onLoadMore,
    isLoadingMore = false,
    formatDate,
    onOpenDeck,
    onStartReview,
    labels,
}: FlashcardReviewHistoryProps) => {
    const [query, setQuery] = useState("")
    const [groupMode, setGroupMode] = useState<FlashcardReviewHistoryGroupMode>("deck")

    // search filters the loaded runs by deck title (client-side over already-fetched
    // items — no BE change; the deck title is already in the response).
    const searchedItems = useMemo(() => {
        const needle = query.trim().toLowerCase()
        if (!needle) {
            return items
        }
        return items.filter((item) => item.deckTitle.toLowerCase().includes(needle))
    }, [items, query])

    // group runs by deck — the same deck reviewed multiple times otherwise scatters
    // across the flat timeline. `items` is already `updatedAt DESC` and `Map` preserves
    // first-seen order, so a group's position = its MOST RECENT run — no re-sort needed.
    const groupedByDeck = useMemo(() => {
        const groups = new Map<string, { deckId: string, deckTitle: string, items: Array<QueryFlashcardReviewHistoryItem> }>()
        for (const item of searchedItems) {
            const existing = groups.get(item.deckId)
            if (existing) {
                existing.items.push(item)
            } else {
                groups.set(item.deckId, { deckId: item.deckId, deckTitle: item.deckTitle, items: [item] })
            }
        }
        return Array.from(groups.values())
    }, [searchedItems])

    const timeBuckets = useMemo(
        () => groupByTimeBucket(searchedItems, (item) => item.updatedAt),
        [searchedItems],
    )

    // error beats a stale loading flag; empty only once settled (loading-and-skeleton.md §1).
    if (error) {
        return <AsyncContentError identity={IDENTITY} title={labels.errorTitle} onRetry={onRetry} retryLabel={labels.retry} />
    }
    if (!isSkeleton && isEmpty) {
        return (
            <AsyncContentEmpty
                identity={IDENTITY}
                icon={ClockCounterClockwiseIcon}
                title={labels.emptyTitle}
                description={labels.emptyDescription}
                action={onStartReview ? () => (
                    <Button label={labels.emptyAction} variant="secondary" size="sm" onPress={onStartReview} />
                ) : undefined}
            />
        )
    }

    /** Shared row body — `showDeck` puts the deck title on the primary line (time
     *  grouping, where the deck isn't the group header), else the date leads. */
    const runRow = (item: QueryFlashcardReviewHistoryItem, showDeck: boolean) => {
        const ratio = item.cardCount > 0 ? item.reviewedCount / item.cardCount : 0
        const cardCountLabel = labels.cardCount(item.reviewedCount, item.cardCount)
        return (
            <StackH gap={3} items={[
                () => (
                    <StackV gap={1} classNames={["min-w-0", "flex-1"]} items={[
                        () => <Typography size="sm" truncate text={showDeck ? item.deckTitle : formatDate(item.updatedAt)} />,
                        () => <Typography size="xs" color="muted" truncate text={showDeck ? `${formatDate(item.updatedAt)} · ${cardCountLabel}` : cardCountLabel} />,
                        () => (
                            <ProgressMeter
                                value={item.reviewedCount}
                                max={Math.max(item.cardCount, 1)}
                                color={ratio >= STRONG_COMPLETION_RATIO ? "success" : "warning"}
                                className="max-w-[220px]"
                            />
                        ),
                    ]} />
                ),
                ...(item.xpEarned > 0 ? [() => (
                    <Chip tone="warning" text={labels.xp(item.xpEarned)} classNames={["shrink-0"]} />
                )] : []),
            ]} />
        )
    }

    // Toolbar: search decks (left) + run count and grouping toggle (right). `TabsCard`
    // carries no `isSkeleton` of its own — its loading state mirrors it inline with a bare
    // `Skeleton`, right where it sits (missingSkeletonSupport), instead of a parallel tree.
    const toolbar = (
        <StackH gap={3} justify="between" at="sm" items={[
            () => (
                <Input.Search
                    isSkeleton={isSkeleton}
                    ariaLabel={labels.searchPlaceholder}
                    placeholder={labels.searchPlaceholder}
                    value={query}
                    onValueChange={setQuery}
                    classNames={["w-full"]}
                />
            ),
            () => (
                <StackH gap={3} classNames={["shrink-0"]} items={[
                    () => <Typography size="sm" color="muted" isSkeleton={isSkeleton} text={labels.deckRunCount(searchedItems.length)} />,
                    () => (isSkeleton ? (
                        <Skeleton className="h-9 w-16 rounded-medium" />
                    ) : (
                        <TabsCard
                            variant="primary"
                            leftTabs={{
                                selectedKey: groupMode,
                                ariaLabel: labels.groupByDeck,
                                onSelectionChange: (key) => setGroupMode(String(key) as FlashcardReviewHistoryGroupMode),
                                items: [
                                    {
                                        key: "deck",
                                        label: <CardsIcon className="size-5" aria-label={labels.groupByDeck} focusable="false" />,
                                    },
                                    {
                                        key: "time",
                                        label: <ClockIcon className="size-5" aria-label={labels.groupByTime} focusable="false" />,
                                    },
                                ],
                            }}
                        />
                    )),
                ]} />
            ),
        ]} />
    )

    // Flat placeholder rows — the loading state's list shape, regardless of `groupMode`
    // (the real grouped shape isn't known yet). `SurfaceListCard`/`SurfaceListCardItem` are
    // reused as-is (their own chrome carries no data), only the row CONTENT swaps to `Skeleton.*`.
    const listSkeleton = (
        <SurfaceListCard>
            {Array.from({ length: SKELETON_ROW_COUNT }, (_unused, index) => (
                <SurfaceListCardItem key={index}>
                    <StackH gap={3} items={[
                        () => (
                            <StackV gap={1} classNames={["min-w-0", "flex-1"]} items={[
                                () => <Skeleton.Typography type="body-sm" width="1/2" />,
                                () => <Skeleton.Typography type="body-xs" width="1/3" />,
                                () => <Skeleton.ProgressBar className="max-w-[220px]" />,
                            ]} />
                        ),
                        () => <Skeleton className="h-6 w-12 shrink-0 rounded-full" />,
                    ]} />
                </SurfaceListCardItem>
            ))}
        </SurfaceListCard>
    )

    const body = isSkeleton ? listSkeleton : searchedItems.length === 0 ? (
        <SurfaceCard body={() => <Typography size="sm" color="muted" align="center" text={labels.filterEmpty} />} />
    ) : groupMode === "deck" ? (
        // group=deck — NO `label` (the toolbar's group toggle is the heading); "N runs"
        // rides in the header via `titleEnd`, panel = that deck's runs.
        <LabeledAccordionCard
            items={groupedByDeck.map((group) => ({
                id: group.deckId,
                title: group.deckTitle,
                titleEnd: (
                    <Typography size="xs" color="muted" classNames={["shrink-0"]} text={labels.deckRunCount(group.items.length)} />
                ),
                body: (
                    <StackV gap={1} items={group.items.map((item) => () => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => onOpenDeck(item.deckId)}
                            className="rounded-lg px-2 py-2 text-left transition-colors hover:bg-default"
                        >
                            {runRow(item, false)}
                        </button>
                    ))} />
                ),
            }))}
        />
    ) : (
        // group=time — each non-empty bucket is a `LabeledCard frameless` (time window =
        // label OUTSIDE + run count via `labelEnd`; content is itself a `SurfaceListCard`
        // → frameless avoids card-in-card).
        <StackV gap={3} items={timeBuckets.map((bucket) => () => (
            <LabeledCard
                frameless
                subtleLabel
                label={labels.timeBucket(bucket.key)}
                labelEnd={labels.runCount(bucket.items.length)}
            >
                <SurfaceListCard>
                    {bucket.items.map((item) => (
                        <SurfaceListCardItem key={item.id} onPress={() => onOpenDeck(item.deckId)}>
                            {runRow(item, true)}
                        </SurfaceListCardItem>
                    ))}
                </SurfaceListCard>
            </LabeledCard>
        ))} />
    )

    const showLoadMore = !isSkeleton && items.length < totalCount

    return (
        <StackV gap={3} identity={IDENTITY} items={[
            () => toolbar,
            () => body,
            ...(showLoadMore ? [() => (
                <Button
                    variant="secondary"
                    size="sm"
                    classNames={["self-center"]}
                    isDisabled={isLoadingMore}
                    onPress={onLoadMore}
                    label={labels.loadMore}
                />
            )] : []),
        ]} />
    )
}
