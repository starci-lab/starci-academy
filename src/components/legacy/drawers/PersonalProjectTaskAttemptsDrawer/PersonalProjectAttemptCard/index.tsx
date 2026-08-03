"use client"

import React from "react"
import { ClockIcon, SparkleIcon } from "@phosphor-icons/react"
import { Chip, Typography, cn } from "@heroui/react"

import { useTranslations } from "next-intl"
import type { WithClassNames } from "@/modules/types/base/class-name"

export interface PersonalProjectAttemptCardProps extends WithClassNames<undefined> {
    /** Attempt sequence from API. */
    attemptNumber: number
    /** Numeric score when present. */
    score: number | null
    /** Short AI summary. */
    shortFeedback: string | null
    /** Formatted processed time label. */
    processedAtLabel: string
}

/**
 * One milestone personal-task review attempt ROW content — rendered inside a
 * {@link import("@/components/blocks/cards/SurfaceListCard").SurfaceListCardItem}
 * of the attempts drawer's `SurfaceListCard`, which owns the bordered container +
 * per-row separator/padding.
 *
 * @param props - Attempt display fields for the card.
 */
export const PersonalProjectAttemptCard = (props: PersonalProjectAttemptCardProps) => {
    const {
        attemptNumber,
        score,
        shortFeedback,
        processedAtLabel,
        className,
    } = props
    const t = useTranslations()
    const feedbackText = shortFeedback?.trim() || t("finalProject.page.attemptsDrawer.feedbackEmpty")
    const scoreChip =
        score !== null && score !== undefined ? (
            <Chip
                size="sm"
                variant="secondary"
                color={score >= 7 ? "success" : score >= 4 ? "warning" : "danger"}
            >
                {t("task.attemptScore", { score })}
            </Chip>
        ) : null

    return (
        <div className={cn("flex min-w-0 flex-1 flex-col", className)}>
            <Typography type="body-xs" color="muted">
                {t("task.attemptNumber", { number: attemptNumber })}
            </Typography>
            <div className="mt-2 flex items-center gap-2">
                <SparkleIcon className="size-4 shrink-0 text-warning-soft-foreground" />
                {scoreChip}
            </div>
            <Typography type="body-sm" className="mt-2">
                {feedbackText}
            </Typography>
            <div className="mt-2 flex items-center gap-2">
                <ClockIcon className="size-3 shrink-0 text-muted" />
                <Typography type="body-xs" color="muted">
                    {processedAtLabel}
                </Typography>
            </div>
        </div>
    )
}
