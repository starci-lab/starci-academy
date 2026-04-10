import { SubmissionFeedbackEntity } from "@/modules/types"
import React from "react"
import { SubmissionFeedbackSeverity } from "@/modules/types"
import { StarCiCard, StarCiCardBody, StarCiChip } from "@/components/atomic"
import { LightbulbFilamentIcon, MapPinLineIcon } from "@phosphor-icons/react"
import { Spacer } from "@heroui/react"

interface FeedbackCardProps {
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

    const getSeverityChip = () => {
        switch (severity) {
        case SubmissionFeedbackSeverity.High:
            return <StarCiChip color="danger" size="sm" variant="flat">High</StarCiChip>
        case SubmissionFeedbackSeverity.Medium:
            return <StarCiChip color="warning" size="sm" variant="flat">Medium</StarCiChip>
        case SubmissionFeedbackSeverity.Low:
            return <StarCiChip color="primary" size="sm" variant="flat">Low</StarCiChip>
        default:
            return <StarCiChip color="secondary" size="sm" variant="flat">Unknown</StarCiChip>
        }
    }

    return (
        <StarCiCard shadow="none" className="bg-transparent border-divider border">
            <StarCiCardBody>
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="text-sm">
                        {message}
                    </div>
                    {getSeverityChip()}
                </div>
                <Spacer y={3} />
                {/* Detail */}
                {detail && (
                    <div className="text-xs text-foreground-500">
                        {detail}
                    </div>
                )}
                <Spacer y={2} />
                {/* Suggestion */}
                {suggestion && (
                    <div className="flex items-center gap-2 text-foreground-500 text-xs">
                        <LightbulbFilamentIcon className="size-4" />
                        {suggestion}
                    </div>
                )}
                <Spacer y={2} />
                {location && (
                    <div className="flex items-center gap-2 text-foreground-500 text-xs">
                        <MapPinLineIcon className="size-4" />
                        {location}
                    </div>
                )}
            </StarCiCardBody>
        </StarCiCard>
    )
}