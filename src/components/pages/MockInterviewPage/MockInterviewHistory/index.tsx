"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { Badge, Button, Card, CardContent, Chip, Popover, Typography } from "@heroui/react"
import { CaretRightIcon, FunnelIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { EmptyState } from "@/components/composites/feedback/EmptyState"
import { SurfaceCardList, type SurfaceCardListItem } from "@/components/composites/cards/SurfaceCard"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { SearchInput } from "@/components/blocks/form/SearchInput"
import { FlexWrapButtonRadio } from "@/components/blocks/navigation/FlexWrapButtonRadio"
import { Box } from "@/components/frames/Box"
import { StackH, StackV } from "@/components/frames/Stack"
import { useQueryMyMockInterviewAttemptsSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyMockInterviewAttemptsSwr"
import { groupByTimeBucket } from "@/modules/utils/history-buckets"
import { sessionDisplayName } from "@/modules/utils/session-display-name"
import { pathConfig } from "@/resources/path"
import type { MockInterviewAttemptItem } from "@/modules/api/graphql/queries/types/my-mock-interview-attempts"

/** Props for {@link MockInterviewHistory}. */
export interface MockInterviewHistoryProps {
    /** Course whose mock-interview history to list. */
    courseId: string
    /** Course display id, for the scorecard result deep link. */
    courseDisplayId: string
    /** Jumps the setup tab strip back to "Start" (empty-state action). */
    onStartInterview?: () => void
}

/** History items fetched per "load more" page. */
const PAGE_SIZE = 10

/** The mode filter's fixed option order — "all" first, then the 2 top-level modes. */
type HistoryModeFilter = "all" | "qna" | "design"

/** Verdict → chip color (pass / borderline / fail) — mirrors {@link MockInterviewScorecard}'s convention. */
const verdictColorOf = (verdict: string): "success" | "warning" | "danger" =>
    verdict === "pass" ? "success" : verdict === "borderline" ? "warning" : "danger"

/**
 * The viewer's past mock-interview sessions for this course, newest first — the
 * setup screen's "History" tab. Mirrors the WORKING Flashcard history exactly
 * (teacher, 2026-07-17): fetch ALL modes then filter CLIENT-side (mode facet behind a
 * funnel + search by prompt title), accumulate pages with a `previousCourseIdRef`
 * guard (only a real course change resets — NOT a mere remount), group runs by
 * TIME BUCKET (today / 7 days / 30 days / older), and a "load more" button.
 * Each row opens the read-only scorecard. Server-side `mode` paging was dropped —
 * it desynced `totalCount` from a cleared `items` (count said 12 while the list
 * read empty).
 * @param props - {@link MockInterviewHistoryProps}
 */
export const MockInterviewHistory = ({ courseId, courseDisplayId, onStartInterview}: MockInterviewHistoryProps) => {
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

    // group filtered runs by time window (teacher, 2026-07-17 "render history day by day")
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
    const attemptItem = (attempt: MockInterviewAttemptItem): SurfaceCardListItem => ({
        key: attempt.id,
        title: sessionDisplayName(attempt.name, attempt.createdAt, t, locale),
        subtitle: `${attempt.promptTitle} · ${formatDate(attempt.createdAt)}`,
        meta: () => (
            <Chip size="sm" variant="soft" color={verdictColorOf(attempt.verdict)}>
                <Chip.Label>{attempt.overallScore}</Chip.Label>
            </Chip>
        ),
        trailing: () => <CaretRightIcon weight="bold" className="size-4 text-muted" aria-hidden focusable="false" />,
        onPress: () => router.push(
            pathConfig()
                .locale(locale)
                .course(courseDisplayId)
                .learn()
                .mockInterview()
                .interview(attempt.sessionId)
                .result()
                .build(),
        ),
    })

    const skeletonItems: Array<SurfaceCardListItem> = Array.from({ length: 4 }, (_unused, index) => ({
        key: `skeleton-${index}`,
        content: () => (
            <StackH
                gap={4}
                principle="content-row"
                explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                classNames={["w-full"]}
                items={[
                    () => (
                        <StackV
                            gap={2}
                            principle="title-subtitle"
                            explain="Title over supporting line — not label-field, because neither line is a form control label."
                            classNames={["min-w-0", "flex-1"]}
                            items={[
                                () => <Skeleton.Typography type="body-sm" width="1/2" />,
                                () => <Skeleton.Typography type="body-xs" width="1/3" />,
                            ]}
                        />
                    ),
                    () => <Skeleton className="h-6 w-10 shrink-0 rounded-full" />,
                    () => <Skeleton className="size-4 shrink-0 rounded" />,
                ]}
            />
        ),
    }))

    return (
        <AsyncContent
            isLoading={attemptsSwr.isLoading && items.length === 0}
            skeleton={(
                // MIRROR the loaded tree: a funnel toolbar (search + funnel button + count)
                // above a SurfaceCardList of attempt rows (name/subtitle + verdict score
                // chip + caret).
                <StackV
                    gap={4}
                    items={[
                        () => (
                            <StackH
                                gap={4}
                                principle="content-row"
                                explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                                justify="between"
                                classNames={["w-full"]}
                                items={[
                                    () => (
                                        <StackH
                                            gap={4}
                                            principle="content-row"
                                            explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                                            classNames={["min-w-0", "flex-1"]}
                                            items={[
                                                () => <Skeleton className="h-9 min-w-0 flex-1 rounded-medium" />,
                                                () => <Skeleton className="size-9 shrink-0 rounded-medium" />,
                                            ]}
                                        />
                                    ),
                                    () => <Skeleton className="h-[14px] w-16 shrink-0 rounded" />,
                                ]}
                            />
                        ),
                        () => (
                            <SurfaceCardList items={skeletonItems} />
                        ),
                    ]}
                />
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
                // populated SurfaceCardList shape; components/card.md §2).
                <Card>
                    <CardContent>
                        <EmptyState
                            title={t("mockInterview.historyEmpty")}
                            action={onStartInterview ? () => (
                                <Button size="sm" variant="secondary" onPress={onStartInterview}>
                                    {t("mockInterview.begin")}
                                </Button>
                            ) : undefined}
                        />
                    </CardContent>
                </Card>
            ) : (
                <div>
                    <StackV
                        gap={4}
                        items={[
                            () => (
                                <StackH
                                    gap={4}
                                    principle="content-row"
                                    explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                                    justify="between"
                                    classNames={["w-full"]}
                                    items={[
                                        () => (
                                            <StackH
                                                gap={4}
                                                principle="content-row"
                                                explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                                                classNames={["min-w-0", "flex-1"]}
                                                items={[
                                                    () => (
                                                        <SearchInput
                                                            className="min-w-0 flex-1"
                                                            value={search}
                                                            onValueChange={setSearch}
                                                            placeholder={t("mockInterview.historySearchPlaceholder")}
                                                        />
                                                    ),
                                                    ...(hasFacets
                                                        ? [() => (
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
                                                                    <Box principle="cell-pad" className="p-3"
                                                                        explain="Tight cell inset — not card-padding, because this sits inside a dense table or list cell rather than a card body.">
                                                                        <StackV
                                                                            gap={4}
                                                                            items={[
                                                                                () => (
                                                                                    <StackV
                                                                                        gap={4}
                                                                                        principle="label-field"
                                                                                        explain="Form label above its field — not title-subtitle, because the upper line labels an input rather than a heading pair."
                                                                                        items={[
                                                                                            () => (
                                                                                                <Typography type="body-xs" color="muted">{t("mockInterview.historyFilterHeading")}</Typography>
                                                                                            ),
                                                                                            () => (
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
                                                                                            ),
                                                                                        ]}
                                                                                    />
                                                                                ),
                                                                                ...(activeFacetCount > 0
                                                                                    ? [() => (
                                                                                        <Button variant="danger-soft" size="sm" className="self-start" onPress={() => setModeFilter("all")}>
                                                                                            {t("mockInterview.historyClearFilters")}
                                                                                        </Button>
                                                                                    )]
                                                                                    : []),
                                                                            ]}
                                                                        />
                                                                    </Box>
                                                                </Popover.Content>
                                                            </Popover>
                                                        )]
                                                        : []),
                                                ]}
                                            />
                                        ),
                                        () => (
                                            <Typography type="body-sm" color="muted" className="shrink-0">
                                                {t("mockInterview.historyCount", { count: shownCount })}
                                            </Typography>
                                        ),
                                    ]}
                                />
                            ),
                            () => (
                                filteredItems.length === 0 ? (
                                    <Card>
                                        <CardContent>
                                            <Box principle="page-pad" className="p-6"
                                                explain="Page chrome inset — not card-padding, because this pads the whole page rather than a nested card surface.">
                                                <Typography type="body-sm" color="muted" align="center">
                                                    {t("mockInterview.historyEmptyFiltered")}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <StackV
                                        gap={4}
                                        items={timeBuckets.map((bucket) => () => (
                                            <SurfaceCardList
                                                key={bucket.key}
                                                subtleLabel
                                                label={t(`flashcard.timeBucket.${bucket.key}`)}
                                                labelEnd={t("flashcard.runCount", { count: bucket.items.length })}
                                                items={bucket.items.map((attempt) => attemptItem(attempt))}
                                            />
                                        ))}
                                    />
                                )
                            ),
                            ...(hasMore
                                ? [() => (
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="self-center"
                                        isDisabled={attemptsSwr.isLoading}
                                        onPress={() => setOffset((previous) => previous + PAGE_SIZE)}
                                    >
                                        {t("mockInterview.historyLoadMore")}
                                    </Button>
                                )]
                                : []),
                        ]}
                    />
                </div>
            )}
        </AsyncContent>
    )
}
