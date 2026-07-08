"use client"

import React from "react"
import useSWR from "swr"
import { Chip, Typography } from "@heroui/react"
import { FlameIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { queryMyFlashcardQuizHistory } from "@/modules/api/graphql/queries/query-my-flashcard-quiz-history"
import { queryMyFlashcardQuizStats } from "@/modules/api/graphql/queries/query-my-flashcard-quiz-stats"
import { queryMyWeeklyStats } from "@/modules/api/graphql/queries/query-my-weekly-stats"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link QuizProgressStrip}. */
export interface QuizProgressStripProps extends WithClassNames<undefined> {
    /** Course whose "Hỏi nhanh" progress to show. */
    courseId: string
}

/**
 * The "Hỏi nhanh" setup screen's OWN progress readout — sessions completed +
 * recent average coverage + this week's XP/streak, all quiz-specific. Split
 * out from the shared `FlashcardStatsStrip` mastery bar (thầy 2026-07-09:
 * "tiến bộ ở 2 nơi khác nhau chứ" — mastery is a real shared SM-2 metric, but
 * "Hỏi nhanh" reads better with its OWN numbers instead of the sibling
 * "Học thẻ" tab's block). Shares SWR keys with `FlashcardQuizHistory` (limit=1
 * page for `totalCount`) and `FlashcardQuizStats`'s own trend query, so
 * switching to those tabs adds no extra fetch.
 * @param props - {@link QuizProgressStripProps}
 */
export const QuizProgressStrip = ({ courseId, className }: QuizProgressStripProps) => {
    const t = useTranslations()

    // total completed quiz sessions — same key/shape FlashcardQuizHistory's
    // first page uses (offset 0), so this adds no extra fetch when the
    // learner switches to the "Lịch sử" tab.
    const historySwr = useSWR(
        ["flashcard-quiz-history", courseId, 0],
        async () => {
            const response = await queryMyFlashcardQuizHistory({ request: { courseId, limit: 1, offset: 0 } })
            return response.data?.myFlashcardQuizHistory.data ?? null
        },
    )
    // recent coverage trend — same key `FlashcardQuizStats` reads
    const statsSwr = useSWR(
        ["flashcard-quiz-stats", courseId],
        async () => {
            const response = await queryMyFlashcardQuizStats({ request: { courseId } })
            return response.data?.myFlashcardQuizStats.data ?? null
        },
    )
    // rolling 7-day streak/XP — platform-wide (not quiz-only), but genuinely
    // relevant momentum context; already fetched elsewhere in QuizSession for
    // its post-completion refresh, this just also reads it for display.
    const weeklySwr = useSWR(
        ["my-weekly-stats"],
        async () => {
            const response = await queryMyWeeklyStats({})
            return response.data?.myWeeklyStats.data ?? null
        },
    )

    const totalSessions = historySwr.data?.totalCount ?? 0
    const trend = statsSwr.data?.trend ?? []
    const avgCoverage =
        trend.length > 0
            ? Math.round((trend.reduce((sum, point) => sum + point.coverage, 0) / trend.length) * 100)
            : null
    const streak = weeklySwr.data?.streak ?? 0
    const weeklyXp = weeklySwr.data?.xp ?? 0

    const isLoading =
        (historySwr.isLoading || statsSwr.isLoading || weeklySwr.isLoading)
        && !historySwr.data && !statsSwr.data && !weeklySwr.data

    return (
        <AsyncContent
            isLoading={isLoading}
            skeleton={
                <div className="flex flex-col gap-3">
                    <Skeleton.Typography type="body-sm" width="1/2" />
                    <Skeleton.Typography type="body-xs" width="3/4" />
                </div>
            }
        >
            <LabeledCard className={className} label={t("flashcard.quiz.progressLabel")}>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-3">
                        <Typography type="body-sm" className="min-w-0 truncate">
                            {totalSessions > 0
                                ? t("flashcard.quiz.progressSessionCount", { count: totalSessions })
                                : t("flashcard.quiz.progressNoSessions")}
                            {avgCoverage !== null ? (
                                <span className="text-muted">
                                    {" · "}{t("flashcard.quiz.progressAvgCoverage", { percent: avgCoverage })}
                                </span>
                            ) : null}
                        </Typography>
                        {streak > 0 ? (
                            <Chip
                                size="sm"
                                variant="secondary"
                                color="warning"
                                className="shrink-0 bg-warning/10 text-warning"
                            >
                                <FlameIcon className="size-3.5" aria-hidden focusable="false" />
                                {t("flashcard.stats.streakChip", { count: streak })}
                            </Chip>
                        ) : null}
                    </div>
                    {weeklyXp > 0 ? (
                        <Typography type="body-xs" color="muted">
                            {t("flashcard.quiz.progressWeeklyXp", { xp: weeklyXp })}
                        </Typography>
                    ) : null}
                </div>
            </LabeledCard>
        </AsyncContent>
    )
}
