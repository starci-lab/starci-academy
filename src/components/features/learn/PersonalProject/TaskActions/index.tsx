"use client"

import { SparkleIcon } from "@phosphor-icons/react"
import React, { useCallback, useMemo } from "react"
import {
    Button,
    Spinner,
    cn,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    AIProcessingText,
} from "@/components/reuseable"
import {
    JobCategory,
    JobStatus,
} from "@/modules/types"
import {
    usePersonalProjectGithubForm,
    usePersonalProjectTaskAttemptsDrawerOverlayState,
    useUserMilestoneTaskFeedbacksModalOverlayState,
    useQueryMilestoneTaskProgressSwr,
    useQueryUserPersonalTaskAttemptsSwr,
    useMutateSyncPersonalProjectGithubSwr,
    useMutateSyncPersonalProjectGithubBranchSwr,
} from "@/hooks"
import {
    useAppSelector,
} from "@/redux"
import {
    buildMilestoneTaskProgressLookup,
    isPersonalProjectTaskActionUnlocked,
} from "@/components/utils"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for {@link TaskActions}. */
export type TaskActionsProps = WithClassNames<undefined>

/**
 * Action row for the task panel: evaluate, feedback, attempts, plus AI status.
 *
 * Self-contained: reads all state from redux/SWR/zustand hooks — no callback or
 * flag props needed. Dispatches the submit/open actions directly.
 * @param props - optional className for the root element
 */
export const TaskActions = ({
    className,
}: TaskActionsProps = {}) => {
    const t = useTranslations()
    const reviewGithubForm = usePersonalProjectGithubForm()
    const syncGithubSwr = useMutateSyncPersonalProjectGithubSwr()
    const syncBranchSwr = useMutateSyncPersonalProjectGithubBranchSwr()
    const progressSwr = useQueryMilestoneTaskProgressSwr()
    const personalProjectAttemptsDrawer = usePersonalProjectTaskAttemptsDrawerOverlayState()
    const milestoneTaskFeedbacksModal = useUserMilestoneTaskFeedbacksModalOverlayState()
    const attemptsSwr = useQueryUserPersonalTaskAttemptsSwr()

    const selectedTaskId = useAppSelector((state) => state.milestone.selectedTaskId)
    const milestoneTaskIdToJobId = useAppSelector((state) => state.milestone.milestoneTaskIdToJobId)
    const jobStatusByJobId = useAppSelector((state) => state.socketIo.jobStatusByJobId)

    const attemptRows = useMemo(
        () => attemptsSwr.data?.data ?? [],
        [attemptsSwr.data?.data],
    )
    const hasReviewAttempts = attemptRows.length > 0

    const reviewJobId = selectedTaskId ? milestoneTaskIdToJobId[selectedTaskId] : undefined
    const reviewJobEnvelope = reviewJobId ? jobStatusByJobId[reviewJobId] : undefined
    const reviewJobStatus = reviewJobEnvelope?.data?.status
    const reviewJobError = reviewJobEnvelope?.data?.error

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

    const areSecondaryDisabled = !isActionUnlocked || !hasReviewAttempts

    const showAiProcessing =
        reviewGithubForm.isSubmitting
        || Boolean(reviewJobId)

    const aiJobStatus: JobStatus = reviewGithubForm.isSubmitting
        ? JobStatus.Processing
        : (reviewJobStatus ?? JobStatus.Processing)

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

    return (
        <>
            <div className={cn("flex flex-wrap items-center gap-2", className)}>
                <Button
                    size="lg"
                    isDisabled={isEvaluateDisabled}
                    isPending={isEvaluatePending}
                    onPress={onEvaluate}
                >
                    {({ isPending }) => (
                        <>
                            {isPending ? <Spinner color="current" /> : <SparkleIcon className="size-5" />}
                            {hasReviewAttempts
                                ? t("finalProject.page.submitGithub.ctaReEvaluate")
                                : t("finalProject.page.submitGithub.ctaEvaluate")}
                        </>
                    )}
                </Button>
                <Button
                    size="lg"
                    variant="secondary"
                    isDisabled={areSecondaryDisabled}
                    onPress={onOpenFeedbacks}
                >
                    {t("task.openFeedbackDetailsButton")}
                </Button>
                <Button
                    size="lg"
                    variant="secondary"
                    isDisabled={areSecondaryDisabled}
                    onPress={onOpenAttempts}
                >
                    {t("finalProject.page.attemptsDrawer.openListButton")}
                </Button>
            </div>
            {showAiProcessing && (
                <>
                    <div className="h-3" />
                    <AIProcessingText
                        jobCategory={JobCategory.ReviewTask}
                        jobStatus={aiJobStatus}
                        error={reviewJobError}
                    />
                </>
            )}
        </>
    )
}
