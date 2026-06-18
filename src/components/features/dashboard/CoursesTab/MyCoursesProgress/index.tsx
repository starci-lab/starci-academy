"use client"

import React from "react"
import {
    ProgressBar,
    Typography,
    cn,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    useQueryMyCoursesSwr,
} from "@/hooks"
import {
    AsyncContent,
    Skeleton,
} from "@/components/blocks"
import {
    EntityToken,
} from "@/components/features/dashboard/EntityToken"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for {@link MyCoursesProgress}. */
export type MyCoursesProgressProps = WithClassNames<undefined>

/** One progress dimension of a course (content / challenge / milestone). */
interface CourseMetric {
    /** i18n key suffix under `dashboard.courseProgress`. */
    key: string
    /** Items the viewer has completed in this dimension. */
    completed: number
    /** Total items in this dimension (0 when the dimension doesn't apply). */
    total: number
}

/**
 * Enrolled-course progress list — each joined course as a title + completion % and
 * a bar per applicable dimension (content / challenge / milestone). Content only
 * (the parent {@link import("@/components/blocks").LabeledCard} frames it). Reads
 * its own `myCourses` leaf query through {@link AsyncContent}.
 * @param props - optional root class name (placement only)
 */
export const MyCoursesProgress = ({
    className,
}: MyCoursesProgressProps) => {
    const t = useTranslations()
    const { data, isLoading, error, mutate } = useQueryMyCoursesSwr()
    const courses = data ?? []

    return (
        <AsyncContent
            isLoading={isLoading && courses.length === 0}
            skeleton={(
                <div className="flex flex-col gap-4">
                    {[0, 1].map((row) => (
                        <div key={row} className="flex flex-col gap-2">
                            <Skeleton.Typography type="body-sm" width="1/2" />
                            <Skeleton.ProgressBar />
                        </div>
                    ))}
                </div>
            )}
            isEmpty={courses.length === 0}
            emptyContent={{ title: t("dashboard.enrolledCoursesEmpty") }}
            error={courses.length === 0 ? error : undefined}
            errorContent={{
                title: t("dashboard.loadError"),
                onRetry: () => { void mutate() },
                retryLabel: t("dashboard.retry"),
            }}
        >
            <div className={cn("flex flex-col gap-4", className)}>
                {courses.map((item) => {
                    const metrics: Array<CourseMetric> = [
                        { key: "content", completed: item.contentCompleted, total: item.contentTotal },
                        { key: "challenge", completed: item.challengeCompleted, total: item.challengeTotal },
                        { key: "milestone", completed: item.completed, total: item.total },
                    ]
                    return (
                        <div key={item.globalId} className="flex flex-col gap-2">
                            <div className="flex items-center justify-between gap-2">
                                <EntityToken
                                    globalId={item.globalId}
                                    label={item.label}
                                    className="min-w-0 truncate"
                                />
                                <Typography type="body-xs" color="muted">
                                    {item.completionPercent}%
                                </Typography>
                            </div>
                            {metrics
                                .filter((metric) => metric.total > 0)
                                .map((metric) => (
                                    <div key={metric.key} className="flex flex-col gap-2">
                                        <div className="flex items-center justify-between gap-2">
                                            <Typography type="body-xs" color="muted">
                                                {t(`dashboard.courseProgress.${metric.key}`)}
                                            </Typography>
                                            <Typography type="body-xs" color="muted">
                                                {metric.completed}/{metric.total}
                                            </Typography>
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
        </AsyncContent>
    )
}
