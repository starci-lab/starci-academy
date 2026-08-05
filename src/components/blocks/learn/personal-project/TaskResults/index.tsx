"use client"

import React, { useMemo } from "react"
import {
    useTranslations,
} from "next-intl"
import {
    TaskResultsSkeleton,
} from "../TaskResultsSkeleton"
import { Score } from "@/components/blocks/stats/Score"
import { StarCiAIBadge } from "@/components/blocks/learn/StarCiAIBadge"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { Typography } from "@/components/atoms/text/Typography"
import { StackV } from "@/components/frames/Stack"
import { useQueryUserPersonalTaskAttemptsSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserPersonalTaskAttemptsSwr"

/**
 * Grading results block: AI badge, score, and short feedback.
 *
 * Self-contained: reads the latest attempt from its own SWR query. First load
 * shimmers in place; settled with no attempt at all, the block self-hides rather
 * than showing an empty card nobody asked for.
 */
export const TaskResults = () => {
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

    if (attemptsSwr.isLoading) {
        return <TaskResultsSkeleton />
    }
    if (!latestAttempt) {
        return null
    }

    return (
        <LabeledCard
            identity={{ tier: "block", component: "TaskResults" }}
            label={t("task.resultsTitle")}
            action={() => <StarCiAIBadge />}
        >
            <StackV
                gap={4}
                items={[
                    () => <Score current={latestAttempt.score ?? 0} max={20} />,
                    () => <Typography size="sm" color="muted" text={shortFeedback} />,
                ]}
            />
        </LabeledCard>
    )
}
