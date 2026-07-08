"use client"

import React, { useEffect, useState } from "react"
import useSWR from "swr"
import { Button, Chip, Typography, cn } from "@heroui/react"
import { CaretDownIcon, ClockCounterClockwiseIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { EmptyState } from "@/components/blocks/feedback/EmptyState"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { SkeletonListRow } from "@/components/blocks/skeleton/Skeleton/ListRow"
import { queryMyFlashcardQuizHistory } from "@/modules/api/graphql/queries/query-my-flashcard-quiz-history"
import type { QueryFlashcardQuizHistoryItem, QueryFlashcardQuizWeakTag } from "@/modules/api/graphql/queries/types/my-flashcard-quiz-history"
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

    // course changed → start the accumulator over
    useEffect(() => {
        setOffset(0)
        setItems([])
    }, [courseId])

    const formatDate = (iso: string) =>
        new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(iso))

    const resolveHref = (tag: QueryFlashcardQuizWeakTag): string =>
        (tag.moduleId && tag.contentId
            ? learn.module(tag.moduleId).content(tag.contentId).build()
            : tag.moduleId
                ? learn.module(tag.moduleId).build()
                : null) ?? genericHref

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
                <EmptyState
                    icon={<ClockCounterClockwiseIcon aria-hidden focusable="false" />}
                    title={t("flashcard.quiz.quizHistoryEmptyTitle")}
                    description={t("flashcard.quiz.quizHistoryEmptyDescription")}
                    action={onStartQuiz ? (
                        <Button size="sm" variant="secondary" onPress={onStartQuiz}>
                            {t("flashcard.quiz.quizHistoryEmptyAction")}
                        </Button>
                    ) : undefined}
                    className={className}
                />
            ) : (
                <div className={cn("flex flex-col gap-3", className)}>
                    <SurfaceListCard>
                        {items.map((item) => {
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
                        })}
                    </SurfaceListCard>
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
