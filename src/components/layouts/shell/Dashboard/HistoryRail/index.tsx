"use client"

import React from "react"
import {
    Button,
    ProgressBar,
    Skeleton,
    cn,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    EntityToken,
} from "../EntityToken"
import {
    QuickActions,
} from "../QuickActions"
import {
    ProfileMenuCard,
} from "./ProfileMenuCard"
import {
    WhoToFollow,
} from "../WhoToFollow"
import {
    useHistoryRail,
} from "./useHistoryRail"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** One progress dimension of a course (e.g. content / challenge / milestone). */
interface CourseMetric {
    /** i18n key suffix under `dashboard.courseProgress`. */
    key: string
    /** Items the viewer has completed in this dimension. */
    completed: number
    /** Total items in this dimension (0 when the dimension doesn't apply). */
    total: number
}

/** Props for {@link HistoryRail}. */
export type HistoryRailProps = WithClassNames<undefined>

/**
 * GitHub-style left rail, slimmed to its dashboard-unique value: the viewer's
 * identity on top, then the searchable "my courses" list with progress bars (so
 * the rail answers "which course do I resume"). Recent lessons / in-progress
 * challenges live in the centre "continue learning" hero, and achievements live
 * on the profile, so none is repeated here. Fetches its own `myCourses` leaf query
 * (no prop-drill) and owns its loading + error states. `"use client"` for redux +
 * the search filter + SWR.
 */
export const HistoryRail = ({
    className,
}: HistoryRailProps = {}) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const {
        filteredCourses,
        isLoading,
        hasError,
        mutate,
    } = useHistoryRail()

    // first load — placeholder rail so the column never jumps
    if (isLoading) {
        return (
            <div className="flex flex-col gap-6 p-3">
                <div className="flex items-center gap-3">
                    <Skeleton className="size-10 rounded-full" />
                    <Skeleton className="h-4 w-32 rounded-medium" />
                </div>
                <div className="flex flex-col gap-1.5">
                    {Array.from({
                        length: 6,
                    }).map((_, index) => (
                        <Skeleton
                            key={index}
                            className="h-4 w-full rounded-medium"
                        />
                    ))}
                </div>
            </div>
        )
    }

    // a failed leaf (often a dead session) — never hang; offer retry + a way home
    if (hasError) {
        return (
            <div className="flex flex-col items-center gap-3 rounded-3xl p-3 text-center">
                <div className="text-sm text-muted">
                    {t("dashboard.loadError")}
                </div>
                <div className="flex flex-col gap-1.5">
                    <Button
                        variant="tertiary"
                        onPress={() => {
                            // re-run the rail leaf
                            void mutate()
                        }}
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
        )
    }

    return (
        <div className={cn("flex flex-col gap-6 p-3", className)}>
            {/* identity block — the single "your profile" anchor on the dashboard
                (avatar + name + XP, with an account menu on press) */}
            <ProfileMenuCard />

            {/* one-tap shortcuts to the most-reached surfaces */}
            <QuickActions />

            {/* "my courses": every joined course as a token + a completed/total
                milestone bar (the milestone list doubles as the course list, so a
                0/0 course still shows — just without a bar) */}
            <div className="flex flex-col gap-3">
                <div className="text-base font-semibold text-foreground">
                    {t("dashboard.enrolledCourses")}
                </div>
                {filteredCourses.length > 0 ? (
                    <div className="flex flex-col gap-3">
                        {filteredCourses.map((item) => {
                            // three progress dimensions per course; render a row only
                            // when that dimension exists (total > 0) so a course with
                            // no challenges/milestones doesn't show a "0/0" line
                            const metrics: Array<CourseMetric> = [
                                {
                                    key: "content",
                                    completed: item.contentCompleted,
                                    total: item.contentTotal,
                                },
                                {
                                    key: "challenge",
                                    completed: item.challengeCompleted,
                                    total: item.challengeTotal,
                                },
                                {
                                    key: "milestone",
                                    completed: item.completed,
                                    total: item.total,
                                },
                            ]
                            return (
                                <div
                                    key={item.globalId}
                                    className="flex flex-col gap-1.5"
                                >
                                    {/* course title (link) + overall completion % */}
                                    <div className="flex items-center justify-between gap-1.5">
                                        <EntityToken
                                            globalId={item.globalId}
                                            label={item.label}
                                            className="min-w-0 truncate"
                                        />
                                        <span className="shrink-0 text-sm text-foreground">
                                            {item.completionPercent}%
                                        </span>
                                    </div>
                                    {metrics
                                        .filter((metric) => metric.total > 0)
                                        .map((metric) => (
                                            <div
                                                key={metric.key}
                                                className="flex flex-col gap-1.5"
                                            >
                                                <div className="flex items-center justify-between gap-1.5 text-xs text-muted">
                                                    <span>
                                                        {t(`dashboard.courseProgress.${metric.key}`)}
                                                    </span>
                                                    <span className="shrink-0">
                                                        {metric.completed}/{metric.total}
                                                    </span>
                                                </div>
                                                <ProgressBar
                                                    aria-label={`${item.label} ${metric.key}`}
                                                    value={metric.completed}
                                                    maxValue={metric.total}
                                                    color="default"
                                                    size="sm"
                                                >
                                                    <ProgressBar.Track>
                                                        <ProgressBar.Fill />
                                                    </ProgressBar.Track>
                                                </ProgressBar>
                                            </div>
                                        ))}
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="text-sm text-muted">
                        {t("dashboard.enrolledCoursesEmpty")}
                    </div>
                )}
            </div>

            {/* people to follow — fills the rail's lower space + grows the graph */}
            <WhoToFollow />
        </div>
    )
}
