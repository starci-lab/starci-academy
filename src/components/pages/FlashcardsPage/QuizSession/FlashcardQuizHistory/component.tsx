"use client"

import React, { useMemo, useState } from "react"
import { Badge, Button, Card, CardContent, Chip, Popover, Typography, cn } from "@heroui/react"
import { CaretDownIcon, ClockCounterClockwiseIcon, FunnelIcon } from "@phosphor-icons/react"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import { Button as PrimitiveButton } from "@/components/atoms/buttons/Button"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { FlexWrapButtonRadio } from "@/components/blocks/navigation/FlexWrapButtonRadio"
import { SearchInput } from "@/components/blocks/form/SearchInput"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { StackH, StackV } from "@/components/frames/Stack"
import { Box } from "@/components/frames/Box"
import { groupByTimeBucket, type TimeBucketKey } from "@/modules/utils/history-buckets"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** How many placeholder rows the co-located skeleton shows while shimmering. */
const SKELETON_ROW_COUNT = 4

/** Score (correctCount/cardCount) → color. */
const scoreColorOf = (ratio: number): "success" | "warning" | "danger" =>
    ratio >= 0.8 ? "success" : ratio >= 0.6 ? "warning" : "danger"

/** Chip color domain for a run's level badge — mirrors `LEVEL_COLOR` plus its "no level" fallback. */
export type FlashcardQuizHistoryLevelColor = "success" | "warning" | "danger" | "accent" | "default"

/** One weak tag on a resolved row — already localized, with its deep-link `href` resolved. */
export interface FlashcardQuizHistoryWeakTag {
    /** The tag/topic label (raw — also matched against the search box). */
    tag: string
    /** Already-translated "NN% coverage" text. */
    coverageLabel: string
    /** Deep link into the module/content the tag maps to, or the generic module fallback. */
    href: string
}

/** One completed quiz run, fully resolved for render: text translated, filter fields kept raw. */
export interface FlashcardQuizHistoryRow {
    /** Session id — React key + expand-toggle identity. */
    id: string
    /** ISO timestamp — feeds {@link groupByTimeBucket} (not itself rendered). */
    updatedAt: string
    /** The learner's own session name, or its time-based fallback (`sessionDisplayName`). */
    displayName: string
    /** Raw quiz mode ("deep" | "quick" | …) — filtered against, not rendered directly. */
    mode: string
    /** Already-translated "mode · N cards" subtitle line. */
    subtitle: string
    /** Raw difficulty level, or `null` — filtered against, not rendered directly. */
    level: string | null
    /** Already-translated level chip text; omitted when `level` is `null`. */
    levelLabel?: string
    /** Level chip color (`LEVEL_COLOR` lookup, `"default"` when no level). */
    levelColor: FlashcardQuizHistoryLevelColor
    /** Already-translated "NN% coverage" chip text; omitted when the session has no coverage. */
    coverageLabel?: string
    /** Already-translated "+N XP" chip text; omitted when no XP was earned. */
    xpLabel?: string
    /** Cards answered fully correct. */
    correctCount: number
    /** Cards drawn for this session. */
    cardCount: number
    /** Weakest tags this session, ranked worst-first. */
    weakTags: Array<FlashcardQuizHistoryWeakTag>
}

/** All display text, already localized by the connected `FlashcardQuizHistory`; a story passes i18n keys. */
export interface FlashcardQuizHistoryLabels {
    errorTitle: string
    retry: string
    emptyTitle: string
    emptyDescription: string
    emptyAction: string
    searchPlaceholder: string
    filterButtonAria: string
    modeHeading: string
    modeFilterAria: string
    levelHeading: string
    levelFilterAria: string
    filterAll: string
    clearFilters: string
    filterEmptyMessage: string
    weakTagsEmpty: string
    loadMore: string
}

