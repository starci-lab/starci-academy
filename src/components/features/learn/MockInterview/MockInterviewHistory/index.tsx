"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { Badge, Button, Card, CardContent, Chip, Popover, Typography, cn } from "@heroui/react"
import { CaretRightIcon, FunnelIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { EmptyState } from "@/components/blocks/feedback/EmptyState"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { SurfaceListCard, SurfaceListCardRow, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { SearchInput } from "@/components/blocks/form/SearchInput"
import { FlexWrapButtonRadio } from "@/components/blocks/navigation/FlexWrapButtonRadio"
import { useQueryMyMockInterviewAttemptsSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyMockInterviewAttemptsSwr"
import { groupByTimeBucket } from "../../Flashcards/historyBuckets"
import { sessionDisplayName } from "@/modules/utils/session-display-name"
import { pathConfig } from "@/resources/path"
import type { MockInterviewAttemptItem } from "@/modules/api/graphql/queries/types/my-mock-interview-attempts"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link MockInterviewHistory}. */
export interface MockInterviewHistoryProps extends WithClassNames<undefined> {
    /** Course whose mock-interview history to list. */
    courseId: string
    /** Course display id, for the scorecard result deep link. */
    courseDisplayId: string
    /** Jumps the setup tab strip back to "Bắt đầu" (empty-state action). */
    onStartInterview?: () => void
}

/** History items fetched per "load more" page. */
const PAGE_SIZE = 10

/** The mode filter's fixed option order — "all" first, then the 2 top-level modes. */
type HistoryModeFilter = "all" | "qna" | "design"

/** Verdict → chip color (đạt / cận / chưa đạt) — mirrors {@link MockInterviewScorecard}'s convention. */
const verdictColorOf = (verdict: string): "success" | "warning" | "danger" =>
    verdict === "pass" ? "success" : verdict === "borderline" ? "warning" : "danger"

/**
 * The viewer's past mock-interview sessions for this course, newest first — the
 * setup screen's "Lịch sử" tab. Mirrors the WORKING Flashcard history exactly
 * (thầy 2026-07-17): fetch ALL modes then filter CLIENT-side (mode facet behind a
 * funnel + search by prompt title), accumulate pages with a `previousCourseIdRef`
 * guard (only a real course change resets — NOT a mere remount), group runs by
 * TIME BUCKET (hôm nay / 7 ngày / 30 ngày / cũ hơn), and a "load more" button.
 * Each row opens the read-only scorecard. Server-side `mode` paging was dropped —
 * it desynced `totalCount` from a cleared `items` (count said 12 while the list
 * read empty).
 * @param props - {@link MockInterviewHistoryProps}
 */
export const MockInterviewHistory = ({ courseId, courseDisplayId, onStartInterview, className }: MockInterviewHistoryProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()

    const [offset, setOffset] = useState(0)
    const [items, setItems] = useState<Array<MockInterviewAttemptItem>>([])
    const [totalCount, setTotalCount] = useState(0)
    const [modeFilter, setModeFilter] = useState<HistoryModeFilter>("all")
    const [search, setSearch] = useState("")
    const [filterOpen, setFilterOpen] = useState(false)

    // fetch ALL modes (no server-side mode filter) — the mode facet narrows the
    // loaded rows client-side, exactly like Flashcard history.
    const attemptsSwr = useQueryMyMockInterviewAttemptsSwr(courseId, PAGE_SIZE, offset)

    // accumulate pages as `offset` advances ("load more").
    useEffect(() => {
        const data = attemptsSwr.data
        if (!data) {
            return
        }
        setItems((previous) => (offset === 0 ? data.items : [...previous, ...data.items]))
        setTotalCount(data.totalCount)
    }, [attemptsSwr.data, offset])

    // course changed → start the accumulator over. Guarded against firing on mere
    // MOUNT (the setup tab remounts this component; an unguarded reset would wipe
    // the `items` the data-effect just set from SWR's warm cache — see
    // FlashcardReviewHistory for the same fix).
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

    // only offer a mode the loaded history actually contains — no dead facet.
    const presentModes = useMemo(
        () => Array.from(new Set(items.map((item) => item.mode))),
        [items],
    )
    const filteredItems = useMemo(() => {
        const needle = search.trim().toLowerCase()
        return items.filter((item) =>
            (modeFilter === "all" || item.mode === modeFilter)
            && (!needle || item.promptTitle.toLowerCase().includes(needle)),
        )
    }, [items, modeFilter, search])

    // group filtered runs by time window (thầy 2026-07-17 "render lịch sử từng ngày")
    const timeBuckets = useMemo(
        () => groupByTimeBucket(filteredItems, (item) => item.createdAt),
        [filteredItems],
    )

    const hasFacets = presentModes.length > 1
    const activeFacetCount = modeFilter !== "all" ? 1 : 0
    const shownCount = search.trim() || activeFacetCount > 0 ? filteredItems.length : totalCount
    const hasMore = items.length < totalCount

    /** One attempt row → opens the read-only scorecard result. Primary line is the
     *  learner's own session name (or its time-based fallback, see
     *  `sessionDisplayName`); the drawn prompt + date move to the subtitle so
     *  neither is lost. */
    const renderRow = (attempt: MockInterviewAttemptItem) => (
        <SurfaceListCardRow
            key={attempt.id}
            title={sessionDisplayName(attempt.name, attempt.createdAt, t, locale)}
            subtitle={`${attempt.promptTitle} · ${formatDate(attempt.createdAt)}`}
            meta={(
                <Chip size="sm" variant="soft" color={verdictColorOf(attempt.verdict)}>
                    <Chip.Label>{attempt.overallScore}</Chip.Label>
                </Chip>
            )}
            trailing={<CaretRightIcon weight="bold" className="size-4 text-muted" aria-hidden focusable="false" />}
            onPress={() => router.push(
                pathConfig()
                    .locale(locale)
                    .course(courseDisplayId)
                    .learn()
                    .mockInterview()
                    .interview(attempt.sessionId)
                    .result()
                    .build(),
            )}
        />
    )

    return (
        <AsyncContent
            isLoading={attemptsSwr.isLoading && items.length === 0}
            skeleton={(
                // MIRROR the loaded tree: a funnel toolbar (search + funnel button + count)
                // above a SurfaceListCard of attempt rows (name/subtitle + verdict score
                // chip + caret).
                <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                            <Skeleton className="h-9 min-w-0 flex-1 rounded-medium" />
                            <Skeleton className="size-9 shrink-0 rounded-medium" />
                        </div>
                        <Skeleton className="h-[14px] w-16 shrink-0 rounded" />
                    </div>
                    <SurfaceListCard>
                        {Array.from({ length: 4 }).map((_unused, index) => (
                            <SurfaceListCardItem key={index}>
                                <div className="flex items-center gap-3">
                                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                                        <Skeleton.Typography type="body-sm" width="1/2" />
                                        <Skeleton.Typography type="body-xs" width="1/3" />
                                    </div>
                                    <Skeleton className="h-6 w-10 shrink-0 rounded-full" />
                                    <Skeleton className="size-4 shrink-0 rounded" />
                                </div>
                            </SurfaceListCardItem>
                        ))}
                    </SurfaceListCard>
                </div>
            )}
            error={items.length === 0 ? attemptsSwr.error : undefined}
            errorContent={{
                title: t("mockInterview.historyError"),
                onRetry: () => void attemptsSwr.mutate(),
                retryLabel: t("mockInterview.promptsRetry"),
            }}
        >
            {items.length === 0 ? (
                // no attempts at all → a single bounded empty card (matches the
                // populated SurfaceListCard shape; components/card.md §2).
                <Card className={className}>
                    <CardContent>
                        <EmptyState
                            title={t("mockInterview.historyEmpty")}
                            action={onStartInterview ? (
                                <Button size="sm" variant="secondary" onPress={onStartInterview}>
                                    {t("mockInterview.begin")}
                                </Button>
                            ) : undefined}
                        />
                    </CardContent>
                </Card>
            ) : (
                <div className={cn("flex flex-col gap-3", className)}>
                    {/* toolbar: search (prompt title) + FUNNEL popover (mode facet) + count */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                            <SearchInput
                                className="min-w-0 flex-1"
                                value={search}
                                onValueChange={setSearch}
                                placeholder={t("mockInterview.historySearchPlaceholder")}
                            />
                            {hasFacets ? (
                                <Popover isOpen={filterOpen} onOpenChange={setFilterOpen}>
                                    <Button
                                        isIconOnly
                                        variant="ghost"
                                        aria-label={t("mockInterview.historyFilterButton")}
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
                                            <div className="flex flex-col gap-2">
                                                <Typography type="body-xs" color="muted">{t("mockInterview.historyFilterHeading")}</Typography>
                                                <FlexWrapButtonRadio<HistoryModeFilter>
                                                    ariaLabel={t("mockInterview.historyFilterHeading")}
                                                    value={modeFilter}
                                                    onChange={setModeFilter}
                                                    items={[
                                                        { value: "all", content: t("mockInterview.historyFilterAll") },
                                                        { value: "qna", content: t("mockInterview.historyFilterQna") },
                                                        { value: "design", content: t("mockInterview.historyFilterDesign") },
                                                    ]}
                                                />
                                            </div>
                                            {activeFacetCount > 0 ? (
                                                <Button variant="danger-soft" size="sm" className="self-start" onPress={() => setModeFilter("all")}>
                                                    {t("mockInterview.historyClearFilters")}
                                                </Button>
                                            ) : null}
                                        </div>
                                    </Popover.Content>
                                </Popover>
                            ) : null}
                        </div>
                        <Typography type="body-sm" color="muted" className="shrink-0">
                            {t("mockInterview.historyCount", { count: shownCount })}
                        </Typography>
                    </div>

                    {filteredItems.length === 0 ? (
                        // filter/search excluded everything — keep the bounded-card shape.
                        <Card>
                            <CardContent>
                                <Typography type="body-sm" color="muted" align="center" className="py-6">
                                    {t("mockInterview.historyEmptyFiltered")}
                                </Typography>
                            </CardContent>
                        </Card>
                    ) : (
                        // group by time window — each non-empty bucket is a `LabeledCard frameless`
                        // (time window = label OUTSIDE + run count via `labelEnd`; content = a
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
                                        {bucket.items.map((attempt) => renderRow(attempt))}
                                    </SurfaceListCard>
                                </LabeledCard>
                            ))}
                        </div>
                    )}

                    {hasMore ? (
                        <Button
                            variant="secondary"
                            size="sm"
                            className="self-center"
                            isDisabled={attemptsSwr.isLoading}
                            onPress={() => setOffset((previous) => previous + PAGE_SIZE)}
                        >
                            {t("mockInterview.historyLoadMore")}
                        </Button>
                    ) : null}
                </div>
            )}
        </AsyncContent>
    )
}
