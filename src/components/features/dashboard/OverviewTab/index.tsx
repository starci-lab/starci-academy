"use client"

import React from "react"
import {
    cn,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    ContinueLearning,
} from "../ContinueLearning"
import {
    DailyQuest,
} from "../DailyQuest"
import {
    StreakStrip,
} from "../StreakStrip"
import {
    WeeklyGoals,
} from "../WeeklyGoals"
import {
    WeeklyChallengeCard,
} from "../WeeklyChallengeCard"
import {
    OverviewContributions,
} from "./OverviewContributions"
import {
    ChangelogList,
} from "../ChangelogList"
import {
    JobReadinessWidget,
} from "./JobReadinessWidget"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"

/** Props for {@link OverviewTab}. */
export type OverviewTabProps = WithClassNames<undefined>

/**
 * Dashboard "Overview" tab — the cockpit, every section framed by a `LabeledCard`
 * (label outside + card, mirroring the profile page): "Tiếp tục học" (next action),
 * "Đà học" (streak), "Mục tiêu tuần" (weekly goals), "Độ sẵn sàng của tôi" (own
 * job-readiness + a CTA at the missing pillar), the weekly-challenge event, then
 * the contribution heatmap. Each child self-fetches + owns its states.
 * @param props - optional root class name (placement only)
 */
export const OverviewTab = ({
    className,
}: OverviewTabProps) => {
    const t = useTranslations()
    return (
        <div className={cn("flex flex-col gap-6", className)}>
            {/* frameless: resume items are themselves cards → no card-in-card */}
            <LabeledCard
                label={t("dashboard.sections.continue")}
                frameless
            >
                <ContinueLearning />
            </LabeledCard>
            {/* DailyQuest self-frames (LabeledCard label + flush list + claim prompt as description) */}
            <DailyQuest />
            <LabeledCard
                label={t("dashboard.sections.streak")}
            >
                <StreakStrip />
            </LabeledCard>
            <LabeledCard
                label={t("dashboard.sections.goals")}
            >
                <WeeklyGoals />
            </LabeledCard>
            <LabeledCard
                label={t("jobReadiness.myTitle")}
            >
                <JobReadinessWidget />
            </LabeledCard>
            {/* weekly-challenge event — self-titled card (self-hides when none) */}
            <WeeklyChallengeCard />
            <LabeledCard
                label={t("dashboard.contributions.heading")}
            >
                <OverviewContributions />
            </LabeledCard>
            {/* platform news — moved here from the Community tab (Community = people/competition) */}
            <ChangelogList framed />
        </div>
    )
}
