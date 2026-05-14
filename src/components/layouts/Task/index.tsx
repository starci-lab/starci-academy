"use client"

import React, { useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/redux"
import { setSelectedTaskId } from "@/redux/slices"
import { AIProcessingText, MarkdownContent, Score, StarCiAIBadge } from "@/components/reuseable"
import {
    Accordion,
    Alert,
    Button,
    Chip,
    Separator,
    Skeleton,
    Spinner,
    Surface,
    cn,
} from "@heroui/react"
import _ from "lodash"
import { useTranslations, useLocale } from "next-intl"
import {
    useMutateSyncPersonalProjectGithubBranchSwr,
    useMutateSyncPersonalProjectGithubSwr,
    usePersonalProjectGithubFormik,
    usePersonalProjectTaskAttemptsDrawerOverlayState,
    useQueryMilestoneTaskProgressSwr,
    useQueryMilestoneTaskSwr,
    useQueryUserPersonalTaskAttemptsSwr,
    useUserMilestoneTaskFeedbacksModalOverlayState,
} from "@/hooks/singleton"
import {
    buildMilestoneTaskProgressLookup,
    isPersonalProjectTaskActionUnlocked,
} from "@/components/utils"
import { pathConfig } from "@/resources/path"
import { JobCategory, JobStatus } from "@/modules/types"
import { ScanIcon } from "@phosphor-icons/react"
/**
 * Milestone task detail: criteria, latest review summary under “grading results”, and drawer entry.
 */
export const Task = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const dispatch = useAppDispatch()
    const reviewGithubFormik = usePersonalProjectGithubFormik()
    const syncGithubSwr = useMutateSyncPersonalProjectGithubSwr()
    const syncBranchSwr = useMutateSyncPersonalProjectGithubBranchSwr()
    const progressSwr = useQueryMilestoneTaskProgressSwr()
    const personalProjectAttemptsDrawer = usePersonalProjectTaskAttemptsDrawerOverlayState()
    const milestoneTaskFeedbacksModal = useUserMilestoneTaskFeedbacksModalOverlayState()
    const attemptsSwr = useQueryUserPersonalTaskAttemptsSwr()
    const milestoneTaskQuery = useQueryMilestoneTaskSwr()
    const milestoneEntities = useAppSelector((state) => state.milestone.entities)
    const selectedTaskDetail = useAppSelector((state) => state.milestone.selectedTaskDetail)
    const selectedTaskId = useAppSelector((state) => state.milestone.selectedTaskId)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    const milestoneTaskIdToJobId = useAppSelector((state) => state.milestone.milestoneTaskIdToJobId)
    const jobStatusByJobId = useAppSelector((state) => state.socketIo.jobStatusByJobId)

    const attemptRows = useMemo(
        () => attemptsSwr.data?.data ?? [],
        [attemptsSwr.data?.data],
    )
    const hasReviewAttempts = attemptRows.length > 0
    const latestAttempt = attemptRows[0]
    const showResultsBlock = hasReviewAttempts && Boolean(latestAttempt)
    const shortFeedbackDisplay = useMemo(() => {
        const raw = latestAttempt?.shortFeedback?.trim() ?? ""
        return raw || t("finalProject.page.attemptsDrawer.feedbackEmpty")
    }, [
        latestAttempt?.shortFeedback,
        t,
    ])

    const taskFromMilestones = useMemo(() => {
        if (!selectedTaskId) return undefined
        for (const milestone of milestoneEntities) {
            const found = milestone.tasks?.find((task) => task.id === selectedTaskId)
            if (found) return found
        }
        return undefined
    }, [milestoneEntities, selectedTaskId])

    const displayTask = useMemo(() => {
        if (!selectedTaskId) return undefined
        if (selectedTaskDetail?.id === selectedTaskId) {
            return selectedTaskDetail
        }
        return taskFromMilestones
    }, [selectedTaskId, selectedTaskDetail, taskFromMilestones])

    const sortedCriterias = useMemo(() => {
        if (!displayTask?.criterias) return []
        return _.cloneDeep(displayTask.criterias)
            .sort((prev, next) => prev.orderIndex - next.orderIndex)
    }, [displayTask?.criterias])

    const reviewJobId = selectedTaskId ? milestoneTaskIdToJobId[selectedTaskId] : undefined
    const reviewJobEnvelope = reviewJobId ? jobStatusByJobId[reviewJobId] : undefined
    const reviewJobStatus = reviewJobEnvelope?.data?.status
    const reviewJobError = reviewJobEnvelope?.data?.error

    const showAiProcessing =
        reviewGithubFormik.isSubmitting
        || (
            Boolean(reviewJobId)
        )
    const aiJobStatus: JobStatus = reviewGithubFormik.isSubmitting
        ? JobStatus.Processing
        : (reviewJobStatus ?? JobStatus.Processing)

    const progressLookup = useMemo(
        () => buildMilestoneTaskProgressLookup(
            progressSwr.data?.milestoneTaskProgress?.data?.completionTasks,
        ),
        [progressSwr.data],
    )
    const currentTaskId = progressSwr.data?.milestoneTaskProgress?.data?.currentTask?.id

    const isActionUnlocked = useMemo(
        () => {
            if (!selectedTaskId) {
                return true
            }
            if (progressSwr.isLoading) {
                return true
            }
            return isPersonalProjectTaskActionUnlocked(
                selectedTaskId,
                progressLookup,
                currentTaskId,
            )
        },
        [
            selectedTaskId,
            progressLookup,
            currentTaskId,
            progressSwr.isLoading,
        ],
    )

    const isActionLocked = Boolean(selectedTaskId) && !isActionUnlocked
    const canGoToCurrentTask = Boolean(
        currentTaskId
        && selectedTaskId
        && currentTaskId !== selectedTaskId,
    )

    if (!displayTask || milestoneTaskQuery.isLoading || !selectedTaskId) {
        return (
            <>
                <Separator />
                <div className="p-3">
                    <Skeleton className="h-[18px] w-2/3 rounded-full my-[5px]" />
                    <div className="flex flex-col mt-2">
                        <Skeleton className="h-[14px] w-full rounded-full my-[3px]" />
                        <Skeleton className="h-[14px] w-2/3 rounded-full my-[3px]" />
                        <Skeleton className="h-[14px] w-1/2 rounded-full my-[3px]" />
                    </div>
                    <div className="h-3" />
                    <Skeleton className="h-4 my-1 rounded-full w-1/2" />
                    <div className="rounded-3xl p-3 bg-surface">
                        {
                            Array.from(
                                {
                                    length: 3,
                                },
                                (_, index) => (
                                    <React.Fragment key={`task-criteria-skeleton-${index}`}>
                                        <div className="p-3">
                                            <Skeleton className="h-[14px] w-2/3 my-[3px]" />
                                        </div>
                                        <Separator className="last:hidden" />
                                    </React.Fragment>
                                ),
                            )
                        }
                    </div>
                </div>
            </>
        )
    }

    return (
        <div>
            <Separator />
            <div className="p-3">
                <div className="text-lg font-semibold">{displayTask.title}</div>
                {displayTask.description && (
                    <div className="text-muted mt-2 text-sm">{displayTask.description}</div>
                )}
                <div className="h-3" />
                {
                    isActionLocked ? (
                        <>
                            <Alert status="warning" className="shadow-none bg-warning/10">
                                <Alert.Indicator />
                                <Alert.Content className="gap-2">
                                    <Alert.Title>{t("task.previewLockedAlertTitle")}</Alert.Title>
                                    <Alert.Description>
                                        {t("task.previewLockedAlertDescription")}
                                    </Alert.Description>
                                    {
                                        canGoToCurrentTask ? (
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                className="w-fit shrink-0 bg-background text-warning"
                                                onPress={() => {
                                                    if (!currentTaskId || !courseDisplayId) {
                                                        return
                                                    }
                                                    dispatch(setSelectedTaskId(currentTaskId))
                                                    router.push(
                                                        pathConfig().locale(locale).course(courseDisplayId).learn().personalProject(currentTaskId).build(),
                                                    )
                                                }}
                                            >
                                                {t("task.previewLockedGoToCurrentTaskButton")}
                                            </Button>
                                        )
                                            : null
                                    }
                                </Alert.Content>
                            </Alert>
                            <div className="h-3" />
                        </>
                    )
                        : null
                }
                <div className="font-semibold">
                    {t("task.criteriaTitle")}
                </div>
                {sortedCriterias.length > 0 && (
                    <>
                        <div className="h-3" />
                        <Accordion allowsMultipleExpanded variant="surface">
                            {sortedCriterias.map((criteria, index) => (
                                <Accordion.Item key={criteria.id}>
                                    <Accordion.Heading>
                                        <Accordion.Trigger className="w-full p-3">
                                            <div className="flex w-full items-center gap-3">
                                                <div className="min-w-0 flex-1 text-left">
                                                    <div className="text-sm">
                                                        {index + 1}. {criteria.text}
                                                    </div>
                                                </div>
                                                <Chip size="sm" variant="secondary" color="accent">
                                                    {
                                                        t("task.criteriaScore",
                                                            { score: criteria.score },
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
                {
                    showResultsBlock && (
                        <>
                            <div className="h-6" />
                            <div className="mt-3 flex items-center gap-2  mb-3">
                                <div className="font-semibold">{t("task.resultsTitle")}</div>
                                <StarCiAIBadge />
                            </div>
                            <Surface className="p-3 rounded-3xl">
                                <div className="text-4xl font-bold text-foreground">
                                    <Score current={latestAttempt?.score ?? 0} max={20} />
                                </div>
                                <div className="mt-3 text-sm text-muted">
                                    {shortFeedbackDisplay}
                                </div>
                            </Surface>
                        </>
                    )
                }
                <div
                    className={
                        cn(
                            "mt-3 flex flex-wrap items-center gap-2",
                        )
                    }
                >
                    <Button
                        size="lg"
                        isDisabled={
                            !isActionUnlocked
                            || reviewGithubFormik.isSubmitting
                            || attemptsSwr.isLoading
                            || syncGithubSwr.isMutating
                            || syncBranchSwr.isMutating
                        }
                        isPending={
                            reviewGithubFormik.isSubmitting
                            || (
                                Boolean(reviewJobId)
                                && (
                                    reviewJobStatus === JobStatus.Processing
                                    || reviewJobStatus === JobStatus.Queued
                                )
                            )
                        }
                        onPress={() => {
                            void reviewGithubFormik.submitForm()
                        }}
                    >
                        {
                            (
                                {
                                    isPending,
                                }
                            ) => {
                                return (
                                    <>
                                        {isPending ? <Spinner color="current" size="sm" /> : <ScanIcon className="size-4" />}
                                        {hasReviewAttempts
                                            ? t("finalProject.page.submitGithub.ctaReEvaluate")
                                            : t("finalProject.page.submitGithub.ctaEvaluate")}
                                    </>
                                )
                            }
                        }
                    </Button>
                    <Button
                        size="lg"
                        variant="secondary"
                        isDisabled={!isActionUnlocked || !hasReviewAttempts}
                        onPress={() => milestoneTaskFeedbacksModal.setOpen(true)}
                    >
                        {t("task.openFeedbackDetailsButton")}
                    </Button>
                    <Button
                        size="lg"
                        variant="secondary"
                        isDisabled={!isActionUnlocked || !hasReviewAttempts}
                        onPress={() => personalProjectAttemptsDrawer.setOpen(true)}
                    >
                        {t("finalProject.page.attemptsDrawer.openListButton")}
                    </Button>
                </div>
                {
                    showAiProcessing && (
                        <>
                            <div className="h-3" />
                            <AIProcessingText
                                jobCategory={JobCategory.ReviewTask}
                                jobStatus={aiJobStatus}
                                error={reviewJobError}
                            />
                        </>
                    )
                }
            </div>
        </div>
    )
}
