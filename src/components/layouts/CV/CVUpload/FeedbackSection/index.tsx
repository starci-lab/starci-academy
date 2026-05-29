"use client"

import React from "react"
import {
    Button,
    Spinner,
} from "@heroui/react"
import {
    ScanIcon,
} from "@phosphor-icons/react"
import {
    useTranslations,
} from "next-intl"
import {
    AIProcessingText,
    MarkdownContent,
    StarCiAIBadge,
} from "@/components/reuseable"
import {
    JobCategory,
    JobStatus,
} from "@/modules/types"

/** Props for {@link FeedbackSection}. */
export interface FeedbackSectionProps {
    /** Markdown feedback body to render. */
    feedbackMarkdown: string
    /** Whether the backend already returned persisted AI feedback (re-run copy). */
    hasPersistedAiFeedback: boolean
    /** Whether the review action is disabled (submitting/loading). */
    isReviewDisabled: boolean
    /** Whether the review action is pending (submitting or job in flight). */
    isReviewPending: boolean
    /** Active CV review job id, if any. */
    activeCvReviewJobId?: string
    /** Active CV review job status, if any. */
    activeCvReviewJobStatus?: JobStatus
    /** Active CV review job error message, if any. */
    activeCvReviewJobError?: string
    /** Fired to queue (or re-run) the AI CV review. */
    onReview: () => void
    /** Fired to open the CV submission attempts drawer. */
    onOpenAttempts: () => void
}

/**
 * AI feedback section: markdown feedback, review/re-run action, attempts action,
 * and inline job-status line.
 *
 * Presentational: renders the provided feedback/state, no logic.
 * @param props - {@link FeedbackSectionProps}
 */
export const FeedbackSection = ({
    feedbackMarkdown,
    hasPersistedAiFeedback,
    isReviewDisabled,
    isReviewPending,
    activeCvReviewJobId,
    activeCvReviewJobStatus,
    activeCvReviewJobError,
    onReview,
    onOpenAttempts,
}: FeedbackSectionProps) => {
    const t = useTranslations()
    return (
        <div>
            <div className="flex items-center gap-2 text-base font-semibold">
                {t("cv.submission.feedbackTitle")}
                <StarCiAIBadge />
            </div>
            <div className="h-3" />
            <div className="rounded-3xl mb-3 bg-surface p-3 text-muted text-sm">
                <MarkdownContent markdown={feedbackMarkdown} />
            </div>
            <div className="flex items-center gap-2">
                <Button
                    size="lg"
                    isDisabled={isReviewDisabled}
                    isPending={isReviewPending}
                    onPress={onReview}
                >
                    {
                        (
                            {
                                isPending,
                            }
                        ) => {
                            return (
                                <>
                                    {isPending ? <Spinner color="current" /> : <ScanIcon className="size-5" />}
                                    <span>
                                        {t(
                                            hasPersistedAiFeedback
                                                ? "cv.submission.reviewActionRerun"
                                                : "cv.submission.reviewAction",
                                        )}
                                    </span>
                                </>
                            )
                        }
                    }
                </Button>
                <Button
                    size="lg"
                    variant="secondary"
                    onPress={onOpenAttempts}
                >
                    {t("cv.submission.attemptsDrawer.openButton")}
                </Button>
            </div>
            {
                activeCvReviewJobId !== undefined && activeCvReviewJobStatus !== undefined ? (
                    <AIProcessingText
                        className="mt-3"
                        jobCategory={JobCategory.ReviewCv}
                        jobStatus={activeCvReviewJobStatus}
                        error={activeCvReviewJobError}
                    />
                ) : null
            }
        </div>
    )
}