/** Props for {@link _FlashcardQuizHistory} — presentational; all data resolved, no fetch/store/i18n. */
export interface FlashcardQuizHistoryProps extends WithClassNames<undefined> {
    /** First load, nothing in hand → the whole tree shimmers in place (co-located). Owned by the connected file. */
    isSkeleton?: boolean
    /** Settled with zero runs → the empty message. */
    isEmpty?: boolean
    /** Truthy → the error message (beats loading + empty). The connected file passes its settled fetch error. */
    error?: unknown
    /** Retry handler — paired with `labels.retry` to show a retry button on the error branch. */
    onRetry?: () => void
    /** Jumps the setup tab strip back to "Start" — the empty state's action, when the caller wired one. */
    onStartQuiz?: () => void
    /** Every run loaded so far (all pages accumulated), fully resolved. */
    rows: Array<FlashcardQuizHistoryRow>
    /** Total runs matching the query (for the "load more" affordance). */
    totalCount: number
    /** `rows.length < totalCount` — whether another page is available. */
    hasMore: boolean
    /** True while a page fetch (initial or "load more") is in flight — disables the load-more button. */
    isLoadingMore?: boolean
    /** Fired when "load more" is pressed. */
    onLoadMore: () => void
    /** Fired with a weak tag's resolved `href` when its row is pressed. */
    onTagPress: (href: string) => void
    /** Raw mode value → already-translated label, for the mode facet's options. */
    modeLabelOf: Record<string, string>
    /** Raw level value → already-translated label, for the level facet's options. */
    levelLabelOf: Record<string, string>
    /** Time-bucket key → already-translated label (all six buckets, translated once). */
    timeBucketLabelOf: Record<TimeBucketKey, string>
    /** Formats a run count into its already-translated "N runs" sentence — the count itself is a presentational (filtered) aggregate, so the string can't be pre-baked per row. */
    formatRunCount: (count: number) => string
    labels: FlashcardQuizHistoryLabels
}

/**
 * "Quick Quiz" run history — the presentational half of {@link FlashcardQuizHistory}, composed on
 * `SurfaceListCard`/`LabeledCard`/`SearchInput`/`FlexWrapButtonRadio`. Four states in the fixed order
 * error → loading → empty → content: `error` falls to the shared `AsyncContentError` frame, `isEmpty`
 * to `AsyncContentEmpty` (wrapped in the same bounded `Card` shape as the populated list, per
 * `components/card.md` "frameless-section-empty-state-needs-card"), and otherwise the toolbar + row
 * tree renders with `isSkeleton` threaded to every leaf so the shimmer mirrors the loaded shape
 * (loading-and-skeleton.md). None of `SearchInput`/`Popover`/`FlexWrapButtonRadio` carry their own
 * `isSkeleton`, so the toolbar's shimmer is a co-located `Skeleton.*` swap at the same leaf position
 * rather than a parallel tree (loading-and-skeleton.md §1 fallback). Client-side search/facet
 * filtering, row expansion, and the funnel popover are pure UI state owned here — they need no fetch,
 * store, or i18n. See `tiers/split.md` — the connected `index.tsx` owns the fetch, i18n, and navigation.
 *
 * @param props - {@link FlashcardQuizHistoryProps}
 */
