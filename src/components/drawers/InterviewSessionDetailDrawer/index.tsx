"use client"

import React from "react"
import { Chip, Drawer, ScrollShadow, Typography, cn } from "@heroui/react"
import { TagIcon } from "@phosphor-icons/react"
import { useTranslations, useLocale } from "next-intl"
import { MarkdownContent } from "@/components/blocks/rendering/MarkdownContent"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { useSmViewpoint } from "@/hooks/reuseables/useSmViewpoint"
import { useQueryInterviewSessionAttemptsSwr } from "@/hooks/swr/api/graphql/queries/useQueryInterviewSessionAttemptsSwr"
import type { InterviewSessionItem } from "@/modules/api/graphql/queries/types/interview-sessions"
import type { InterviewSessionAttemptItem } from "@/modules/api/graphql/queries/types/interview-session-attempts"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link InterviewSessionDetailDrawer}. */
export interface InterviewSessionDetailDrawerProps extends WithClassNames<undefined> {
    /** Whether the drawer is open. */
    isOpen: boolean
    /** Open-state change handler. */
    onOpenChange: (open: boolean) => void
    /** Course the run belongs to (for the scoped query header). */
    courseId: string
    /** The run being inspected (drives the summary header); null when closed. */
    session: InterviewSessionItem | null
}

/** HeroUI Chip color per seniority level (mirrors the reviewer / session). */
const LEVEL_COLOR: Record<string, "success" | "warning" | "danger" | "accent"> = {
    junior: "success",
    middle: "warning",
    senior: "danger",
    staff: "accent",
}

/** Verdict → chip color. */
const verdictColorOf = (verdict: string): "success" | "warning" | "danger" =>
    verdict === "pass" ? "success" : verdict === "borderline" ? "warning" : "danger"

