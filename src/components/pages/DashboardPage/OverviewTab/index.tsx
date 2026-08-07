"use client"

import React, {
    useCallback,
} from "react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    pathConfig,
} from "@/resources/path"
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
    StreakFreezeCard,
} from "../StreakFreezeCard"
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
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"

/** Props for {@link OverviewTab}. */
export type OverviewTabProps = Record<string, never>
/**
 * DashboardPage "Overview" tab — the cockpit, every section framed by a `LabeledCard`
 * (label outside + card, mirroring the profile page): "Continue learning" (next action),
 * "Streak" (streak), "Weekly goals" (weekly goals), "My readiness" (own
 * job-readiness + a CTA at the missing pillar), the weekly-challenge event, then
 * the contribution heatmap. Each child self-fetches + owns its states.
 * @param props - optional root class name (placement only)
 */
export const OverviewTab = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()

    /** Open the weekly-KPI editor page. */
    const onSeeMoreGoals = useCallback(
        () => router.push(pathConfig().locale(locale).kpi().build()),
        [router, locale],
    )

    return (
        <div className={"flex flex-col gap-6"}>
            {/* frameless: resume items are themselves cards → no card-in-card */}
            <LabeledCard
                label={t("DashboardPage.sections.continue")}
                frameless
            >
                <ContinueLearning />
            </LabeledCard>
            {/* DailyQuest self-frames (LabeledCard label + flush list + claim prompt as description) */}
            <DailyQuest />
            <LabeledCard
                label={t("DashboardPage.sections.streak")}
            >
                <StreakStrip />
            </LabeledCard>
            {/* streak-freeze inventory — self-framed card (buy/owned/full states), reads myWeeklyStats */}
            <StreakFreezeCard />
            <LabeledCard
                label={t("DashboardPage.sections.goals")}
                onSeeMore={onSeeMoreGoals}
                seeMoreLabel={t("DashboardPage.kpi.edit")}
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
                label={t("DashboardPage.contributions.heading")}
            >
                <OverviewContributions />
            </LabeledCard>
            {/* platform news — moved here from the Community tab (Community = people/competition) */}
            <ChangelogList framed />
        </div>
    )
}
