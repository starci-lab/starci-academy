"use client"

import React, {
    useCallback,
    useMemo,
} from "react"
import { useAppSelector } from "@/redux"
import {
    Separator,
} from "@heroui/react"
import _ from "lodash"
import { useTranslations } from "next-intl"
import {
    useMutateSyncPersonalProjectGithubBranchSwr,
    useMutateSyncPersonalProjectGithubSwr,
    usePersonalProjectGithubForm,
    usePersonalProjectTaskAttemptsDrawerOverlayState,
    useQueryMilestoneTaskProgressSwr,
    useQueryMilestoneTaskSwr,
    useQueryUserPersonalTaskAttemptsSwr,
    useUserMilestoneTaskFeedbacksModalOverlayState,
} from "@/hooks"
import {
    buildMilestoneTaskProgressLookup,
    isPersonalProjectTaskActionUnlocked,
} from "@/components/utils"
import { JobStatus } from "@/modules/types"
import {
    TaskSkeleton,
} from "./TaskSkeleton"
import {
    TaskLockedAlert,
} from "./TaskLockedAlert"
import {
    TaskBrief,
} from "./TaskBrief"
import {
    TaskCriteriaList,
} from "./TaskCriteriaList"
import {
    TaskCodeImplementations,
} from "./TaskCodeImplementations"
import {
    TaskResults,
} from "./TaskResults"
import {
    TaskActions,
} from "./TaskActions"

/**
 * Milestone task detail container.
 *
 * Owns SWR/redux data, the review actions and the AI job/progress derivations
 * they depend on, then renders its children (criteria, results, actions). The
 * locked-preview alert is a self-contained section that reads its own progress
 * SWR/redux and owns its navigation. `"use client"` for redux, the formik
 * review submit and overlay state.
 */
export const Task = () => {
    const t = useTranslations()
    const reviewGithubForm = usePersonalProjectGithubForm()
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
        reviewGithubForm.isSubmitting
        || (
            Boolean(reviewJobId)
        )
    const aiJobStatus: JobStatus = reviewGithubForm.isSubmitting
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

    /** Whether the evaluate / re-evaluate button should be disabled. */
    const isEvaluateDisabled = useMemo(
        () => !isActionUnlocked
            || reviewGithubForm.isSubmitting
            || attemptsSwr.isLoading
            || syncGithubSwr.isMutating
            || syncBranchSwr.isMutating,
        [
            isActionUnlocked,
            reviewGithubForm.isSubmitting,
            attemptsSwr.isLoading,
            syncGithubSwr.isMutating,
            syncBranchSwr.isMutating,
        ],
    )

    /** Whether the evaluate button is in its pending (in-flight) state. */
    const isEvaluatePending = useMemo(
        () => reviewGithubForm.isSubmitting
            || (
                Boolean(reviewJobId)
                && (
                    reviewJobStatus === JobStatus.Processing
                    || reviewJobStatus === JobStatus.Queued
                )
            ),
        [
            reviewGithubForm.isSubmitting,
            reviewJobId,
            reviewJobStatus,
        ],
    )

    /** Whether the feedback / attempts buttons are disabled. */
    const areSecondaryDisabled = !isActionUnlocked || !hasReviewAttempts

    /** Submit the GitHub review form (triggers AI evaluation). */
    const onEvaluate = useCallback(
        () => {
            void reviewGithubForm.submit()
        },
        [reviewGithubForm],
    )

    /** Open the milestone task feedback details modal. */
    const onOpenFeedbacks = useCallback(
        () => milestoneTaskFeedbacksModal.setOpen(true),
        [milestoneTaskFeedbacksModal],
    )

    /** Open the personal project attempts drawer. */
    const onOpenAttempts = useCallback(
        () => personalProjectAttemptsDrawer.setOpen(true),
        [personalProjectAttemptsDrawer],
    )

    if (!displayTask || milestoneTaskQuery.isLoading || !selectedTaskId) {
        return <TaskSkeleton />
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
                <TaskLockedAlert />
                <TaskBrief
                    briefs={displayTask.briefs ?? []}
                    lang={reviewGithubForm.lang}
                />
                {/* SCHEMA V2 tasks (with briefs) keep their rubric internal — the legacy
                    public criteria + codeImplementations are only shown for old tasks. */}
                {(displayTask.briefs?.length ?? 0) === 0 && (
                    <>
                        <div className="font-semibold">
                            {t("task.criteriaTitle")}
                        </div>
                        {sortedCriterias.length > 0 && (
                            <TaskCriteriaList criterias={sortedCriterias} />
                        )}
                        {displayTask.codeImplementations && displayTask.codeImplementations.length > 0 && (
                            <TaskCodeImplementations
                                codeImplementations={displayTask.codeImplementations}
                            />
                        )}
                    </>
                )}
                {showResultsBlock && (
                    <TaskResults
                        score={latestAttempt?.score ?? 0}
                        shortFeedback={shortFeedbackDisplay}
                    />
                )}
                <TaskActions
                    hasReviewAttempts={hasReviewAttempts}
                    isEvaluateDisabled={isEvaluateDisabled}
                    isEvaluatePending={isEvaluatePending}
                    areSecondaryDisabled={areSecondaryDisabled}
                    showAiProcessing={showAiProcessing}
                    aiJobStatus={aiJobStatus}
                    reviewJobError={reviewJobError}
                    onEvaluate={onEvaluate}
                    onOpenFeedbacks={onOpenFeedbacks}
                    onOpenAttempts={onOpenAttempts}
                />
            </div>
        </div>
    )
}
