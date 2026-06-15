"use client"

import { DiamondExclamation as RadioactiveIcon, MapPin as MapPinLineIcon } from "@gravity-ui/icons"
import type { UserMilestoneTaskAttemptFeedbackEntity } from "@/modules/types"
import { MilestoneSeverity } from "@/modules/types"
import { Card, Chip, cn } from "@heroui/react"
import React from "react"
import { useTranslations } from "next-intl"
import type { WithClassNames } from "@/modules/types/base/class-name"


/**
 * Props for {@link MilestoneFeedbackCard}.
 */
interface MilestoneFeedbackCardProps extends WithClassNames<undefined> {
    /** One structured feedback row from the latest milestone-task attempt. */
    feedback: UserMilestoneTaskAttemptFeedbackEntity
}

/**
 * Card showing message, severity, optional location, and suggestion for a milestone task feedback row.
 *
 * @param props - Feedback entity from the grader.
 */
export const MilestoneFeedbackCard = (props: MilestoneFeedbackCardProps) => {
    const { feedback, className } = props
    const {
        message,
        severity,
        location,
        suggestion,
    } = feedback
    const t = useTranslations()

    const getSeverityChip = () => {
        switch (severity) {
        case MilestoneSeverity.High:
            return (
                <Chip color="danger" size="sm" variant="primary">
                    <RadioactiveIcon className="size-4 min-w-4 min-h-4" />
                    <Chip.Label>{t("feedback.severity.high")}</Chip.Label>
                </Chip>
            )
        case MilestoneSeverity.Medium:
            return (
                <Chip color="warning" size="sm" variant="primary">
                    <RadioactiveIcon className="size-4 min-w-4 min-h-4" />
                    <Chip.Label>{t("feedback.severity.medium")}</Chip.Label>
                </Chip>
            )
        case MilestoneSeverity.Low:
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
        <Card className={cn("bg-background p-0", className)}>
            <Card.Content>
                <div>
                    <div className="p-3">
                        <div className="flex items-center justify-between gap-1.5">
                            <div className="min-w-0 flex-1 text-sm font-medium text-foreground">
                                {message}
                            </div>
                            {getSeverityChip()}
                        </div>
                        <div className="h-3" />
                        {location ? (
                            <div className="flex items-center gap-1.5 text-xs text-muted">
                                <MapPinLineIcon className="size-4 min-w-4 min-h-4 shrink-0" />
                                <span className="min-w-0 break-words">{location}</span>
                            </div>
                        ) : null}
                    </div>
                    {suggestion ? (
                        <>
                            <div className="border-b border-divider" />
                            <div className="flex flex-col gap-3 p-3">
                                <div>
                                    <span className="font-semibold text-accent">{t("task.suggestionLabel")}: </span>
                                    <span className="text-muted">{suggestion}</span>
                                </div>
                            </div>
                        </>
                    ) : null}
                </div>
            </Card.Content>
        </Card>
    )
}
