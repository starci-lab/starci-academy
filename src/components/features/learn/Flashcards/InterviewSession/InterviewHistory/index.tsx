"use client"

import React, { useEffect, useState } from "react"
import { Chip, Pagination, Typography } from "@heroui/react"
import { CaretRightIcon, ClockCounterClockwiseIcon } from "@phosphor-icons/react"
import { useTranslations, useLocale } from "next-intl"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { InterviewSessionDetailDrawer } from "@/components/drawers/InterviewSessionDetailDrawer"
import {
    INTERVIEW_SESSIONS_PAGE_SIZE,
    useQueryInterviewSessionsSwr,
} from "@/hooks/swr/api/graphql/queries/useQueryInterviewSessionsSwr"
import type { InterviewSessionItem } from "@/modules/api/graphql/queries/types/interview-sessions"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link InterviewHistory}. */
export interface InterviewHistoryProps extends WithClassNames<undefined> {
    /** Course whose interview runs to list. */
    courseId: string
}

/** HeroUI Chip color per seniority level (mirrors the reviewer / session). */
const LEVEL_COLOR: Record<string, "success" | "warning" | "danger" | "accent"> = {
    junior: "success",
    middle: "warning",
    senior: "danger",
    staff: "accent",
}

/** One run row: date + question count, verdict breakdown, level + average score.
 * Whole row opens the run-detail drawer. */
const InterviewHistoryRow = ({ run, onPress }: { run: InterviewSessionItem; onPress: () => void }) => {
    const t = useTranslations()
    const locale = useLocale()
    // newest-first list; show a compact, locale-aware date for each run
    const dateLabel = new Date(run.startedAt).toLocaleDateString(
        locale === "vi" ? "vi-VN" : "en-US",
        { day: "numeric", month: "short" },
    )
    return (
        <SurfaceListCardItem onPress={onPress}>
            <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 flex-col gap-1">
                    <Typography type="body-sm" weight="medium" truncate>
                        {`${dateLabel} · ${t("flashcard.interview.historyQuestionCount", { count: run.questionCount })}`}
                    </Typography>
                    {/* verdict breakdown — only the non-zero bands, to keep the row light */}
                    <div className="flex flex-wrap items-center gap-1.5">
                        {run.passCount > 0 ? (
                            <Chip size="sm" variant="soft" color="success">
                                {`${t("flashcard.interview.pass")} · ${run.passCount}`}
                            </Chip>
                        ) : null}
                        {run.borderlineCount > 0 ? (
                            <Chip size="sm" variant="soft" color="warning">
                                {`${t("flashcard.interview.borderline")} · ${run.borderlineCount}`}
                            </Chip>
                        ) : null}
                        {run.failCount > 0 ? (
                            <Chip size="sm" variant="soft" color="danger">
                                {`${t("flashcard.interview.fail")} · ${run.failCount}`}
                            </Chip>
                        ) : null}
                    </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                    {run.level ? (
                        <Chip size="sm" variant="soft" color={LEVEL_COLOR[run.level] ?? "default"}>
                            {t(`flashcard.level.${run.level}`)}
                        </Chip>
                    ) : null}
                    <Typography className="text-xl font-medium text-foreground">
                        {run.averageScore}
                    </Typography>
                    <CaretRightIcon className="size-5 text-muted" aria-hidden focusable="false" />
                </div>
            </div>
        </SurfaceListCardItem>
    )
}

/**
 * The viewer's mock-interview HISTORY for a course — a list of past RUNS
 * (sessions), newest first, paginated. Each row groups one run's answers into a
 * summary (date · question count · verdict breakdown · level · average score).
 * Grounded in `interviewSessions` (rows of `interview_attempts` grouped by their
 * shared session id). Owns its own page state + fetch; the setup phase just slots
 * it in as the third section card.
 *
 * @param props - {@link InterviewHistoryProps}
 */
