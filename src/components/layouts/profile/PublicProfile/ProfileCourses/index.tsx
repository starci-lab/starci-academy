"use client"

import React from "react"
import {
    cn,
    ProgressBar,
    Spinner,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    useParams,
} from "next/navigation"
import {
    useQueryUserCoursesSwr,
    useQueryUserProfileSwr,
} from "@/hooks"
import {
    EntityToken,
} from "@/components/layouts/shell/Dashboard/EntityToken"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for {@link ProfileCourses}. */
export type ProfileCoursesProps = WithClassNames<undefined>

/**
 * Courses tab of the public profile — every course the profile owner has joined,
 * each as a clickable token plus up to three progress bars (content / challenge /
 * milestone). A dimension renders only when it has tasks (total > 0), so a course
 * with no challenges does not show an empty "0/0" line. Self-contained container:
 * reads the target user id from the route and drives its own SWR. Mirrors the
 * dashboard rail's course block but for any user.
 *
 * @param props - optional className for the root element.
 */
export const ProfileCourses = ({
    className,
}: ProfileCoursesProps) => {
    const t = useTranslations()
    // route carries the username; resolve it to the entity id the courses query
    // keys off (the profile fetch is SWR-deduped with the parent + tabs)
    const username = String(useParams().username)
    const { data: user } = useQueryUserProfileSwr(username)
    const userId = user?.id ?? null
    const {
        data,
        isLoading,
    } = useQueryUserCoursesSwr(userId)

    // first load in flight (username not yet resolved, or query running) → spinner
    if (!data && (isLoading || !userId)) {
        return (
            <div className="flex justify-center p-12">
                <Spinner size="lg" />
            </div>
        )
    }

    // no joined courses → empty state
    if (!data || data.length === 0) {
        return (
            <div className="rounded-large bg-default/40 p-6 text-center text-sm text-muted">
                {t("publicProfile.coursesEmpty")}
            </div>
        )
    }

    return (
        <div className={cn("flex flex-col gap-6", className)}>
            {data.map((item) => {
                // three progress dimensions per course; only render a bar when that
                // dimension actually has tasks (total > 0)
                const metrics = [
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
                        className="flex flex-col gap-3 rounded-large border border-default/40 p-4"
                    >
                        <EntityToken
                            globalId={item.globalId}
                            label={item.label}
                        />
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
                                        color="accent"
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
    )
}
