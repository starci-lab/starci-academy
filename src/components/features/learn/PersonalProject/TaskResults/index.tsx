"use client"

import React, { useMemo } from "react"
import {
    Surface,
    cn,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    Score,
    StarCiAIBadge,
} from "@/components/reuseable"
import {
    useQueryUserPersonalTaskAttemptsSwr,
} from "@/hooks"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link TaskResults}. */
export type TaskResultsProps = WithClassNames<undefined>

/**
 * Grading results block: AI badge, score, and short feedback.
 *
 * Self-contained: reads the latest attempt from its own SWR query.
 * Renders nothing when there are no attempts yet.
 * @param props - optional className for the root element
 */
export const TaskResults = ({
    className,
}: TaskResultsProps = {}) => {
    const t = useTranslations()
    const attemptsSwr = useQueryUserPersonalTaskAttemptsSwr()

    const attemptRows = useMemo(
        () => attemptsSwr.data?.data ?? [],
        [attemptsSwr.data?.data],
    )
    const latestAttempt = attemptRows[0]

    const shortFeedback = useMemo(() => {
        const raw = latestAttempt?.shortFeedback?.trim() ?? ""
        return raw || t("finalProject.page.attemptsDrawer.feedbackEmpty")
    }, [latestAttempt?.shortFeedback, t])

    // only show the results block when there is at least one attempt
    if (!latestAttempt) {
        return null
    }

    return (
        <div className={cn(className)}>
            <div className="h-6" />
            <div className="mt-3 flex items-center gap-2 mb-3">
                <div className="font-semibold">{t("task.resultsTitle")}</div>
                <StarCiAIBadge />
            </div>
            <Surface className="p-3 rounded-3xl">
                <div className="text-4xl font-bold text-foreground">
                    <Score current={latestAttempt.score ?? 0} max={20} />
                </div>
                <div className="mt-3 text-sm text-muted">
                    {shortFeedback}
                </div>
            </Surface>
        </div>
    )
}
