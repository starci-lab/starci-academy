"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import useSWR from "swr"
import { Badge, Button, Card, CardContent, Chip, Popover, Typography, cn } from "@heroui/react"
import { CaretDownIcon, ClockCounterClockwiseIcon, FunnelIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { EmptyState } from "@/components/blocks/feedback/EmptyState"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { FlexWrapButtonRadio } from "@/components/blocks/navigation/FlexWrapButtonRadio"
import { SearchInput } from "@/components/blocks/form/SearchInput"
import { SkeletonListRow } from "@/components/blocks/skeleton/Skeleton/ListRow"
import { queryMyFlashcardQuizHistory } from "@/modules/api/graphql/queries/query-my-flashcard-quiz-history"
import type { QueryFlashcardQuizHistoryItem, QueryFlashcardQuizWeakTag } from "@/modules/api/graphql/queries/types/my-flashcard-quiz-history"
import { groupByTimeBucket } from "../../historyBuckets"
import { LEVEL_COLOR } from "../../constants"
import { sessionDisplayName } from "@/modules/utils/session-display-name"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { useAppSelector } from "@/redux/hooks"
import { pathConfig } from "@/resources/path"

/** Props for {@link FlashcardQuizHistory}. */
export interface FlashcardQuizHistoryProps extends WithClassNames<undefined> {
    /** Course whose quick-quiz ("Hỏi nhanh") history to list. */
    courseId: string
    /** Jumps the setup tab strip back to "Bắt đầu" — wired from `InterviewSession`
     *  so the empty state's action can start a fresh run without this component
     *  owning the tab switcher itself. */
    onStartQuiz?: () => void
}

/** History items fetched per "load more" page. */
const PAGE_SIZE = 10

/** Score (correctCount/cardCount) → color, mirrors FlashcardQuizStats' coverageColorOf. */
const scoreColorOf = (ratio: number): "success" | "warning" | "danger" =>
    ratio >= 0.8 ? "success" : ratio >= 0.6 ? "warning" : "danger"

/**
 * "Hỏi nhanh" run history — the setup screen's "Lịch sử" tab. A one-line toolbar
 * (thầy 2026-07-17: bỏ 2 hàng chip lọc inline, dồn vào SEARCH + PHỄU như profile
 * challenges): a `SearchInput` filters runs by weak-tag name (client-side), and the
 * mode/level facets live behind a `FunnelIcon` popover. Offset-paginated ("load
 * more"), each row shows its score (correctCount/cardCount) and expands inline to
 * reveal that run's weakest tags (with a "review lesson" deep link when the
 * deck→lesson mapping was unambiguous).
 * @param props - {@link FlashcardQuizHistoryProps}
 */
export const FlashcardQuizHistory = ({ courseId, onStartQuiz, className }: FlashcardQuizHistoryProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const displayId = useAppSelector((state) => state.course.displayId)
    const learn = pathConfig().locale(locale).course(displayId).learn()
    const genericHref = learn.module().build()

    const [offset, setOffset] = useState(0)
    const [items, setItems] = useState<Array<QueryFlashcardQuizHistoryItem>>([])
    const [totalCount, setTotalCount] = useState(0)
    const [expandedId, setExpandedId] = useState<string | null>(null)
    // client-side filters over already-fetched `items` (mode/level are already
    // fetched per item, no BE change needed). "all" sentinel instead of `null`
    // since `FlexWrapButtonRadio<T>` requires a non-nullable string value.
    const [modeFilter, setModeFilter] = useState<"all" | string>("all")
    const [levelFilter, setLevelFilter] = useState<"all" | string>("all")
    // free-text search over each run's WEAK TAGS (the only searchable text a run
    // carries — a run has no title/deck) — thầy 2026-07-17 chốt "search thật theo weak-tag".
    const [search, setSearch] = useState("")
    const [filterOpen, setFilterOpen] = useState(false)

    const historySwr = useSWR(
        ["flashcard-quiz-history", courseId, offset],
        async () => {
            const response = await queryMyFlashcardQuizHistory({
                request: { courseId, limit: PAGE_SIZE, offset },
            })
            return response.data?.myFlashcardQuizHistory.data ?? null
        },
    )

    // accumulate pages as `offset` advances ("load more"); a fresh `courseId`
    // resets the accumulator (guarded by the effect below).
    useEffect(() => {
        const data = historySwr.data
        if (!data) {
            return
        }
        setItems((previous) => (offset === 0 ? data.items : [...previous, ...data.items]))
        setTotalCount(data.totalCount)
    }, [historySwr.data, offset])

    // course changed → start the accumulator over. Guarded against firing on
    // mere MOUNT (this tab is unmounted/remounted by the parent's tab switch;
    // an unguarded version fires on every remount too since `courseId` is
    // "new" to a fresh effect subscription, wiping the `items` this same
    // render's data-effect had JUST populated from SWR's still-warm cache —
    // see FlashcardReviewHistory for the same fix).
    const previousCourseIdRef = useRef(courseId)
    useEffect(() => {
        if (previousCourseIdRef.current === courseId) {
            return
        }
        previousCourseIdRef.current = courseId
        setOffset(0)
        setItems([])
    }, [courseId])

    // only offer a facet for a mode/level that actually appears in the loaded
    // history — no dead filters for values this course never produced.
    const presentModes = useMemo(
        () => Array.from(new Set(items.map((item) => item.mode))),
        [items],
    )
    const presentLevels = useMemo(
        () => Array.from(new Set(items.flatMap((item) => (item.level ? [item.level] : [])))),
        [items],
    )
    const filteredItems = useMemo(() => {
        const needle = search.trim().toLowerCase()
        return items.filter((item) =>
            (modeFilter === "all" || item.mode === modeFilter)
            && (levelFilter === "all" || item.level === levelFilter)
            && (!needle || item.weakTags.some((tag) => tag.tag.toLowerCase().includes(needle))),
        )
    }, [items, modeFilter, levelFilter, search])

    // group the filtered runs by time window — quiz sessions have no deck, so time
    // is the meaningful grouping axis. Buckets come already ordered/non-empty.
    const timeBuckets = useMemo(
        () => groupByTimeBucket(filteredItems, (item) => item.updatedAt),
        [filteredItems],
    )

    // facet visibility + active-count (drives the funnel badge); only show the funnel
    // at all when there's a facet worth narrowing by.
    const hasModeFacet = presentModes.length > 1
    const hasLevelFacet = presentLevels.length > 1
    const hasFacets = hasModeFacet || hasLevelFacet
    const activeFacetCount = (modeFilter !== "all" ? 1 : 0) + (levelFilter !== "all" ? 1 : 0)
    const clearFacets = () => {
        setModeFilter("all")
        setLevelFilter("all")
    }
    const shownCount = search.trim() || activeFacetCount > 0 ? filteredItems.length : totalCount

    const resolveHref = (tag: QueryFlashcardQuizWeakTag): string =>
        (tag.moduleId && tag.contentId
            ? learn.module(tag.moduleId).content(tag.contentId).build()
            : tag.moduleId
                ? learn.module(tag.moduleId).build()
                : null) ?? genericHref

    /** One run row — press toggles its weak-tag panel. Rendered inside each time
     *  bucket's `SurfaceListCard`. */
    const renderRow = (item: QueryFlashcardQuizHistoryItem) => {
        const expanded = expandedId === item.id
        const coveragePercent = item.coverage !== null ? Math.round(item.coverage * 100) : null
        const scoreRatio = item.cardCount > 0 ? item.correctCount / item.cardCount : 0
        return (
            <SurfaceListCardItem
                key={item.id}
                onPress={() => setExpandedId(expanded ? null : item.id)}
            >
                <div className="flex items-center gap-3">
                    <div className="flex min-w-0 flex-1 flex-col gap-0">
                        {/* primary line is the learner's own session name (or its
                            time-based fallback, see `sessionDisplayName`) — was the
                            raw completion date, which the fallback still encodes. */}
                        <Typography type="body-sm" weight="medium" truncate>
                            {sessionDisplayName(item.name, item.updatedAt, t, locale)}
                        </Typography>
                        <Typography type="body-xs" color="muted" truncate>
                            {t(item.mode === "deep" ? "flashcard.quiz.modeDeep" : "flashcard.quiz.modeQuick")}
                            {" · "}
                            {t("flashcard.quiz.quizHistoryCardCount", { count: item.cardCount })}
                        </Typography>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                        {item.level ? (
                            <Chip size="sm" variant="soft" color={LEVEL_COLOR[item.level] ?? "default"}>
                                {t(`flashcard.level.${item.level}`)}
                            </Chip>
                        ) : null}
                        {coveragePercent !== null ? (
                            <Chip size="sm" variant="soft" color="default">
                                {t("flashcard.quiz.weakTagCoverage", { percent: coveragePercent })}
                            </Chip>
                        ) : null}
                        {item.xpEarned > 0 ? (
                            <Chip size="sm" variant="soft" color="warning">
                                {t("flashcard.quiz.xpToast", { xp: item.xpEarned })}
                            </Chip>
                        ) : null}
                        <Chip size="sm" variant="soft" color={scoreColorOf(scoreRatio)}>
                            {`${item.correctCount}/${item.cardCount}`}
                        </Chip>
                        <CaretDownIcon
                            className={cn("size-4 text-muted transition-transform", expanded && "rotate-180")}
                            weight="bold"
                            aria-hidden
                            focusable="false"
                        />
                    </div>
                </div>
                {expanded ? (
                    <div className="mt-3 flex flex-col gap-2 border-t border-divider pt-3">
                        {item.weakTags.length === 0 ? (
                            <Typography type="body-xs" color="muted">
                                {t("flashcard.quiz.weakTagsEmpty")}
                            </Typography>
                        ) : (
                            item.weakTags.map((tag) => (
                                <button
                                    key={tag.tag}
                                    type="button"
                                    onClick={(event) => {
                                        event.stopPropagation()
                                        router.push(resolveHref(tag))
                                    }}
                                    className="group flex items-center justify-between gap-3 rounded-xl border border-default bg-default px-3 py-2 text-left"
                                >
                                    <Typography type="body-xs" weight="medium" className="truncate underline-offset-4 decoration-[var(--separator-tertiary)] group-hover:underline">
                                        {tag.tag}
                                    </Typography>
                                    <Typography type="body-xs" color="muted" className="shrink-0">
                                        {t("flashcard.quiz.weakTagCoverage", { percent: Math.round(tag.coverage * 100) })}
                                    </Typography>
                                </button>
                            ))
                        )}
                    </div>
                ) : null}
            </SurfaceListCardItem>
        )
    }

    return (
        <AsyncContent
            isLoading={historySwr.isLoading && items.length === 0}
            skeleton={(
                <div className="flex flex-col gap-3">
                    <SkeletonListRow withTrailing />
                    <SkeletonListRow withTrailing />
                    <SkeletonListRow withTrailing />
                </div>
            )}
            error={items.length === 0 ? historySwr.error : undefined}
            errorContent={{
                title: t("flashcard.quiz.quizHistoryError"),
                onRetry: () => { void historySwr.mutate() },
                retryLabel: t("flashcard.quiz.retry"),
            }}
        >
            {items.length === 0 ? (
                // `EmptyState` intentionally omits its own frame — the populated
                // sibling below is a real `SurfaceListCard` (bounded card), so the
                // empty state needs the same card shape to match (see
                // `components/card.md` "frameless-section-empty-state-needs-card").
                <Card className={className}>
                    <CardContent>
                        <EmptyState
                            icon={<ClockCounterClockwiseIcon aria-hidden focusable="false" />}
                            title={t("flashcard.quiz.quizHistoryEmptyTitle")}
                            description={t("flashcard.quiz.quizHistoryEmptyDescription")}
                            action={onStartQuiz ? (
                                <Button size="sm" variant="secondary" onPress={onStartQuiz}>
                                    {t("flashcard.quiz.quizHistoryEmptyAction")}
                                </Button>
                            ) : undefined}
                        />
                    </CardContent>
                </Card>
            ) : (
                <div className={cn("flex flex-col gap-3", className)}>
                    {/* toolbar: search (weak-tag) + FUNNEL popover (mode/level facets) + count —
                        one clean line, mirrors ProfileChallengeManage (thầy 2026-07-17: bỏ 2 hàng
                        chip inline, dồn vào search + phễu). */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                            <SearchInput
                                className="min-w-0 flex-1"
                                value={search}
                                onValueChange={setSearch}
                                placeholder={t("flashcard.quiz.quizHistorySearchPlaceholder")}
                            />
                            {hasFacets ? (
                                <Popover isOpen={filterOpen} onOpenChange={setFilterOpen}>
                                    <Button
                                        isIconOnly
                                        variant="ghost"
                                        aria-label={t("flashcard.quiz.quizHistoryFilterButton")}
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
                                        <div className="flex flex-col gap-3 p-3">
                                            {hasModeFacet ? (
                                                <div className="flex flex-col gap-2">
                                                    <Typography type="body-xs" color="muted">{t("flashcard.quiz.quizHistoryModeHeading")}</Typography>
                                                    <FlexWrapButtonRadio
                                                        ariaLabel={t("flashcard.quiz.quizHistoryFilterMode")}
                                                        value={modeFilter}
                                                        onChange={setModeFilter}
                                                        items={[
                                                            { value: "all", content: t("flashcard.quiz.quizHistoryFilterAll") },
                                                            ...presentModes.map((mode) => ({
                                                                value: mode,
                                                                content: t(mode === "deep" ? "flashcard.quiz.modeDeep" : "flashcard.quiz.modeQuick"),
                                                            })),
                                                        ]}
                                                    />
                                                </div>
                                            ) : null}
                                            {hasLevelFacet ? (
                                                <div className="flex flex-col gap-2">
                                                    <Typography type="body-xs" color="muted">{t("flashcard.quiz.quizHistoryLevelHeading")}</Typography>
                                                    <FlexWrapButtonRadio
                                                        ariaLabel={t("flashcard.quiz.quizHistoryFilterLevel")}
                                                        value={levelFilter}
                                                        onChange={setLevelFilter}
                                                        items={[
                                                            { value: "all", content: t("flashcard.quiz.quizHistoryFilterAll") },
                                                            ...presentLevels.map((level) => ({
                                                                value: level,
                                                                content: t(`flashcard.level.${level}`),
                                                            })),
                                                        ]}
                                                    />
                                                </div>
                                            ) : null}
                                            {activeFacetCount > 0 ? (
                                                <Button variant="danger-soft" size="sm" className="self-start" onPress={clearFacets}>
                                                    {t("flashcard.quiz.quizHistoryClearFilters")}
                                                </Button>
                                            ) : null}
                                        </div>
                                    </Popover.Content>
                                </Popover>
                            ) : null}
                        </div>
                        <Typography type="body-sm" color="muted" className="shrink-0">
                            {t("flashcard.runCount", { count: shownCount })}
                        </Typography>
                    </div>

                    {filteredItems.length === 0 ? (
                        // filter/search excluded everything — keep the SAME bounded-card shape as the
                        // populated `SurfaceListCard` sibling (không để message trần cạnh 1 card,
                        // `components/card.md` §2 frameless-section-empty-state-needs-card).
                        <Card>
                            <CardContent>
                                <Typography type="body-sm" color="muted" align="center" className="py-6">
                                    {t("flashcard.quiz.quizHistoryFilterEmpty")}
                                </Typography>
                            </CardContent>
                        </Card>
                    ) : (
                        // group by time window — each non-empty bucket is a `LabeledCard frameless`
                        // (time window = label OUTSIDE + run count via `labelEnd`; content is a
                        // `SurfaceListCard` → frameless, no card-in-card).
                        <div className="flex flex-col gap-3">
                            {timeBuckets.map((bucket) => (
                                <LabeledCard
                                    key={bucket.key}
                                    frameless
                                    subtleLabel
                                    label={t(`flashcard.timeBucket.${bucket.key}`)}
                                    labelEnd={t("flashcard.runCount", { count: bucket.items.length })}
                                >
                                    <SurfaceListCard>
                                        {bucket.items.map((item) => renderRow(item))}
                                    </SurfaceListCard>
                                </LabeledCard>
                            ))}
                        </div>
                    )}
                    {items.length < totalCount ? (
                        <Button
                            variant="secondary"
                            size="sm"
                            className="self-center"
                            isDisabled={historySwr.isLoading}
                            onPress={() => setOffset((previous) => previous + PAGE_SIZE)}
                        >
                            {t("flashcard.quiz.quizHistoryLoadMore")}
                        </Button>
                    ) : null}
                </div>
            )}
        </AsyncContent>
    )
}
