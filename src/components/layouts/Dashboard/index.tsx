"use client"

import React from "react"
import {
    Button,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    Spacer,
} from "@/components/reuseable"
import {
    useQueryMyDashboardSwr,
} from "@/hooks"
import {
    HistoryRail,
} from "./HistoryRail"
import {
    FeedTabs,
} from "./FeedTabs"
import {
    DashboardSkeleton,
} from "./DashboardSkeleton"

/**
 * GitHub-style logged-in home.
 *
 * Two panes from one aggregated `myDashboard` payload: a left rail with the
 * viewer's identity + read-lesson history, and a main feed of activity from the
 * users they follow. Handles loading + error explicitly so the page never hangs
 * on a skeleton when the query fails (e.g. an expired session behind a lingering
 * `csrf_token` cookie).
 */
export const Dashboard = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const { data, isLoading, error, mutate } = useQueryMyDashboardSwr()

    return (
        <div className="p-3 max-w-[1280px] mx-auto">
            <Spacer y={6} />
            <div className="text-2xl font-bold text-foreground">
                {t("dashboard.title")}
            </div>
            <Spacer y={6} />

            {isLoading ? (
                <DashboardSkeleton />
            ) : error || !data ? (
                // query failed (often a dead session behind a stale cookie) — never
                // hang on the skeleton; offer a retry + a way back to the landing page
                <div className="flex flex-col items-center gap-3 rounded-large bg-default/40 p-12 text-center">
                    <div className="text-sm text-muted">
                        {t("dashboard.loadError")}
                    </div>
                    <div className="flex gap-1.5">
                        <Button
                            variant="tertiary"
                            onPress={() => mutate()}
                        >
                            {t("dashboard.retry")}
                        </Button>
                        <Button
                            variant="primary"
                            onPress={() => router.push(`/${locale}/home`)}
                        >
                            {t("dashboard.goHome")}
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
                    <HistoryRail
                        enrolledCourses={data.enrolledCourses}
                        recentContents={data.learnedLessons}
                        inProgressChallenges={data.inProgressChallenges}
                    />
                    <FeedTabs />
                </div>
            )}
            <Spacer y={12} />
        </div>
    )
}
