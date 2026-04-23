"use client"

import { SubmissionFeedbackEntity } from "@/modules/types"
import React from "react"
import { SubmissionFeedbackSeverity } from "@/modules/types"
import { Card, Chip } from "@heroui/react"
import { MapPinLineIcon, RadioactiveIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"

/**
 * Props for {@link FeedbackCard}.
 */
interface FeedbackCardProps {
    /** One feedback row from the grader. */
    submissionFeedback: SubmissionFeedbackEntity
}

/**
 * Feedback card for a single grader note.
 *
 * @param props - Feedback row.
 */
export const FeedbackCard = (props: FeedbackCardProps) => {
    const { submissionFeedback } = props
    const {
        message,
        detail,
        severity,
        location,
        suggestion,
    } = submissionFeedback
    const t = useTranslations()

    const getSeverityChip = () => {
        switch (severity) {
        case SubmissionFeedbackSeverity.High:
            return (
                <Chip color="danger" size="sm" variant="primary">
                    <RadioactiveIcon className="size-4 min-w-4 min-h-4" />
                    <Chip.Label>{t("feedback.severity.high")}</Chip.Label>
                </Chip>
            )
        case SubmissionFeedbackSeverity.Medium:
            return (
                <Chip color="warning" size="sm" variant="primary">
                    <RadioactiveIcon className="size-4 min-w-4 min-h-4" />
                    <Chip.Label>{t("feedback.severity.medium")}</Chip.Label>
                </Chip>
            )
        case SubmissionFeedbackSeverity.Low:
            return (
                <Chip color="success" size="sm" variant="primary">
                    <RadioactiveIcon className="size-4 min-w-4 min-h-4" />
                    <Chip.Label>{t("feedback.severity.low")}</Chip.Label>
                </Chip>
            )
        default:
            return (
                <Chip color="default" size="sm" variant="primary">
                    <RadioactiveIcon className="size-4 min-w-4 min-h-4" />
                    <Chip.Label>{t("feedback.severity.unknown")}</Chip.Label>
                </Chip>
            )
        }
    }

    return (
        <Card className="bg-background p-0">
            <Card.Content>
                <div>
                    <div className="p-3">
                        <div className="flex items-center justify-between">
                            <div className="text-sm font-medium text-foreground">
                                {message}
                            </div>
                            {getSeverityChip()}
                        </div>
                        <div className="h-3" />
                        {detail ? (
                            <div className="text-xs text-muted">
                                {detail}
                            </div>
                        ) : null}
                        <div className="h-3" />
                        {location ? (
                            <div className="flex items-center gap-2 text-xs text-foreground-500">
                                <MapPinLineIcon className="size-4 min-w-4 min-h-4" />
                                {location}
                            </div>
                        ) : null}
                    </div>
                    <div className="border-b border-divider" />
                    <div className="flex flex-col gap-3 p-3">
                        {suggestion ? (
                            <div>
                                <span className="font-semibold text-accent">{t("feedback.suggestion")}: </span>
                                <span className="text-muted">{suggestion}</span>
                            </div>
                        ) : null}
                       
                    </div>
                </div>
            </Card.Content>
        </Card>
    )
}
