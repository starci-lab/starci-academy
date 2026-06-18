"use client"

import { Bulb as LightbulbIcon, Check as CheckIcon, DiamondExclamation as RadioactiveIcon, MapPin as MapPinLineIcon } from "@gravity-ui/icons"
import { MarkdownContent } from "@/components/reuseable"
import type { SubmissionFeedbackEntity } from "@/modules/types"
import { SubmissionFeedbackSeverity } from "@/modules/types"
import { buildGithubFileUrl } from "@/modules/utils"
import { Card, Chip, cn, Link } from "@heroui/react"
import { useTranslations } from "next-intl"
import React, { useMemo } from "react"
import type { WithClassNames } from "@/modules/types"


/**
 * Props for {@link FeedbackCard}.
 */
interface FeedbackCardProps extends WithClassNames<undefined> {
    /** One feedback row from the grader. */
    submissionFeedback: SubmissionFeedbackEntity
    /** GitHub repo URL for the selected submission attempt (used for file links). */
    repositoryUrl?: string
}

/**
 * Feedback card for a single grader note.
 *
 * @param props - Feedback row.
 */
export const FeedbackCard = (props: FeedbackCardProps) => {
    const { submissionFeedback, repositoryUrl, className } = props
    const {
        message,
        detail,
        severity,
        location,
        suggestion,
    } = submissionFeedback
    const t = useTranslations()

    const statusChip = useMemo(() => {
        if (!suggestion) {
            return (
                <Chip color="success" size="sm" variant="soft" className="shrink-0">
                    <CheckIcon className="size-5 min-h-4 min-w-4" />
                    <Chip.Label>{t("feedback.perfect")}</Chip.Label>
                </Chip>
            )
        }
        switch (severity) {
        case SubmissionFeedbackSeverity.High:
            return (
                <Chip color="danger" size="sm" variant="soft" className="shrink-0">
                    <RadioactiveIcon className="size-5 min-h-4 min-w-4" />
                    <Chip.Label>{t("feedback.severity.high")}</Chip.Label>
                </Chip>
            )
        case SubmissionFeedbackSeverity.Medium:
            return (
                <Chip color="warning" size="sm" variant="soft" className="shrink-0">
                    <RadioactiveIcon className="size-5 min-h-4 min-w-4" />
                    <Chip.Label>{t("feedback.severity.medium")}</Chip.Label>
                </Chip>
            )
        case SubmissionFeedbackSeverity.Low:
            return (
                <Chip color="default" size="sm" variant="soft" className="shrink-0">
                    <RadioactiveIcon className="size-5 min-h-4 min-w-4" />
                    <Chip.Label>{t("feedback.severity.low")}</Chip.Label>
                </Chip>
            )
        default:
            return (
                <Chip color="warning" size="sm" variant="soft" className="shrink-0">
                    <RadioactiveIcon className="size-5 min-h-4 min-w-4" />
                    <Chip.Label>{t("feedback.severity.unknown")}</Chip.Label>
                </Chip>
            )
        }
    }, [severity, suggestion, t])

    const locationLabel = useMemo(() => {
        if (location == null) {
            return null
        }
        const trimmed = location.trim()
        if (trimmed.length === 0 || trimmed.toLowerCase() === "null") {
            return null
        }
        return trimmed
    }, [location])

    const locationHref = useMemo(() => {
        if (!locationLabel || !repositoryUrl) {
            return null
        }
        return buildGithubFileUrl({
            repositoryUrl,
            location: locationLabel,
        })
    }, [locationLabel, repositoryUrl])

    const showFooter = Boolean(locationLabel || suggestion)

    return (
        <Card className={cn("border border-divider bg-transparent p-0 shadow-none", className)}>
            <Card.Content>
                <div className="flex flex-col gap-3 p-3">
                    <div>
                        {statusChip}
                    </div>
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1 space-y-1.5">
                            <MarkdownContent markdown={message} className="text-sm font-medium" />
                            {detail ? (
                                <MarkdownContent markdown={detail} className="text-xs text-muted" />
                            ) : null}
                        </div>
                    </div>
                    {showFooter ? (
                        <div
                            className="-mx-3 border-t border-divider"
                            role="separator"
                        />
                    ) : null}
                    {locationLabel ? (
                        <div className="flex items-center gap-1.5 text-xs text-muted">
                            <MapPinLineIcon className="size-5 min-h-5 min-w-5 shrink-0" />
                            {locationHref ? (
                                <Link
                                    href={locationHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={t("feedback.openFileOnGithub")}
                                    className="min-w-0 break-words text-accent hover:underline"
                                >
                                    {locationLabel}
                                </Link>
                            ) : (
                                <span className="min-w-0 break-words">{locationLabel}</span>
                            )}
                        </div>
                    ) : null}
                    {suggestion ? (
                        <div className="flex items-center gap-1.5">
                            <LightbulbIcon className="size-5 h-5 w-5 shrink-0 text-muted" />
                            <MarkdownContent markdown={suggestion} className="text-sm text-muted" />
                        </div>
                    ) : null}
                </div>
            </Card.Content>
        </Card>
    )
}
