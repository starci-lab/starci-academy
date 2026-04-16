"use client"

import { SubmissionFeedbackEntity } from "@/modules/types"
import React from "react"
import { SubmissionFeedbackSeverity } from "@/modules/types"
import { Card, Chip } from "@heroui/react"
import { LightbulbFilamentIcon, MapPinLineIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"

interface FeedbackCardProps {
    /** One feedback row from the grader. */
    submissionFeedback: SubmissionFeedbackEntity
}

export const FeedbackCard = ({ submissionFeedback }: FeedbackCardProps) => {
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
                    <Chip.Label>{t("feedback.severity.high")}</Chip.Label>
                </Chip>
            )
        case SubmissionFeedbackSeverity.Medium:
            return (
                <Chip color="warning" size="sm" variant="primary">
                    <Chip.Label>{t("feedback.severity.medium")}</Chip.Label>
                </Chip>
            )
        case SubmissionFeedbackSeverity.Low:
            return (
                <Chip color="success" size="sm" variant="primary">
                    <Chip.Label>{t("feedback.severity.low")}</Chip.Label>
                </Chip>
            )
        default:
            return (
                <Chip color="default" size="sm" variant="primary">
                    <Chip.Label>{t("feedback.severity.unknown")}</Chip.Label>
                </Chip>
            )
        }
    }

    return (
        <Card className="border border-divider bg-transparent">
            <Card.Content>
                <div className="flex items-center justify-between">
                    <div className="text-sm">
                        {message}
                    </div>
                    {getSeverityChip()}
                </div>
                {detail ? (
                    <div className="text-xs text-foreground-500">
                        {detail}
                    </div>
                ) : null}
                {suggestion ? (
                    <div className="flex items-center gap-2 text-xs text-foreground-500">
                        <LightbulbFilamentIcon className="size-4" />
                        {suggestion}
                    </div>
                ) : null}
                {location ? (
                    <div className="flex items-center gap-2 text-xs text-foreground-500">
                        <MapPinLineIcon className="size-4" />
                        {location}
                    </div>
                ) : null}
            </Card.Content>
        </Card>
    )
}
