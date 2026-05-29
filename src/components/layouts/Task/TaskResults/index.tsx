"use client"

import React from "react"
import {
    Surface,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    Score,
    StarCiAIBadge,
} from "@/components/reuseable"

/** Props for {@link TaskResults}. */
export interface TaskResultsProps {
    /** Latest attempt score (out of 20). */
    score: number
    /** Already-resolved short feedback text. */
    shortFeedback: string
}

/**
 * Grading results block: AI badge, score, and short feedback.
 *
 * Presentational: renders the supplied score + feedback, no logic.
 * @param props - latest score and short feedback text
 */
export const TaskResults = ({
    score,
    shortFeedback,
}: TaskResultsProps) => {
    const t = useTranslations()
    return (
        <>
            <div className="h-6" />
            <div className="mt-3 flex items-center gap-2  mb-3">
                <div className="font-semibold">{t("task.resultsTitle")}</div>
                <StarCiAIBadge />
            </div>
            <Surface className="p-3 rounded-3xl">
                <div className="text-4xl font-bold text-foreground">
                    <Score current={score} max={20} />
                </div>
                <div className="mt-3 text-sm text-muted">
                    {shortFeedback}
                </div>
            </Surface>
        </>
    )
}
