"use client"

import React, { useEffect, useState } from "react"
import useSWR from "swr"
import { Button, Chip, Typography, cn } from "@heroui/react"
import { ClockCounterClockwiseIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { EmptyState } from "@/components/blocks/feedback/EmptyState"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { SkeletonListRow } from "@/components/blocks/skeleton/Skeleton/ListRow"
import { queryMyFlashcardReviewHistory } from "@/modules/api/graphql/queries/query-my-flashcard-review-history"
import type { QueryFlashcardReviewHistoryItem } from "@/modules/api/graphql/queries/types/my-flashcard-review-history"
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

/**
 * "Học thẻ" run history — the study overview's "Lịch sử" tab. Offset-paginated
 * ("load more"); each row deep-links back into that deck's reviewer. Mirrors
 * `FlashcardQuizHistory`, minus mode/level/coverage/weakTags (cloze-quiz-only
 * concepts a plain SM-2 review session has none of).
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

    // course changed → start the accumulator over
    useEffect(() => {
        setOffset(0)
        setItems([])
    }, [courseId])

    const formatDate = (iso: string) =>
        new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(iso))

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
                title: t("flashcard.review.historyError"),
                onRetry: () => { void historySwr.mutate() },
                retryLabel: t("flashcard.review.retry"),
            }}
        >
            {items.length === 0 ? (
                <EmptyState
                    icon={<ClockCounterClockwiseIcon aria-hidden focusable="false" />}
                    title={t("flashcard.review.historyEmptyTitle")}
                    description={t("flashcard.review.historyEmptyDescription")}
                    action={onStartReview ? (
                        <Button size="sm" variant="secondary" onPress={onStartReview}>
                            {t("flashcard.review.historyEmptyAction")}
                        </Button>
                    ) : undefined}
                    className={className}
                />
            ) : (
                <div className={cn("flex flex-col gap-3", className)}>
                    <SurfaceListCard>
                        {items.map((item) => (
                            <SurfaceListCardItem
                                key={item.id}
                                onPress={() => router.push(
                                    pathConfig().locale(locale).course(displayId).learn()
                                        .flashcards().review(item.deckId).build(),
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                                        <Typography type="body-sm" weight="medium" truncate>
                                            {item.deckTitle}
                                        </Typography>
                                        <Typography type="body-xs" color="muted" truncate>
                                            {formatDate(item.updatedAt)}
                                            {" · "}
                                            {t("flashcard.review.historyCardCount", {
                                                reviewedCount: item.reviewedCount,
                                                cardCount: item.cardCount,
                                            })}
                                        </Typography>
                                    </div>
                                    {item.xpEarned > 0 ? (
                                        <Chip size="sm" variant="soft" color="warning" className="shrink-0">
                                            {t("flashcard.quiz.xpToast", { xp: item.xpEarned })}
                                        </Chip>
                                    ) : null}
                                </div>
                            </SurfaceListCardItem>
                        ))}
                    </SurfaceListCard>
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
