"use client"

import { Aperture as ScanIcon } from "@gravity-ui/icons"
import React from "react"
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
    type JobStatus,
} from "@/modules/types"

/** Props for {@link TaskActions}. */
export interface TaskActionsProps {
    /** Whether the user already has review attempts (drives evaluate copy). */
    hasReviewAttempts: boolean
    /** Whether the evaluate button is disabled. */
    isEvaluateDisabled: boolean
    /** Whether the evaluate button is in its pending state. */
    isEvaluatePending: boolean
    /** Whether the secondary (feedback/attempts) buttons are disabled. */
    areSecondaryDisabled: boolean
    /** Whether the AI processing footer should render. */
    showAiProcessing: boolean
    /** Job status passed to the AI processing footer. */
    aiJobStatus: JobStatus
    /** Optional review job error message. */
    reviewJobError?: string
    /** Fired when the evaluate / re-evaluate button is pressed. */
    onEvaluate: () => void
    /** Fired when the "open feedback details" button is pressed. */
    onOpenFeedbacks: () => void
    /** Fired when the "open attempts list" button is pressed. */
    onOpenAttempts: () => void
}

/**
 * Action row for the task panel: evaluate, feedback, attempts, plus AI status.
 *
 * Presentational: renders buttons + AI footer from flags/handlers, no logic.
 * @param props - button states, AI status flags and the press handlers
 */
export const TaskActions = ({
    hasReviewAttempts,
    isEvaluateDisabled,
    isEvaluatePending,
    areSecondaryDisabled,
    showAiProcessing,
    aiJobStatus,
    reviewJobError,
    onEvaluate,
    onOpenFeedbacks,
    onOpenAttempts,
}: TaskActionsProps) => {
    const t = useTranslations()
    return (
        <>
            <div className={cn("mt-3", "flex flex-wrap items-center gap-2")}>
                <Button
                    size="lg"
                    isDisabled={isEvaluateDisabled}
                    isPending={isEvaluatePending}
                    onPress={onEvaluate}
                >
                    {({ isPending }) => (
                        <>
                            {isPending ? <Spinner color="current" /> : <ScanIcon className="size-5" />}
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