export const InterviewHistory = ({ courseId, className }: InterviewHistoryProps) => {
    const t = useTranslations()
    const [page, setPage] = useState(1)
    // the run whose detail drawer is open (null = closed)
    const [selectedRun, setSelectedRun] = useState<InterviewSessionItem | null>(null)
    const { data, isLoading, error, mutate } = useQueryInterviewSessionsSwr(courseId, page)

    const totalCount = data?.totalCount ?? 0
    const totalPages = Math.max(1, Math.ceil(totalCount / INTERVIEW_SESSIONS_PAGE_SIZE))
    // never strand the viewer on a page past the end (e.g. after data shrinks)
    useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages)
        }
    }, [page, totalPages])

    const skeleton = (
        <SurfaceListCard>
            {Array.from({ length: 3 }).map((_, index) => (
                <SurfaceListCardItem key={index}>
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 flex-col gap-2">
                            <Skeleton.Typography type="body-sm" width="1/2" />
                            <Skeleton.Typography type="body-xs" width="1/3" />
                        </div>
                        <Skeleton.Typography type="h4" width="1/4" />
                    </div>
                </SurfaceListCardItem>
            ))}
        </SurfaceListCard>
    )

    return (
        <>
            <LabeledCard
                label={t("flashcard.interview.historyTitle")}
                icon={<ClockCounterClockwiseIcon className="size-5 text-muted" aria-hidden focusable="false" />}
                frameless
                className={className}
            >
                <AsyncContent
                    isLoading={isLoading && !data}
                    skeleton={skeleton}
                    isEmpty={Boolean(data) && totalCount === 0}
                    emptyContent={{
                        title: t("flashcard.interview.historyEmpty"),
                        description: t("flashcard.interview.historyEmptyHint"),
                    }}
                    error={data ? undefined : error}
                    errorContent={{
                        title: t("flashcard.interview.historyError"),
                        onRetry: () => void mutate(),
                        retryLabel: t("flashcard.interview.retry"),
                    }}
                >
                    <div className="flex flex-col gap-3">
                        <SurfaceListCard>
                            {(data?.items ?? []).map((run) => (
                                <InterviewHistoryRow
                                    key={run.sessionId}
                                    run={run}
                                    onPress={() => setSelectedRun(run)}
                                />
                            ))}
                        </SurfaceListCard>
                        {totalPages > 1 ? (
                            <Pagination className="flex justify-start">
                                <Pagination.Content className="flex flex-wrap justify-start gap-1.5">
                                    <Pagination.Item>
                                        <Pagination.Previous
                                            className="cursor-pointer rounded-medium transition-colors hover:bg-default"
                                            isDisabled={page <= 1}
                                            onPress={() => setPage((current) => Math.max(1, current - 1))}
                                        >
                                            <Pagination.PreviousIcon />
                                        </Pagination.Previous>
                                    </Pagination.Item>
                                    {Array.from({ length: totalPages }).map((_, index) => {
                                        const pageNumber = index + 1
                                        return (
                                            <Pagination.Item key={pageNumber}>
                                                <Pagination.Link
                                                    className="cursor-pointer rounded-medium transition-colors hover:bg-default data-[active=true]:hover:bg-accent"
                                                    isActive={pageNumber === page}
                                                    onPress={() => setPage(pageNumber)}
                                                >
                                                    {pageNumber}
                                                </Pagination.Link>
                                            </Pagination.Item>
                                        )
                                    })}
                                    <Pagination.Item>
                                        <Pagination.Next
                                            className="cursor-pointer rounded-medium transition-colors hover:bg-default"
                                            isDisabled={page >= totalPages}
                                            onPress={() => setPage((current) => Math.min(totalPages, current + 1))}
                                        >
                                            <Pagination.NextIcon />
                                        </Pagination.Next>
                                    </Pagination.Item>
                                </Pagination.Content>
                            </Pagination>
                        ) : null}
                    </div>
                </AsyncContent>
            </LabeledCard>
            <InterviewSessionDetailDrawer
                isOpen={selectedRun !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedRun(null)
                    }
                }}
                courseId={courseId}
                session={selectedRun}
            />
        </>
    )
}

export default InterviewHistory
