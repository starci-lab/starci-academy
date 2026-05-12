"use client"

import React, { useEffect, useMemo } from "react"
import { useAppDispatch, useAppSelector } from "@/redux"
import { setSelectedAttemptId, setReviewJob, clearReviewJob } from "@/redux/slices"
import { MarkdownContent } from "@/components/reuseable"
import { Accordion, Chip, Separator, Spinner } from "@heroui/react"
import {
    useQueryUserPersonalTaskAttemptsSwr,
    useQueryUserPersonalTaskAttemptFeedbacksSwr,
    useQueryMilestoneTaskProgressSwr,
} from "@/hooks/singleton"
import { JobStatus } from "@/modules/types"
import {
    CheckCircleIcon,
    QueueIcon,
    SparkleIcon,
    WarningOctagonIcon,
} from "@phosphor-icons/react"
import _ from "lodash"
import {
    jobNotificationsSocketIoEventEmitter,
    SubscriptionEvent,
} from "@/hooks/singleton/socketio"
import type { JobStatusUpdatedSocketIoMessage } from "@/hooks/singleton/socketio"
import { useTranslations } from "next-intl"

export const Task = () => {
    const t = useTranslations()
    const dispatch = useAppDispatch()
    const milestoneEntities = useAppSelector((state) => state.milestone.entities)
    const selectedTaskId = useAppSelector((state) => state.milestone.selectedTaskId)
    const selectedAttemptId = useAppSelector((state) => state.milestone.selectedAttemptId)
    const reviewJobStatus = useAppSelector((state) => state.milestone.reviewJobStatus)
    const reviewJobError = useAppSelector((state) => state.milestone.reviewJobError)
    const reviewJobId = useAppSelector((state) => state.milestone.reviewJobId)
    const attemptsSwr = useQueryUserPersonalTaskAttemptsSwr()
    const progressSwr = useQueryMilestoneTaskProgressSwr()

    /** Listen for real-time job status updates via Socket.IO */
    useEffect(() => {
        if (!reviewJobId) return

        const onJobUpdate = (message: JobStatusUpdatedSocketIoMessage) => {
            if (message.data?.jobId !== reviewJobId) return
            const status = message.data?.status
            if (!status) return

            dispatch(setReviewJob({ jobId: reviewJobId, status }))

            if (status === JobStatus.Completed || status === JobStatus.Failed) {
                /** Auto-refresh attempts list & progress */
                void attemptsSwr.mutate()
                void progressSwr.mutate()
                /** Clear the job banner after a short delay */
                setTimeout(() => {
                    dispatch(clearReviewJob())
                }, 5000)
            }
        }

        jobNotificationsSocketIoEventEmitter.on(SubscriptionEvent.JobStatusUpdated, onJobUpdate)
        return () => {
            jobNotificationsSocketIoEventEmitter.off(SubscriptionEvent.JobStatusUpdated, onJobUpdate)
        }
    }, [reviewJobId, dispatch, attemptsSwr, progressSwr])

    const selectedTask = useMemo(() => {
        if (!selectedTaskId) return undefined
        for (const milestone of milestoneEntities) {
            const found = milestone.tasks?.find((t) => t.id === selectedTaskId)
            if (found) return found
        }
        return undefined
    }, [milestoneEntities, selectedTaskId])

    const sortedCriterias = useMemo(() => {
        if (!selectedTask?.criterias) return []
        return _.cloneDeep(selectedTask.criterias).sort((a, b) => a.orderIndex - b.orderIndex)
    }, [selectedTask?.criterias])

    const attempts = useMemo(() => {
        if (!attemptsSwr.data) return []
        return attemptsSwr.data.data
    }, [attemptsSwr.data])

    if (!selectedTask) {
        return null
    }

    return (
        <div>
            <Separator />
            <div className="p-3">
                <div className="text-2xl font-bold">{selectedTask.title}</div>
                {selectedTask.description && (
                    <div className="text-muted mt-2 text-sm">{selectedTask.description}</div>
                )}
                <div className="h-6" />
                <div className="font-semibold text-sm">
                    {t("task.criteriaTitle")}
                </div>
                {/* Criteria Accordion */}
                {sortedCriterias.length > 0 && (
                    <>
                        <div className="h-3" />
                        <Accordion>
                            {sortedCriterias.map((criteria, index) => (
                                <Accordion.Item key={criteria.id}>
                                    <Accordion.Heading>
                                        <Accordion.Trigger className="w-full">
                                            <div className="flex w-full items-center gap-3">
                                                <div className="min-w-0 flex-1 text-left">
                                                    <div className="text-sm">
                                                        {index + 1}. {criteria.text}
                                                    </div>
                                                </div>
                                                <Chip size="sm" variant="secondary" color="accent">
                                                    {
                                                        t("task.criteriaScore", 
                                                            { score: criteria.score }
                                                        )
                                                    }
                                                </Chip>
                                                <Accordion.Indicator />
                                            </div>
                                        </Accordion.Trigger>
                                    </Accordion.Heading>
                                    <Accordion.Panel>
                                        <Accordion.Body>
                                            {criteria.hint ? (
                                                <div className="pl-9">
                                                    <MarkdownContent markdown={criteria.hint} />
                                                </div>
                                            ) : (
                                                <div className="pl-9 text-sm text-muted italic">
                                                    {t("task.criteriaNoHint")}
                                                </div>
                                            )}
                                        </Accordion.Body>
                                    </Accordion.Panel>
                                </Accordion.Item>
                            ))}
                        </Accordion>
                    </>
                )}

                {/* Review Job Status */}
                {reviewJobStatus && (
                    <>
                        <div className="h-4" />
                        <div className="flex items-center gap-2">
                            {reviewJobStatus === JobStatus.Queued && (
                                <QueueIcon className="size-5 min-w-5 min-h-5 text-muted animate-pulse" />
                            )}
                            {reviewJobStatus === JobStatus.Processing && (
                                <SparkleIcon className="size-5 min-w-5 min-h-5 text-warning animate-pulse" />
                            )}
                            {reviewJobStatus === JobStatus.Completed && (
                                <CheckCircleIcon className="size-5 min-w-5 min-h-5 text-success" />
                            )}
                            {reviewJobStatus === JobStatus.Failed && (
                                <WarningOctagonIcon className="size-5 min-w-5 min-h-5 text-danger" />
                            )}
                            <div className="text-sm text-muted">
                                {reviewJobStatus === JobStatus.Queued && t("task.jobStatus.queued")}
                                {reviewJobStatus === JobStatus.Processing && t("task.jobStatus.processing")}
                                {reviewJobStatus === JobStatus.Completed && t("task.jobStatus.completed")}
                                {reviewJobStatus === JobStatus.Failed && (reviewJobError || t("task.jobStatus.failed"))}
                            </div>
                        </div>
                    </>
                )}

                {/* Attempts Loading */}
                {attemptsSwr.isLoading && !reviewJobStatus && (
                    <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted">
                        <Spinner size="sm" />
                        {t("task.loadingResults")}
                    </div>
                )}

                {/* Attempts List */}
                {attempts.length > 0 && (
                    <>
                        <div className="h-6" />
                        <div className="text-lg font-bold">{t("task.resultsTitle")}</div>
                        <div className="h-3" />
                        <Accordion
                            expandedKeys={new Set(selectedAttemptId ? [selectedAttemptId] : [])}
                            onExpandedChange={(selection) => {
                                const key = Array.from(selection)[0]
                                dispatch(setSelectedAttemptId(key ? String(key) : undefined))
                            }}
                        >
                            {attempts.map((attempt) => (
                                <Accordion.Item key={attempt.id} id={attempt.id}>
                                    <Accordion.Heading>
                                        <Accordion.Trigger className="w-full">
                                            <div className="flex w-full items-center gap-3">
                                                <div className="flex items-center gap-3 justify-between w-full">
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex items-center gap-2 min-w-0 flex-1">
                                                            {t("task.attemptNumber", { number: attempt.attemptNumber })}
                                                            {attempt.score !== null && (
                                                                <Chip
                                                                    size="sm"
                                                                    variant="secondary"
                                                                    color={attempt.score >= 7 ? "success" : attempt.score >= 4 ? "warning" : "danger"}
                                                                >
                                                                    {t("task.attemptScore", { score: attempt.score })}
                                                                </Chip>
                                                            )}
                                                        </div>
                                                        {
                                                            attempt.shortFeedback && (
                                                                <div className="text-xs text-muted">
                                                                    {attempt.shortFeedback}
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                    {attempt.processedAt && (
                                                        <div className="text-xs text-muted">
                                                            {new Date(attempt.processedAt).toLocaleString("vi-VN")}
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <Accordion.Indicator />
                                            </div>
                                        </Accordion.Trigger>
                                    </Accordion.Heading>
                                    <Accordion.Panel>
                                        <Accordion.Body>
                                            <AttemptFeedbacksPanel />
                                        </Accordion.Body>
                                    </Accordion.Panel>
                                </Accordion.Item>
                            ))}
                        </Accordion>
                    </>
                )}
            </div>
        </div>
    )
}

/**
 * Panel that renders inside an expanded attempt.
 * Automatically fetches feedbacks via the SWR hook
 * (driven by `selectedAttemptId` in Redux).
 */
const AttemptFeedbacksPanel = () => {
    const t = useTranslations()
    const feedbacksSwr = useQueryUserPersonalTaskAttemptFeedbacksSwr()
    if (feedbacksSwr.isLoading) {
        return (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted">
                <Spinner size="sm" />
                {t("task.loadingFeedback")}
            </div>
        )
    }
    const feedbacks = feedbacksSwr.data?.data ?? []
    if (feedbacks.length === 0) {
        return (
            <div className="mt-4 text-sm text-muted italic">
                {t("task.noFeedback")}
            </div>
        )
    }
    return (
        <div className="mt-3 flex flex-col gap-3">
            {
                feedbacks.map((feedback) => (
                    <div key={feedback.id} className="flex w-full items-center">
                        <div className="flex flex-col gap-2">
                            <div className="min-w-0 flex-1 text-foreground text-left text-sm">
                                {feedback.message}
                            </div>
                            <div className="text-xs text-muted">
                                {feedback.suggestion}
                            </div>
                            {
                                feedback.location && <div className="text-xs text-accent">
                                    {feedback.location}
                                </div>
                            }
                        </div>
                    </div>        
                )
                )
            }
        </div>
    )
}

/** Colored dot based on feedback severity */
// export interface SeverityIconProps {
//     severity: MilestoneSeverity
// }
// const SeverityIcon = ({ severity }: SeverityIconProps) => {
//     const colorMap: Record<MilestoneSeverity, string> = {
//         [MilestoneSeverity.Low]: "text-green-500",
//         [MilestoneSeverity.Medium]: "text-yellow-500",
//         [MilestoneSeverity.High]: "text-danger-500",
//     }
//     const color = colorMap[severity ?? MilestoneSeverity.Low]
//     return (
//         <RadioactiveIcon className={`size-5 shrink-0 ${color}`} />
//     )
// }
