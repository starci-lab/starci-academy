"use client"

import React, { useEffect, useRef, useState } from "react"
import useSWR from "swr"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { queryMyFlashcardReviewHistory } from "@/modules/api/graphql/queries/query-my-flashcard-review-history"
import type { QueryFlashcardReviewHistoryItem } from "@/modules/api/graphql/queries/types/my-flashcard-review-history"
import { useAppSelector } from "@/redux/hooks"
import { pathConfig } from "@/resources/path"
import { _FlashcardReviewHistory } from "./component"

/** History items fetched per "load more" page. */
const PAGE_SIZE = 10

/** Props for {@link FlashcardReviewHistory}. */
export interface FlashcardReviewHistoryProps {
    /** Course whose "Study cards" review session history to list. */
    courseId: string
    /** Jumps the overview tab strip back to the study overview — wired from
     *  `FlashcardsPage` so the empty state's action can start reviewing without
     *  this component owning the tab switcher itself. */
    onStartReview?: () => void
}

/**
 * "Study cards" run history — the study overview's "History" tab. The CONNECTED half: it
 * accumulates offset-paginated pages, resolves every label (incl. per-row/per-group
 * interpolation), and hands them to the presentational {@link _FlashcardReviewHistory}. See
 * `design/storybook/architecture/split.md`.
 *
 * @param props - {@link FlashcardReviewHistoryProps}
 */
export const FlashcardReviewHistory = ({ courseId, onStartReview }: FlashcardReviewHistoryProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const displayId = useAppSelector((state) => state.course.displayId)

    const [offset, setOffset] = useState(0)
    const [items, setItems] = useState<Array<QueryFlashcardReviewHistoryItem>>([])
    const [totalCount, setTotalCount] = useState(0)

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
    // mere MOUNT (the teacher, 2026-07-13: "switch tabs and everything's gone" — this tab is
    // unmounted/remounted by the parent's tab switch; an unguarded version fires on every
    // remount too since `courseId` is "new" to a fresh effect subscription, wiping the
    // `items` this same render's data-effect had JUST populated from SWR's still-warm
    // cache — a real state-loss bug, not just a data problem).
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

    const goToDeck = (deckId: string) => router.push(
        pathConfig().locale(locale).course(displayId).learn().flashcards().review(deckId).build(),
    )

    return (
        <_FlashcardReviewHistory
            items={items}
            totalCount={totalCount}
            // first load, nothing in hand → shimmer; settled (data OR error) stops it (loading-and-skeleton.md §2)
            isSkeleton={historySwr.isLoading && items.length === 0}
            // settled with zero runs at all
            isEmpty={items.length === 0}
            // error beats loading + empty; only a settled fetch error (nothing cached) reaches the block
            error={items.length === 0 ? historySwr.error : undefined}
            onRetry={() => { void historySwr.mutate() }}
            onLoadMore={() => setOffset((previous) => previous + PAGE_SIZE)}
            isLoadingMore={historySwr.isLoading}
            formatDate={formatDate}
            onOpenDeck={goToDeck}
            onStartReview={onStartReview}
            labels={{
                errorTitle: t("flashcard.review.historyError"),
                retry: t("flashcard.review.retry"),
                emptyTitle: t("flashcard.review.historyEmptyTitle"),
                emptyDescription: t("flashcard.review.historyEmptyDescription"),
                emptyAction: t("flashcard.review.historyEmptyAction"),
                searchPlaceholder: t("flashcard.review.historySearchPlaceholder"),
                groupByDeck: t("flashcard.review.historyGroupByDeck"),
                groupByTime: t("flashcard.review.historyGroupByTime"),
                filterEmpty: t("flashcard.review.historyFilterEmpty"),
                loadMore: t("flashcard.review.historyLoadMore"),
                cardCount: (reviewedCount, cardCount) => t("flashcard.review.historyCardCount", { reviewedCount, cardCount }),
                xp: (xpEarned) => t("flashcard.quiz.xpToast", { xp: xpEarned }),
                deckRunCount: (count) => t("flashcard.review.historyDeckRunCount", { count }),
                timeBucket: (key) => t(`flashcard.timeBucket.${key}`),
                runCount: (count) => t("flashcard.runCount", { count }),
            }}
        />
    )
}