export const _FlashcardQuizHistory = ({
    isSkeleton = false,
    isEmpty = false,
    error,
    onRetry,
    onStartQuiz,
    rows,
    totalCount,
    hasMore,
    isLoadingMore = false,
    onLoadMore,
    onTagPress,
    modeLabelOf,
    levelLabelOf,
    timeBucketLabelOf,
    formatRunCount,
    labels,
    className,
}: FlashcardQuizHistoryProps) => {
    const [expandedId, setExpandedId] = useState<string | null>(null)
    // client-side filters over already-fetched `rows` — "all" sentinel instead of `null`
    // since `FlexWrapButtonRadio<T>` requires a non-nullable string value.
    const [modeFilter, setModeFilter] = useState<"all" | string>("all")
    const [levelFilter, setLevelFilter] = useState<"all" | string>("all")
    // free-text search over each run's WEAK TAGS (the only searchable text a run carries).
    const [search, setSearch] = useState("")
    const [filterOpen, setFilterOpen] = useState(false)

    const presentModes = useMemo(() => Array.from(new Set(rows.map((row) => row.mode))), [rows])
    const presentLevels = useMemo(
        () => Array.from(new Set(rows.flatMap((row) => (row.level ? [row.level] : [])))),
        [rows],
    )
    const filteredRows = useMemo(() => {
        const needle = search.trim().toLowerCase()
        return rows.filter((row) =>
            (modeFilter === "all" || row.mode === modeFilter)
            && (levelFilter === "all" || row.level === levelFilter)
            && (!needle || row.weakTags.some((tag) => tag.tag.toLowerCase().includes(needle))),
        )
    }, [rows, modeFilter, levelFilter, search])

    // group the filtered runs by time window — quiz sessions have no deck, so time
    // is the meaningful grouping axis. Buckets come already ordered/non-empty.
    const timeBuckets = useMemo(
        () => groupByTimeBucket(filteredRows, (row) => row.updatedAt),
        [filteredRows],
    )

    const hasModeFacet = presentModes.length > 1
    const hasLevelFacet = presentLevels.length > 1
    const hasFacets = hasModeFacet || hasLevelFacet
    const activeFacetCount = (modeFilter !== "all" ? 1 : 0) + (levelFilter !== "all" ? 1 : 0)
    const clearFacets = () => {
        setModeFilter("all")
        setLevelFilter("all")
    }
    const shownCount = search.trim() || activeFacetCount > 0 ? filteredRows.length : totalCount

    /** One run row — press toggles its weak-tag panel. Rendered inside each time bucket's `SurfaceListCard`. */
    const renderRow = (row: FlashcardQuizHistoryRow) => {
        const expanded = expandedId === row.id
        const scoreRatio = row.cardCount > 0 ? row.correctCount / row.cardCount : 0
        return (
            <SurfaceListCardItem
                key={row.id}
                onPress={() => setExpandedId(expanded ? null : row.id)}
            >
                <StackH gap={4} principle="content-row" align="center" items={[
                    () => (
                        <StackV gap={1} classNames={["min-w-0", "flex-1"]} items={[
                            () => (
                                <Typography type="body-sm" weight="medium" truncate>
                                    {row.displayName}
                                </Typography>
                            ),
                            () => (
                                <Typography type="body-xs" color="muted" truncate>
                                    {row.subtitle}
                                </Typography>
                            ),
                        ]} />
                    ),
                    () => (
                        <StackH gap={3} principle="chip-row" align="center" classNames={["shrink-0"]} items={[
                            ...(row.levelLabel ? [() => (
                                <Chip key="level" size="sm" variant="soft" color={row.levelColor}>
                                    {row.levelLabel}
                                </Chip>
                            )] : []),
                            ...(row.coverageLabel ? [() => (
                                <Chip key="coverage" size="sm" variant="soft" color="default">
                                    {row.coverageLabel}
                                </Chip>
                            )] : []),
                            ...(row.xpLabel ? [() => (
                                <Chip key="xp" size="sm" variant="soft" color="warning">
                                    {row.xpLabel}
                                </Chip>
                            )] : []),
                            () => (
                                <Chip size="sm" variant="soft" color={scoreColorOf(scoreRatio)}>
                                    {`${row.correctCount}/${row.cardCount}`}
                                </Chip>
                            ),
                            () => (
                                <CaretDownIcon
                                    className={cn("size-4 text-muted transition-transform", expanded && "rotate-180")}
                                    weight="bold"
                                    aria-hidden
                                    focusable="false"
                                />
                            ),
                        ]} />
                    ),
                ]} />
                {expanded ? (
                    <Box className="mt-3 border-t border-divider pt-3">
                        <StackV
                            gap={3}
                            principle="sibling-stack"
                            items={row.weakTags.length === 0 ? [
                                () => (
                                    <Typography type="body-xs" color="muted">
                                        {labels.weakTagsEmpty}
                                    </Typography>
                                ),
                            ] : row.weakTags.map((tag) => () => (
                                <button
                                    key={tag.tag}
                                    type="button"
                                    onClick={(event) => {
                                        event.stopPropagation()
                                        onTagPress(tag.href)
                                    }}
                                    className="group w-full rounded-xl border border-default bg-default text-left"
                                >
                                    <StackH gap={4} principle="control-pad" padding={{ x: 4, y: 3 }} justify="between" align="center" items={[
                                        () => (
                                            <Typography type="body-xs" weight="medium" className="truncate underline-offset-4 decoration-[var(--separator-tertiary)] group-hover:underline">
                                                {tag.tag}
                                            </Typography>
                                        ),
                                        () => (
                                            <Typography type="body-xs" color="muted" className="shrink-0">
                                                {tag.coverageLabel}
                                            </Typography>
                                        ),
                                    ]} />
                                </button>
                            ))}
                        />
                    </Box>
                ) : null}
            </SurfaceListCardItem>
        )
    }

    // error beats a stale loading flag; empty only once settled (BLOCK-8, loading-and-skeleton.md).
    if (error) {
        return <AsyncContentError title={labels.errorTitle} onRetry={onRetry} retryLabel={labels.retry} />
    }
    if (!isSkeleton && isEmpty) {
        // `AsyncContentEmpty` omits its own frame (composites/feedback/EmptyState) — the populated
        // sibling below is a real `SurfaceListCard` (bounded card), so the empty state needs the same
        // card shape to match (`components/card.md` "frameless-section-empty-state-needs-card").
        return (
            <Card className={className}>
                <CardContent>
                    <AsyncContentEmpty
                        icon={ClockCounterClockwiseIcon}
                        title={labels.emptyTitle}
                        description={labels.emptyDescription}
                        action={onStartQuiz ? () => (
                            <PrimitiveButton label={labels.emptyAction} variant="secondary" size="sm" onPress={onStartQuiz} />
                        ) : undefined}
                    />
                </CardContent>
            </Card>
        )
    }

    // filter/search excluded everything — a DIFFERENT (secondary) empty state than the block's own
    // `isEmpty` above: there IS history, the active filters just hide all of it.
    const filteredEmpty = !isSkeleton && filteredRows.length === 0

    return (
        <Box className={className}>
            <StackV gap={4} items={[
                () => (
                    <StackH gap={4} principle="content-row" justify="between" at="sm" align="center" items={[
                        () => (
                            <StackH gap={4} principle="flex-action" align="center" classNames={["min-w-0", "flex-1"]} items={[
                                ...(isSkeleton ? [
                                    () => <Skeleton className="h-9 min-w-0 flex-1 rounded-medium" />,
                                    () => <Skeleton className="size-9 shrink-0 rounded-medium" />,
                                ] : [
                                    () => (
                                        <SearchInput
                                            className="min-w-0 flex-1"
                                            value={search}
                                            onValueChange={setSearch}
                                            placeholder={labels.searchPlaceholder}
                                        />
                                    ),
                                    ...(hasFacets ? [() => (
                                        <Popover isOpen={filterOpen} onOpenChange={setFilterOpen}>
                                            <Button
                                                isIconOnly
                                                variant="ghost"
                                                aria-label={labels.filterButtonAria}
                                                className="shrink-0"
                                            >
                                                {activeFacetCount > 0 ? (
                                                    <Badge.Anchor>
                                                        <FunnelIcon className="size-5" />
                                                        <Badge size="sm" color="accent" placement="top-left">{activeFacetCount}</Badge>
                                                    </Badge.Anchor>
                                                ) : (
                                                    <FunnelIcon className="size-5" />
                                                )}
                                            </Button>
                                            <Popover.Content className="w-72">
                                                <StackV gap={1} principle="cell-pad" padding={4} items={[() => (
                                                    <StackV gap={4} items={[
                                                        ...(hasModeFacet ? [() => (
                                                            <StackV gap={3} principle="label-field" items={[
                                                                () => <Typography type="body-xs" color="muted">{labels.modeHeading}</Typography>,
                                                                () => (
                                                                    <FlexWrapButtonRadio
                                                                        ariaLabel={labels.modeFilterAria}
                                                                        value={modeFilter}
                                                                        onChange={setModeFilter}
                                                                        items={[
                                                                            { value: "all", content: labels.filterAll },
                                                                            ...presentModes.map((mode) => ({
                                                                                value: mode,
                                                                                content: modeLabelOf[mode] ?? mode,
                                                                            })),
                                                                        ]}
                                                                    />
                                                                ),
                                                            ]} />
                                                        )] : []),
                                                        ...(hasLevelFacet ? [() => (
                                                            <StackV gap={3} principle="label-field" items={[
                                                                () => <Typography type="body-xs" color="muted">{labels.levelHeading}</Typography>,
                                                                () => (
                                                                    <FlexWrapButtonRadio
                                                                        ariaLabel={labels.levelFilterAria}
                                                                        value={levelFilter}
                                                                        onChange={setLevelFilter}
                                                                        items={[
                                                                            { value: "all", content: labels.filterAll },
                                                                            ...presentLevels.map((level) => ({
                                                                                value: level,
                                                                                content: levelLabelOf[level] ?? level,
                                                                            })),
                                                                        ]}
                                                                    />
                                                                ),
                                                            ]} />
                                                        )] : []),
                                                        ...(activeFacetCount > 0 ? [() => (
                                                            <Button variant="danger-soft" size="sm" className="self-start" onPress={clearFacets}>
                                                                {labels.clearFilters}
                                                            </Button>
                                                        )] : []),
                                                    ]} />
                                                )]} />
                                            </Popover.Content>
                                        </Popover>
                                    )] : []),
                                ]),
                            ]} />
                        ),
                        ...(isSkeleton ? [() => <Skeleton className="h-[14px] w-16 shrink-0 rounded" />] : [() => (
                            <Typography type="body-sm" color="muted" className="shrink-0">
                                {formatRunCount(shownCount)}
                            </Typography>
                        )]),
                    ]} />
                ),
                () => (
                    isSkeleton ? (
                        <SurfaceListCard>
                            {Array.from({ length: SKELETON_ROW_COUNT }).map((_unused, index) => (
                                <SurfaceListCardItem key={index}>
                                    <StackH gap={4} principle="content-row" align="center" items={[
                                        () => (
                                            <StackV gap={2} classNames={["min-w-0", "flex-1"]} items={[
                                                () => <Skeleton.Typography type="body-sm" width="1/2" />,
                                                () => <Skeleton.Typography type="body-xs" width="1/3" />,
                                            ]} />
                                        ),
                                        () => <Skeleton className="h-6 w-12 shrink-0 rounded-full" />,
                                        () => <Skeleton className="size-4 shrink-0 rounded" />,
                                    ]} />
                                </SurfaceListCardItem>
                            ))}
                        </SurfaceListCard>
                    ) : filteredEmpty ? (
                        <Card>
                            <CardContent>
                                <Box principle="page-pad" className="py-6">
                                    <Typography type="body-sm" color="muted" align="center">
                                        {labels.filterEmptyMessage}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    ) : (
                        <StackV gap={4} items={timeBuckets.map((bucket) => () => (
                            <LabeledCard
                                key={bucket.key}
                                frameless
                                subtleLabel
                                label={timeBucketLabelOf[bucket.key]}
                                labelEnd={formatRunCount(bucket.items.length)}
                            >
                                <SurfaceListCard>
                                    {bucket.items.map((row) => renderRow(row))}
                                </SurfaceListCard>
                            </LabeledCard>
                        ))} />
                    )
                ),
                ...(!isSkeleton && hasMore ? [() => (
                    <Button
                        variant="secondary"
                        size="sm"
                        className="self-center"
                        isDisabled={isLoadingMore}
                        onPress={onLoadMore}
                    >
                        {labels.loadMore}
                    </Button>
                )] : []),
            ]} />
        </Box>
    )
}
