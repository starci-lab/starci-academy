"use client"

import React, { useMemo } from "react"
import { Button, Card, Chip } from "@heroui/react"
import { useTranslations } from "next-intl"
import { Spacer } from "@/components/reuseable"
import type { SubmissionAttemptEntity } from "@/modules/types"
import { dayjs, getTimeAgoLabel, getTimeAgoMessage } from "@/modules/dayjs"
import { useAppSelector } from "@/redux"

/**
 * Props for a single submission-attempt card.
 */
export interface SubmissionAttemptCardProps {
    /** The grading / attempt record to display. */
    submissionAttempt: SubmissionAttemptEntity
    /** Max points for the requirement (challenge submission), used for `score/max` display. */
    maxScore: number | undefined
    /** Opens the feedback details layer (binds the selected attempt in Redux). */
    onViewDetails: () => void
    /** Opens this attempt’s submission URL in a new tab. */
    onViewSubmission: () => void
}


/**
 * Card showing score, short feedback, and actions (view details / open submission) for one attempt.
 *
 * @param props - Attempt row, max score, and view-details / open-submission callbacks.
 */
export const SubmissionAttemptCard = (props: SubmissionAttemptCardProps) => {
    const { submissionAttempt, maxScore, onViewDetails, onViewSubmission } = props
    const t = useTranslations()
    const config = useAppSelector((state) => state.system.config)
    const [
        scoreLabel, 
        scoreColor
    ] = useMemo(
        () => {
            const max = maxScore ?? 0
            const requiredScore = (config?.challenge?.passThreshold ?? 0) * max
            // if the score is greater than the required score, return success
            let scoreColor: "danger" | "success" = "danger"
            if ((submissionAttempt.score ?? 0) >= requiredScore) {
                scoreColor = "success"
            }
            // if the score is less than the required score, return danger
            if ((submissionAttempt.score ?? 0) < requiredScore) {
                scoreColor = "danger"
            }
            return [`${submissionAttempt.score}/${max}`, scoreColor]
        }, [config?.challenge?.passThreshold, maxScore, submissionAttempt.score])

    const processedAgo = useMemo(() => {
        if (submissionAttempt.processedAt == null) {
            return null
        }
        return getTimeAgoLabel(getTimeAgoMessage(dayjs(submissionAttempt.processedAt)), t)
    }, [submissionAttempt.processedAt, t])
    
    return (
        <Card className="bg-background">
            <Card.Content>
                <div>
                    <div className="flex items-center justify-between gap-3">
                        <div className="font-semibold text-foreground">
                            {t("submissionAttempts.attemptLine", {
                                number: submissionAttempt.attemptNumber,
                            })}
                            {processedAgo != null ? (
                                <span className="font-normal text-muted">
                                    {" · "}
                                    {processedAgo}
                                </span>
                            ) : null}
                        </div>
                        <Chip
                            color={scoreColor}
                            size="sm"
                            variant="soft"
                        >
                            <Chip.Label>
                                {scoreLabel}
                            </Chip.Label>
                        </Chip>
                    </div>
                    <Spacer y={3} />
                    <div className="text-sm text-muted">
                        {submissionAttempt.shortFeedback ?? ""}
                    </div>
                    <Spacer y={3} />
                    <div className="flex items-center gap-2">
                        <Button
                            onPress={onViewDetails}
                        >
                            {t("submissionAttempts.viewDetails")}
                        </Button>
                        <Button
                            variant="secondary"
                            onPress={onViewSubmission}
                        >
                            {t("submissionAttempts.viewSubmission")}
                        </Button>
                    </div>
                </div>
            </Card.Content>
        </Card>
    )
}
