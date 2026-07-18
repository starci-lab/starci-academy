"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import useSWR from "swr"
import { Accordion, Button, Card, CardContent, Chip, Input, TextField, Typography, cn } from "@heroui/react"
import { CardsIcon, ClockCounterClockwiseIcon, ClockIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { EmptyState } from "@/components/blocks/feedback/EmptyState"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { ProgressMeter } from "@/components/blocks/stats/ProgressMeter"
import { TabsCard } from "@/components/blocks/navigation/TabsCard"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { queryMyFlashcardReviewHistory } from "@/modules/api/graphql/queries/query-my-flashcard-review-history"
import type { QueryFlashcardReviewHistoryItem } from "@/modules/api/graphql/queries/types/my-flashcard-review-history"
import { groupByTimeBucket } from "../historyBuckets"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { useAppSelector } from "@/redux/hooks"
import { pathConfig } from "@/resources/path"

/** Props for {@link FlashcardReviewHistory}. */
export interface FlashcardReviewHistoryProps extends WithClassNames<undefined> {
    /** Course whose "Học thẻ" review session history to list. */
    courseId: string
    /** Jumps the overview tab strip back to the study overview — wired from
     *  `Flashcards` so the empty state's action can start reviewing without
     *  this component owning the tab switcher itself. */
    onStartReview?: () => void
}

/** History items fetched per "load more" page. */
const PAGE_SIZE = 10

/** How the run list is grouped: by deck (accordion) or by time bucket. */
type GroupMode = "deck" | "time"

/** The completion bar reads success at/above this reviewed-ratio, else warning. */
const STRONG_COMPLETION_RATIO = 0.8

/**
 * "Học thẻ" run history — the study overview's "Lịch sử" tab. A search + grouping
 * toolbar over the run log (thầy 2026-07-13 relayout: "không có thanh search gì hết
 * à" — history's job is finding + revisiting a past run). Search filters by deck
 * title; a `TabsCard` (primary) toggles grouping by deck (accordion) vs by time
 * bucket (today / past-7d / past-30d / older). Each run row carries a `ProgressMeter`
 * of `reviewedCount/cardCount` so "how well that run went" is scannable. Offset-
 * paginated ("load more"); each row deep-links back into that deck's reviewer.
 * @param props - {@link FlashcardReviewHistoryProps}
 */
export const FlashcardReviewHistory = ({ courseId, onStartReview, className }: FlashcardReviewHistoryProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const displayId = useAppSelector((state) => state.course.displayId)

    const [offset, setOffset] = useState(0)
    const [items, setItems] = useState<Array<QueryFlashcardReviewHistoryItem>>([])
    const [totalCount, setTotalCount] = useState(0)
    const [query, setQuery] = useState("")
    const [groupMode, setGroupMode] = useState<GroupMode>("deck")

    const historySwr = useSWR(
        ["flashcard-review-history", courseId, offset],
        async () => {
            const response = await queryMyFlashcardReviewHistory({
                request: { courseId, limit: PAGE_SIZE, offset },
            })
            return response.data?.myFlashcardReviewHistory.data ?? null
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
    // mere MOUNT (thầy 2026-07-13: "chuyển tab cái thì mất hết" — this tab is
    // unmounted/remounted by the parent's tab switch; the previous unguarded
    // version fired on every remount too since `courseId` is "new" to a fresh
    // effect subscription, wiping the `items` this same render's data-effect
    // had JUST populated from SWR's still-warm cache — a real state-loss bug,
    // not just a data problem).
    const previousCourseIdRef = useRef(courseId)
    useEffect(() => {
        if (previousCourseIdRef.current === courseId) {
            return
        }
        previousCourseIdRef.current = courseId
        setOffset(0)
        setItems([])
    }, [courseId])

    const formatDate = (iso: string) =>
        new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(iso))

    // search filters the loaded runs by deck title (client-side over already-fetched
    // items — no BE change; the deck title is already in the response).
    const searchedItems = useMemo(() => {
        const needle = query.trim().toLowerCase()
        if (!needle) {
            return items
        }
        return items.filter((item) => item.deckTitle.toLowerCase().includes(needle))
    }, [items, query])

    // group runs by deck (thầy 2026-07-13: "redesign lại, có thể theo deck") — the
    // same deck reviewed multiple times otherwise scatters across the flat
    // timeline. `items` is already `updatedAt DESC` and `Map` preserves first-seen
    // order, so a group's position = its MOST RECENT run — no re-sort needed.
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

    const goToDeck = (deckId: string) => router.push(
        pathConfig().locale(locale).course(displayId).learn().flashcards().review(deckId).build(),
    )

    /** Shared row body — `showDeck` puts the deck title on the primary line (time
     *  grouping, where the deck isn't the group header), else the date leads. */
    const runRow = (item: QueryFlashcardReviewHistoryItem, showDeck: boolean) => {
        const ratio = item.cardCount > 0 ? item.reviewedCount / item.cardCount : 0
        const cardCountLabel = t("flashcard.review.historyCardCount", {
            reviewedCount: item.reviewedCount,
            cardCount: item.cardCount,
        })
        return (
            <div className="flex items-center gap-3">
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <Typography type="body-sm" truncate>
                        {showDeck ? item.deckTitle : formatDate(item.updatedAt)}
                    </Typography>
                    <Typography type="body-xs" color="muted" truncate>
                        {showDeck ? `${formatDate(item.updatedAt)} · ${cardCountLabel}` : cardCountLabel}
                    </Typography>
                    <ProgressMeter
                        value={item.reviewedCount}
                        max={Math.max(item.cardCount, 1)}
                        color={ratio >= STRONG_COMPLETION_RATIO ? "success" : "warning"}
                        className="max-w-[220px]"
                    />
                </div>
                {item.xpEarned > 0 ? (
                    <Chip size="sm" variant="soft" color="warning" className="shrink-0">
                        {t("flashcard.quiz.xpToast", { xp: item.xpEarned })}
                    </Chip>
                ) : null}
            </div>
        )
    }

    return (
        <AsyncContent
            isLoading={historySwr.isLoading && items.length === 0}
            skeleton={(
                // MIRROR the loaded tree: a toolbar (search + count + deck/time toggle)
                // above a SurfaceListCard of run rows (deck/date + card-count + a
                // reviewed-ratio ProgressMeter, xp chip trailing).
                <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <Skeleton className="h-9 w-full rounded-medium sm:max-w-xs" />
                        <div className="flex shrink-0 items-center gap-3">
                            <Skeleton className="h-[14px] w-16 rounded" />
                            <Skeleton className="h-9 w-16 rounded-medium" />
                        </div>
                    </div>
                    <SurfaceListCard>
                        {Array.from({ length: 4 }).map((_unused, index) => (
                            <SurfaceListCardItem key={index}>
                                <div className="flex items-center gap-3">
                                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                                        <Skeleton.Typography type="body-sm" width="1/2" />
                                        <Skeleton.Typography type="body-xs" width="1/3" />
                                        <Skeleton.ProgressBar className="max-w-[220px]" />
                                    </div>
                                    <Skeleton className="h-6 w-12 shrink-0 rounded-full" />
                                </div>
                            </SurfaceListCardItem>
                        ))}
                    </SurfaceListCard>
                </div>
            )}
            error={items.length === 0 ? historySwr.error : undefined}
            errorContent={{
                title: t("flashcard.review.historyError"),
                onRetry: () => { void historySwr.mutate() },
                retryLabel: t("flashcard.review.retry"),
            }}
        >
            {items.length === 0 ? (
                // `EmptyState` intentionally omits its own frame — the populated
                // sibling below is a real bounded card, so the empty state needs the
                // same card shape to match (`components/card.md` §2 frameless-empty).
                <Card className={className}>
                    <CardContent>
                        <EmptyState
                            icon={<ClockCounterClockwiseIcon aria-hidden focusable="false" />}
                            title={t("flashcard.review.historyEmptyTitle")}
                            description={t("flashcard.review.historyEmptyDescription")}
                            action={onStartReview ? (
                                <Button size="sm" variant="secondary" onPress={onStartReview}>
                                    {t("flashcard.review.historyEmptyAction")}
                                </Button>
                            ) : undefined}
                        />
                    </CardContent>
                </Card>
            ) : (
                <div className={cn("flex flex-col gap-3", className)}>
                    {/* Toolbar: search decks (left) + run count and grouping toggle (right) —
                        the history surface's find-a-run affordance (thầy 2026-07-13 relayout). */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <TextField className="w-full sm:max-w-xs">
                            <Input
                                type="search"
                                aria-label={t("flashcard.review.historySearchPlaceholder")}
                                placeholder={t("flashcard.review.historySearchPlaceholder")}
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                            />
                        </TextField>
                        <div className="flex shrink-0 items-center gap-3">
                            <Typography type="body-sm" color="muted">
                                {t("flashcard.review.historyDeckRunCount", { count: searchedItems.length })}
                            </Typography>
                            {/* icon-only toggle (thầy 2026-07-13: "render dạng icon") —
                                mirrors `FlashcardDeckList`'s grid/line `TabsCard` (primary):
                                icon carries the accessible name via `aria-label`. */}
                            <TabsCard
                                variant="primary"
                                leftTabs={{
                                    selectedKey: groupMode,
                                    ariaLabel: t("flashcard.review.historyGroupByDeck"),
                                    onSelectionChange: (key) => setGroupMode(String(key) as GroupMode),
                                    items: [
                                        {
                                            key: "deck",
                                            label: (
                                                <CardsIcon
                                                    className="size-5"
                                                    aria-label={t("flashcard.review.historyGroupByDeck")}
                                                    focusable="false"
                                                />
                                            ),
                                        },
                                        {
                                            key: "time",
                                            label: (
                                                <ClockIcon
                                                    className="size-5"
                                                    aria-label={t("flashcard.review.historyGroupByTime")}
                                                    focusable="false"
                                                />
                                            ),
                                        },
                                    ],
                                }}
                            />
                        </div>
                    </div>

                    {searchedItems.length === 0 ? (
                        <Card>
                            <CardContent>
                                <Typography type="body-sm" color="muted" align="center" className="py-6">
                                    {t("flashcard.review.historyFilterEmpty")}
                                </Typography>
                            </CardContent>
                        </Card>
                    ) : groupMode === "deck" ? (
                        // group=deck — each deck is a real `Accordion.Item` (trigger + caret +
                        // "N lượt", panel = that deck's runs), same pattern as `CourseCurriculum`
                        // (`components/card.md` §3 Accordion Card).
                        <Accordion variant="surface" className="overflow-hidden shadow-surface">
                            {groupedByDeck.map((group) => (
                                <Accordion.Item key={group.deckId} aria-label={group.deckTitle}>
                                    <Accordion.Heading>
                                        <Accordion.Trigger>
                                            <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                                                <Typography type="body-sm" weight="medium" truncate className="min-w-0">
                                                    {group.deckTitle}
                                                </Typography>
                                                <Typography type="body-xs" color="muted" className="shrink-0">
                                                    {t("flashcard.review.historyDeckRunCount", { count: group.items.length })}
                                                </Typography>
                                            </div>
                                        </Accordion.Trigger>
                                    </Accordion.Heading>
                                    <Accordion.Panel>
                                        <Accordion.Body>
                                            <div className="flex flex-col gap-1">
                                                {group.items.map((item) => (
                                                    <button
                                                        key={item.id}
                                                        type="button"
                                                        onClick={() => goToDeck(item.deckId)}
                                                        className="rounded-lg px-2 py-2 text-left transition-colors hover:bg-default"
                                                    >
                                                        {runRow(item, false)}
                                                    </button>
                                                ))}
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Panel>
                                </Accordion.Item>
                            ))}
                        </Accordion>
                    ) : (
                        // group=time — each non-empty bucket is a `LabeledCard frameless`
                        // (time window = label OUTSIDE + run count via `labelEnd`; content is
                        // itself a `SurfaceListCard` → frameless avoids card-in-card). Titled
                        // block → LabeledCard, KHÔNG Typography-label + card tay (thầy
                        // 2026-07-13: "mấy cái này phải là Label Card"; `components/card.md` §2).
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
                                        {bucket.items.map((item) => (
                                            <SurfaceListCardItem key={item.id} onPress={() => goToDeck(item.deckId)}>
                                                {runRow(item, true)}
                                            </SurfaceListCardItem>
                                        ))}
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
                            {t("flashcard.review.historyLoadMore")}
                        </Button>
                    ) : null}
                </div>
            )}
        </AsyncContent>
    )
}
