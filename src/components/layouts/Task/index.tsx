"use client"

import React, { useCallback, useEffect, useMemo } from "react"
import { useAppDispatch, useAppSelector } from "@/redux"
import { setSelectedAttemptId, setReviewJob, clearReviewJob } from "@/redux/slices"
import { MarkdownContent } from "@/components/reuseable"
import { Accordion, Chip, Spinner } from "@heroui/react"
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

export const Task = () => {
    const dispatch = useAppDispatch()
    const milestoneEntities = useAppSelector((state) => state.milestone.entities)
    const selectedTaskId = useAppSelector((state) => state.milestone.selectedTaskId)
    const selectedAttemptId = useAppSelector((state) => state.milestone.selectedAttemptId)
    const reviewJobStatus = useAppSelector((state) => state.milestone.reviewJobStatus)
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

    const handleAttemptToggle = useCallback(
        (attemptId: string) => {
            if (selectedAttemptId === attemptId) {
                dispatch(setSelectedAttemptId(undefined))
            } else {
                dispatch(setSelectedAttemptId(attemptId))
            }
        },
        [dispatch, selectedAttemptId],
    )

    if (!selectedTask) {
        return null
    }

    return (
        <div>
            {/* Task Header */}
            <div className="text-2xl font-bold">{selectedTask.title}</div>
            {selectedTask.description && (
                <div className="text-muted mt-2 text-sm">{selectedTask.description}</div>
            )}

            {/* Criteria Accordion */}
            {sortedCriterias.length > 0 && (
                <>
                    <div className="h-4" />
                    <div className="rounded-3xl border p-4">
                        <div className="mb-3 text-sm font-semibold text-muted">
                            Tiêu chí chấm điểm
                        </div>
                        <Accordion>
                            {sortedCriterias.map((criteria, index) => (
                                <Accordion.Item key={criteria.id}>
                                    <Accordion.Heading>
                                        <Accordion.Trigger className="w-full">
                                            <div className="flex w-full items-center gap-3">
                                                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                                                    {index + 1}
                                                </div>
                                                <div className="min-w-0 flex-1 text-left">
                                                    <div className="text-sm font-medium">
                                                        {criteria.text}
                                                    </div>
                                                </div>
                                                <Chip size="sm" variant="primary">
                                                    {criteria.score} điểm
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
                                                    Chưa có hướng dẫn cho tiêu chí này.
                                                </div>
                                            )}
                                        </Accordion.Body>
                                    </Accordion.Panel>
                                </Accordion.Item>
                            ))}
                        </Accordion>
                    </div>
                </>
            )}

            {/* Review Job Status */}
            {reviewJobStatus && (
                <>
                    <div className="h-4" />
                    <ReviewJobStatusBanner status={reviewJobStatus} />
                </>
            )}

            {/* Attempts Loading */}
            {attemptsSwr.isLoading && !reviewJobStatus && (
                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted">
                    <Spinner size="sm" />
                    Đang tải kết quả chấm điểm...
                </div>
            )}

            {/* Attempts List */}
            {attempts.length > 0 && (
                <>
                    <div className="h-6" />
                    <div className="text-lg font-bold">Kết quả chấm điểm</div>
                    <div className="mt-3 flex flex-col gap-4">
                        {attempts.map((attempt) => (
                            <div
                                key={attempt.id}
                                className="rounded-3xl border p-4"
                            >
                                {/* Attempt Brief Header — clickable */}
                                <button
                                    type="button"
                                    className="flex w-full items-center justify-between gap-3"
                                    onClick={() => handleAttemptToggle(attempt.id)}
                                >
                                    <div className="flex items-center gap-2">
                                        <Chip size="sm" variant="secondary">
                                            Lần #{attempt.attemptNumber}
                                        </Chip>
                                        {attempt.score !== null && (
                                            <Chip
                                                size="sm"
                                                variant="primary"
                                                color={attempt.score >= 7 ? "success" : attempt.score >= 4 ? "warning" : "danger"}
                                            >
                                                {attempt.score} điểm
                                            </Chip>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {attempt.processedAt && (
                                            <div className="text-xs text-muted">
                                                {new Date(attempt.processedAt).toLocaleString("vi-VN")}
                                            </div>
                                        )}
                                        <span className={`text-muted transition-transform ${selectedAttemptId === attempt.id ? "rotate-180" : ""}`}>
                                            ▼
                                        </span>
                                    </div>
                                </button>

                                {/* Short Feedback */}
                                {attempt.shortFeedback && (
                                    <div className="mt-3 text-sm">
                                        <MarkdownContent markdown={attempt.shortFeedback} />
                                    </div>
                                )}

                                {/* Expanded: Detailed Feedbacks (loaded on demand) */}
                                {selectedAttemptId === attempt.id && (
                                    <AttemptFeedbacksPanel />
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

/**
 * Panel that renders inside an expanded attempt.
 * Automatically fetches feedbacks via the SWR hook
 * (driven by `selectedAttemptId` in Redux).
 */
const AttemptFeedbacksPanel = () => {
    const feedbacksSwr = useQueryUserPersonalTaskAttemptFeedbacksSwr()

    if (feedbacksSwr.isLoading) {
        return (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted">
                <Spinner size="sm" />
                Đang tải feedback chi tiết...
            </div>
        )
    }

    const feedbacks = feedbacksSwr.data?.data ?? []

    if (feedbacks.length === 0) {
        return (
            <div className="mt-4 text-sm text-muted italic">
                Chưa có feedback chi tiết.
            </div>
        )
    }

    return (
        <div className="mt-3">
            <Accordion>
                {feedbacks.map((fb) => (
                    <Accordion.Item key={fb.id}>
                        <Accordion.Heading>
                            <Accordion.Trigger className="w-full">
                                <div className="flex w-full items-center gap-3">
                                    <SeverityDot severity={fb.severity} />
                                    <div className="min-w-0 flex-1 text-left text-sm">
                                        {fb.message}
                                    </div>
                                    <Accordion.Indicator />
                                </div>
                            </Accordion.Trigger>
                        </Accordion.Heading>
                        <Accordion.Panel>
                            <Accordion.Body>
                                <div className="flex flex-col gap-2 pl-6">
                                    {fb.detail && (
                                        <div className="text-sm">
                                            <MarkdownContent markdown={fb.detail} />
                                        </div>
                                    )}
                                    {fb.location && (
                                        <div className="text-xs text-muted">
                                            📍 {fb.location}
                                        </div>
                                    )}
                                    {fb.suggestion && (
                                        <div className="rounded-xl bg-muted/20 p-3">
                                            <div className="mb-1 text-xs font-semibold text-muted">
                                                💡 Gợi ý
                                            </div>
                                            <div className="text-sm">
                                                <MarkdownContent markdown={fb.suggestion} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Accordion.Body>
                        </Accordion.Panel>
                    </Accordion.Item>
                ))}
            </Accordion>
        </div>
    )
}

/** Live grading status banner */
const ReviewJobStatusBanner = ({ status }: { status: JobStatus }) => {
    const config = {
        [JobStatus.Queued]: {
            icon: <QueueIcon className="size-5 text-muted animate-pulse" />,
            label: "Đang chờ chấm điểm...",
            bg: "bg-muted/10 border-muted/30",
        },
        [JobStatus.Processing]: {
            icon: <SparkleIcon className="size-5 text-warning animate-pulse" />,
            label: "Đang chấm điểm bằng AI...",
            bg: "bg-warning/10 border-warning/30",
        },
        [JobStatus.Completed]: {
            icon: <CheckCircleIcon className="size-5 text-success" />,
            label: "Chấm điểm hoàn tất!",
            bg: "bg-success/10 border-success/30",
        },
        [JobStatus.Failed]: {
            icon: <WarningOctagonIcon className="size-5 text-danger" />,
            label: "Chấm điểm thất bại.",
            bg: "bg-danger/10 border-danger/30",
        },
    }
    const { icon, label, bg } = config[status] ?? config[JobStatus.Queued]
    return (
        <div className={`flex items-center gap-3 rounded-2xl border p-4 ${bg}`}>
            {icon}
            <div className="text-sm font-medium">{label}</div>
        </div>
    )
}

/** Colored dot based on feedback severity */
const SeverityDot = ({ severity }: { severity: string }) => {
    const colorMap: Record<string, string> = {
        low: "bg-green-500",
        medium: "bg-yellow-500",
        high: "bg-orange-500",
        critical: "bg-red-500",
    }
    const color = colorMap[severity?.toLowerCase()] ?? "bg-gray-400"
    return (
        <div className={`h-2.5 w-2.5 shrink-0 rounded-full ${color}`} />
    )
}
