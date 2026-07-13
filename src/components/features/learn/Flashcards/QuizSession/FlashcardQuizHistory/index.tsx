"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import useSWR from "swr"
import { Button, Card, CardContent, Chip, Typography, cn } from "@heroui/react"
import { CaretDownIcon, ClockCounterClockwiseIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { EmptyState } from "@/components/blocks/feedback/EmptyState"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { FlexWrapButtonRadio } from "@/components/blocks/navigation/FlexWrapButtonRadio"
import { SkeletonListRow } from "@/components/blocks/skeleton/Skeleton/ListRow"
import { queryMyFlashcardQuizHistory } from "@/modules/api/graphql/queries/query-my-flashcard-quiz-history"
import type { QueryFlashcardQuizHistoryItem, QueryFlashcardQuizWeakTag } from "@/modules/api/graphql/queries/types/my-flashcard-quiz-history"
import { groupByTimeBucket } from "../../historyBuckets"
import { LEVEL_COLOR } from "../../constants"
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

/**
 * "Hỏi nhanh" run history — the setup screen's "Lịch sử" tab. Offset-paginated
 * ("load more"), each row expandable inline to reveal that run's weakest tags
 * (with a "review lesson" deep link when the deck→lesson mapping was
 * unambiguous, same resolution the recap screen already does).
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
    // client-side filter over already-fetched `items` (thầy 2026-07-13: redesign
    // history — mode/level are already fetched per item, no BE change needed).
    // "all" sentinel instead of `null` since `FlexWrapButtonRadio<T>` requires a
    // non-nullable string value.
    const [modeFilter, setModeFilter] = useState<"all" | string>("all")
    const [levelFilter, setLevelFilter] = useState<"all" | string>("all")

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

    const formatDate = (iso: string) =>
        new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(iso))

    // only offer a chip for a mode/level that actually appears in the loaded
    // history — no dead filters for values this course never produced.
    const presentModes = useMemo(
        () => Array.from(new Set(items.map((item) => item.mode))),
        [items],
    )
    const presentLevels = useMemo(
        () => Array.from(new Set(items.flatMap((item) => (item.level ? [item.level] : [])))),
        [items],
    )
    const filteredItems = useMemo(
        () => items.filter((item) =>
            (modeFilter === "all" || item.mode === modeFilter)
            && (levelFilter === "all" || item.level === levelFilter),
        ),
        [items, modeFilter, levelFilter],
    )

    // group the filtered runs by time window (thầy 2026-07-13 relayout) — quiz
    // sessions have no deck, so time is the meaningful grouping axis (vs the deck
    // accordion on the "Học thẻ" sibling). Buckets come already ordered/non-empty.
    const timeBuckets = useMemo(
        () => groupByTimeBucket(filteredItems, (item) => item.updatedAt),
        [filteredItems],
    )

    const resolveHref = (tag: QueryFlashcardQuizWeakTag): string =>
        (tag.moduleId && tag.contentId
            ? learn.module(tag.moduleId).content(tag.contentId).build()
            : tag.moduleId
                ? learn.module(tag.moduleId).build()
                : null) ?? genericHref

    /** One run row — press toggles its weak-tag panel. Rendered inside each time
     *  bucket's `SurfaceListCard`. Body unchanged from the pre-bucketing version. */
    const renderRow = (item: QueryFlashcardQuizHistoryItem) => {
        const expanded = expandedId === item.id
        const coveragePercent = item.coverage !== null ? Math.round(item.coverage * 100) : null
        return (
            <SurfaceListCardItem
                key={item.id}
                onPress={() => setExpandedId(expanded ? null : item.id)}
            >
                <div className="flex items-center gap-3">
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <Typography type="body-sm" weight="medium" truncate>
                            {formatDate(item.updatedAt)}
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
                        <CaretDownIcon
                            className={cn("size-4 text-muted transition-transform", expanded && "rotate-180")}
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
                                    className="flex items-center justify-between gap-3 rounded-xl border border-default bg-default px-3 py-2 text-left hover:bg-default/70"
                                >
                                    <Typography type="body-xs" weight="medium" className="truncate">
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
                    {presentModes.length > 1 ? (
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
                    ) : null}
                    {presentLevels.length > 1 ? (
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
                    ) : null}
                    {filteredItems.length === 0 ? (
                        // filter excluded everything — keep the SAME bounded-card shape as the
                        // populated `SurfaceListCard` sibling below (không để message trần cạnh
                        // 1 card, `components/card.md` §2 frameless-section-empty-state-needs-card).
                        <Card>
                            <CardContent>
                                <Typography type="body-sm" color="muted" align="center" className="py-6">
                                    {t("flashcard.quiz.quizHistoryFilterEmpty")}
                                </Typography>
                            </CardContent>
                        </Card>
                    ) : (
                        // group by time window — each non-empty bucket is a `LabeledCard
                        // frameless` (time window = label OUTSIDE + run count via `labelEnd`;
                        // content is a `SurfaceListCard` → frameless, no card-in-card). Titled
                        // block → LabeledCard (thầy 2026-07-13: "mấy cái này phải là Label
                        // Card"; `components/card.md` §2). Rows unchanged (expand + chips).
                        <div className="flex flex-col gap-6">
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