/** One answered question — verdict + score + prompt + persisted feedback. */
const AttemptCard = ({ attempt, position }: { attempt: InterviewSessionAttemptItem; position: number }) => {
    const t = useTranslations()
    return (
        <div className="flex flex-col gap-3 rounded-xl border border-default p-4">
            <div className="flex items-center justify-between gap-3">
                <Chip size="sm" variant="soft" color={verdictColorOf(attempt.verdict)}>
                    {t(`flashcard.interview.${attempt.verdict === "pass" ? "pass" : attempt.verdict === "borderline" ? "borderline" : "fail"}`)}
                </Chip>
                <Typography type="body-sm" weight="medium">
                    {t("flashcard.interview.score", { score: attempt.score })}
                </Typography>
            </div>
            <Typography type="body-xs" weight="medium" color="muted">
                {t("flashcard.interview.questionN", { n: position + 1 })}
            </Typography>
            <div className="text-foreground">
                <MarkdownContent markdown={attempt.question} />
            </div>
            {/* question meta — level chip (1 trục phân loại) + tags as plain text */}
            {attempt.level || attempt.tags.length > 0 ? (
                <div className="flex flex-wrap items-center gap-2">
                    {attempt.level ? (
                        <Chip size="sm" variant="soft" color={LEVEL_COLOR[attempt.level] ?? "default"}>
                            {t(`flashcard.level.${attempt.level}`)}
                        </Chip>
                    ) : null}
                    {attempt.tags.length > 0 ? (
                        <Typography type="body-xs" color="muted" className="inline-flex items-center gap-1">
                            <TagIcon size={14} />
                            {attempt.tags.join(" · ")}
                        </Typography>
                    ) : null}
                </div>
            ) : null}
            {/* persisted feedback (empty for legacy runs) */}
            {attempt.strengths.length > 0 ? (
                <div className="flex flex-col gap-2">
                    <Typography type="body-xs" weight="medium" className="text-success-soft-foreground">
                        {t("flashcard.interview.strengths")}
                    </Typography>
                    <ul className="flex list-disc flex-col gap-2 pl-5">
                        {attempt.strengths.map((item, index) => (
                            <li key={index}>
                                <Typography type="body-sm">{item}</Typography>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : null}
            {attempt.gaps.length > 0 ? (
                <div className="flex flex-col gap-2">
                    <Typography type="body-xs" weight="medium" className="text-danger-soft-foreground">
                        {t("flashcard.interview.gaps")}
                    </Typography>
                    <ul className="flex list-disc flex-col gap-2 pl-5">
                        {attempt.gaps.map((item, index) => (
                            <li key={index}>
                                <Typography type="body-sm">{item}</Typography>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : null}
            {attempt.modelAnswerHint ? (
                <div className="flex flex-col gap-2 border-t border-divider pt-3">
                    <Typography type="body-xs" weight="medium" color="muted">
                        {t("flashcard.interview.hint")}
                    </Typography>
                    <Typography type="body-sm">{attempt.modelAnswerHint}</Typography>
                </div>
            ) : null}
        </div>
    )
}

/**
 * Drawer showing the per-question detail of ONE mock-interview run: a summary
 * header (date · count · level · average) plus each answered question with its
 * verdict, score, prompt, and persisted feedback (strengths/gaps/hint). Older
 * runs (logged before feedback was stored) show just verdict/score/prompt.
 * Presentational (props-driven): the page owns the open flag + selected run.
 *
 * @param props - {@link InterviewSessionDetailDrawerProps}
 */
export const InterviewSessionDetailDrawer = ({
    isOpen,
    onOpenChange,
    courseId,
    session,
    className,
}: InterviewSessionDetailDrawerProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const { isMobile } = useSmViewpoint()
    const { data, isLoading, error, mutate } = useQueryInterviewSessionAttemptsSwr(
        courseId,
        isOpen ? session?.sessionId ?? null : null,
    )

    const dateLabel = session
        ? new Date(session.startedAt).toLocaleDateString(
            locale === "vi" ? "vi-VN" : "en-US",
            { day: "numeric", month: "short", year: "numeric" },
        )
        : ""

    const skeleton = (
        <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex flex-col gap-3 rounded-xl border border-default p-4">
                    {/* header row — verdict chip (left) + score (right) */}
                    <div className="flex items-center justify-between gap-3">
                        <Skeleton.Chip />
                        <Skeleton.Typography type="body-sm" width="1/4" />
                    </div>
                    {/* question label + body */}
                    <Skeleton.Typography type="body-xs" width="1/3" />
                    <Skeleton.Typography type="body-sm" width="full" />
                    <Skeleton.Typography type="body-sm" width="2/3" />
                </div>
            ))}
        </div>
    )

    return (
        <Drawer>
            <Drawer.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
                <Drawer.Content placement={isMobile ? "bottom" : "right"}>
                    <Drawer.Dialog className={cn("p-0", className)}>
                        <div className="p-3">
                            <Drawer.CloseTrigger />
                            <Drawer.Header>
                                <Drawer.Heading>
                                    {t("flashcard.interview.detailTitle")}
                                </Drawer.Heading>
                                {session ? (
                                    <Typography type="body-sm" color="muted">
                                        {`${dateLabel} · ${t("flashcard.interview.historyQuestionCount", { count: session.questionCount })}`}
                                    </Typography>
                                ) : null}
                            </Drawer.Header>
                        </div>
                        <Drawer.Body>
                            <ScrollShadow className="h-full p-4" hideScrollBar>
                                {/* run summary — average + verdict breakdown */}
                                {session ? (
                                    <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-divider pb-4">
                                        <div className="flex items-baseline gap-2">
                                            <Typography type="h4">
                                                {session.averageScore}
                                            </Typography>
                                            <Typography type="body-xs" color="muted">
                                                {t("flashcard.interview.avgScore").toLowerCase()}
                                            </Typography>
                                        </div>
                                        <div className="ml-auto flex flex-wrap items-center gap-x-3 gap-y-1">
                                            {session.passCount > 0 ? (
                                                <Typography type="body-sm" weight="medium" className="text-success-soft-foreground">
                                                    {`${t("flashcard.interview.pass")} · ${session.passCount}`}
                                                </Typography>
                                            ) : null}
                                            {session.borderlineCount > 0 ? (
                                                <Typography type="body-sm" weight="medium" className="text-warning-soft-foreground">
                                                    {`${t("flashcard.interview.borderline")} · ${session.borderlineCount}`}
                                                </Typography>
                                            ) : null}
                                            {session.failCount > 0 ? (
                                                <Typography type="body-sm" weight="medium" className="text-danger-soft-foreground">
                                                    {`${t("flashcard.interview.fail")} · ${session.failCount}`}
                                                </Typography>
                                            ) : null}
                                        </div>
                                    </div>
                                ) : null}

                                <AsyncContent
                                    isLoading={isLoading && !data}
                                    skeleton={skeleton}
                                    isEmpty={Boolean(data) && (data?.length ?? 0) === 0}
                                    emptyContent={{ title: t("flashcard.interview.detailEmpty") }}
                                    error={data ? undefined : error}
                                    errorContent={{
                                        title: t("flashcard.interview.detailError"),
                                        onRetry: () => void mutate(),
                                        retryLabel: t("flashcard.interview.retry"),
                                    }}
                                >
                                    <div className="flex flex-col gap-3">
                                        {(data ?? []).map((attempt, index) => (
                                            <AttemptCard key={attempt.id} attempt={attempt} position={index} />
                                        ))}
                                    </div>
                                </AsyncContent>
                            </ScrollShadow>
                        </Drawer.Body>
                    </Drawer.Dialog>
                </Drawer.Content>
            </Drawer.Backdrop>
        </Drawer>
    )
}

export default InterviewSessionDetailDrawer
