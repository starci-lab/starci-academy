"use client"

import React from "react"
import {
    Typography,
    cn,
} from "@heroui/react"
import {
    BookOpenIcon,
} from "@phosphor-icons/react"
import {
    useTranslations,
} from "next-intl"
import {
    useQueryMyCoursesSwr,
} from "@/hooks"
import {
    AsyncContent,
    IconTile,
    SegmentBar,
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

/** Segment colour per course progress dimension. */
const DIM_COLOR: Record<string, string> = {
    content: "var(--accent)",
    challenge: "var(--success)",
    milestone: "var(--warning)",
}

/**
 * Enrolled-course progress — each course as one compact row (icon + title + overall
 * %, plus a single segmented bar folding content / challenge / milestone into one
 * honest bar with a legend), mirroring the profile overview. Content only (the
 * parent {@link import("@/components/blocks").LabeledCard} frames it). Reads its own
 * `myCourses` leaf query through {@link AsyncContent}.
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
                        <div key={row} className="flex items-center gap-3">
                            <Skeleton className="size-12 shrink-0 rounded-2xl" />
                            <div className="flex min-w-0 flex-1 flex-col gap-2">
                                <div className="flex items-center justify-between gap-2">
                                    <Skeleton.Typography type="body-sm" width="1/2" />
                                    <Skeleton className="h-3 w-8 rounded" />
                                </div>
                                <Skeleton.ProgressBar />
                            </div>
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
                    const dims = [
                        { key: "content", completed: item.contentCompleted, total: item.contentTotal },
                        { key: "challenge", completed: item.challengeCompleted, total: item.challengeTotal },
                        { key: "milestone", completed: item.completed, total: item.total },
                    ]
                    const totalTasks = dims.reduce((acc, d) => acc + d.total, 0)
                    const doneTasks = dims.reduce((acc, d) => acc + d.completed, 0)
                    const percent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0
                    return (
                        <div key={item.globalId} className="flex items-center gap-3">
                            <IconTile size="sm" src={item.thumbnailUrl} icon={<BookOpenIcon aria-hidden focusable="false" />} />
                            <div className="flex min-w-0 flex-1 flex-col gap-2">
                                <div className="flex items-center justify-between gap-2">
                                    {/* course title is a link into the course */}
                                    <EntityToken
                                        globalId={item.globalId}
                                        label={item.label}
                                        className="min-w-0 flex-1 truncate"
                                    />
                                    <Typography type="body-xs" color="muted">
                                        {percent}%
                                    </Typography>
                                </div>
                                <SegmentBar
                                    max={totalTasks || 1}
                                    ariaLabel={`${item.label} · ${percent}%`}
                                    segments={dims.map((d) => ({
                                        key: d.key,
                                        label: t(`dashboard.courseProgress.${d.key}`),
                                        value: d.completed,
                                        color: DIM_COLOR[d.key],
                                    }))}
                                />
                            </div>
                        </div>
                    )
                })}
            </div>
        </AsyncContent>
    )
}
