"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import useSWR from "swr"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { queryMyFlashcardQuizHistory } from "@/modules/api/graphql/queries/query-my-flashcard-quiz-history"
import type { QueryFlashcardQuizHistoryItem, QueryFlashcardQuizWeakTag } from "@/modules/api/graphql/queries/types/my-flashcard-quiz-history"
import { sessionDisplayName } from "@/modules/utils/session-display-name"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { useAppSelector } from "@/redux/hooks"
import { pathConfig } from "@/resources/path"
import { LEVEL_COLOR } from "@/modules/utils/flashcards"
import type { TimeBucketKey } from "@/modules/utils/history-buckets"
import { _FlashcardQuizHistory, type FlashcardQuizHistoryRow } from "./component"

/** Props for {@link FlashcardQuizHistory}. */
export interface FlashcardQuizHistoryProps extends WithClassNames<undefined> {
    /** Course whose quick-quiz ("Quick Quiz") history to list. */
    courseId: string
    /** Jumps the setup tab strip back to "Start" — wired from `InterviewSession`
     *  so the empty state's action can start a fresh run without this component
     *  owning the tab switcher itself. */
    onStartQuiz?: () => void
}

/** History items fetched per "load more" page. */
const PAGE_SIZE = 10

/** Every time-bucket key, in the order {@link groupByTimeBucket} can emit them — translated once. */
const TIME_BUCKET_KEYS: ReadonlyArray<TimeBucketKey> = ["day", "days3", "week", "month", "year", "older"]

/**
 * "Quick Quiz" run history — the CONNECTED half: it owns the offset-paginated
 * fetch (accumulating pages as "load more" advances), reads the course slug +
 * locale + router, resolves every run into a fully-localized
 * {@link FlashcardQuizHistoryRow}, and hands them to the presentational
 * {@link _FlashcardQuizHistory}. See `design/storybook/architecture/tiers/split.md`.
 *
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

    /** A weak tag's deep link: content-level → module-level → the generic module fallback. */
    const resolveHref = (tag: QueryFlashcardQuizWeakTag): string =>
        (tag.moduleId && tag.contentId
            ? learn.module(tag.moduleId).content(tag.contentId).build()
            : tag.moduleId
                ? learn.module(tag.moduleId).build()
                : null) ?? genericHref

    // fully resolve every fetched item into render-ready text + the raw fields the
    // presentational half still filters/groups by (mode, level, updatedAt, tag).
    const rows: Array<FlashcardQuizHistoryRow> = useMemo(() => items.map((item) => ({
        id: item.id,
        updatedAt: item.updatedAt,
        displayName: sessionDisplayName(item.name, item.updatedAt, t, locale),
        mode: item.mode,
        subtitle: `${t(item.mode === "deep" ? "flashcard.quiz.modeDeep" : "flashcard.quiz.modeQuick")} · ${t("flashcard.quiz.quizHistoryCardCount", { count: item.cardCount })}`,
        level: item.level,
        levelLabel: item.level ? t(`flashcard.level.${item.level}`) : undefined,
        levelColor: item.level ? (LEVEL_COLOR[item.level] ?? "default") : "default",
        coverageLabel: item.coverage !== null
            ? t("flashcard.quiz.weakTagCoverage", { percent: Math.round(item.coverage * 100) })
            : undefined,
        xpLabel: item.xpEarned > 0 ? t("flashcard.quiz.xpToast", { xp: item.xpEarned }) : undefined,
        correctCount: item.correctCount,
        cardCount: item.cardCount,
        weakTags: item.weakTags.map((tag) => ({
            tag: tag.tag,
            coverageLabel: t("flashcard.quiz.weakTagCoverage", { percent: Math.round(tag.coverage * 100) }),
            href: resolveHref(tag),
        })),
    })), [items, t, locale, learn, genericHref])

    // mode has exactly two known labels (mirrors the presentational's own ternary,
    // `mode === "deep"` else "quick") — translate each raw value seen ONCE.
    const modeLabelOf = useMemo(() => {
        const map: Record<string, string> = {}
        for (const item of items) {
            if (!(item.mode in map)) {
                map[item.mode] = t(item.mode === "deep" ? "flashcard.quiz.modeDeep" : "flashcard.quiz.modeQuick")
            }
        }
        return map
    }, [items, t])

    const levelLabelOf = useMemo(() => {
        const map: Record<string, string> = {}
        for (const item of items) {
            if (item.level && !(item.level in map)) {
                map[item.level] = t(`flashcard.level.${item.level}`)
            }
        }
        return map
    }, [items, t])

    // fixed six-key enum — translate once regardless of which buckets end up populated.
    const timeBucketLabelOf = useMemo(() => {
        const map = {} as Record<TimeBucketKey, string>
        for (const key of TIME_BUCKET_KEYS) {
            map[key] = t(`flashcard.timeBucket.${key}`)
        }
        return map
    }, [t])

    return (
        <_FlashcardQuizHistory
            className={className}
            // first load, nothing in hand → shimmer; matches the pre-split `isLoading && items.length === 0`
            isSkeleton={historySwr.isLoading && items.length === 0}
            isEmpty={items.length === 0}
            // only a settled fetch error (nothing cached to fall back to) reaches the block
            error={items.length === 0 ? historySwr.error : undefined}
            onRetry={() => { void historySwr.mutate() }}
            onStartQuiz={onStartQuiz}
            rows={rows}
            totalCount={totalCount}
            hasMore={items.length < totalCount}
            isLoadingMore={historySwr.isLoading}
            onLoadMore={() => setOffset((previous) => previous + PAGE_SIZE)}
            onTagPress={(href) => router.push(href)}
            modeLabelOf={modeLabelOf}
            levelLabelOf={levelLabelOf}
            timeBucketLabelOf={timeBucketLabelOf}
            formatRunCount={(count) => t("flashcard.runCount", { count })}
            labels={{
                errorTitle: t("flashcard.quiz.quizHistoryError"),
                retry: t("flashcard.quiz.retry"),
                emptyTitle: t("flashcard.quiz.quizHistoryEmptyTitle"),
                emptyDescription: t("flashcard.quiz.quizHistoryEmptyDescription"),
                emptyAction: t("flashcard.quiz.quizHistoryEmptyAction"),
                searchPlaceholder: t("flashcard.quiz.quizHistorySearchPlaceholder"),
                filterButtonAria: t("flashcard.quiz.quizHistoryFilterButton"),
                modeHeading: t("flashcard.quiz.quizHistoryModeHeading"),
                modeFilterAria: t("flashcard.quiz.quizHistoryFilterMode"),
                levelHeading: t("flashcard.quiz.quizHistoryLevelHeading"),
                levelFilterAria: t("flashcard.quiz.quizHistoryFilterLevel"),
                filterAll: t("flashcard.quiz.quizHistoryFilterAll"),
                clearFilters: t("flashcard.quiz.quizHistoryClearFilters"),
                filterEmptyMessage: t("flashcard.quiz.quizHistoryFilterEmpty"),
                weakTagsEmpty: t("flashcard.quiz.weakTagsEmpty"),
                loadMore: t("flashcard.quiz.quizHistoryLoadMore"),
            }}
        />
    )
}
