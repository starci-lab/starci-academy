"use client"

import React, {
    useMemo,
    useState,
} from "react"
import {
    Input,
    TextField,
    Typography,
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
    BookOpenIcon,
} from "@phosphor-icons/react"
import {
    useQueryMyCoursesSwr,
} from "@/hooks"
import {
    AsyncContent,
    EmptyContent,
    IconTile,
    PressableCard,
    SegmentBar,
    Skeleton,
} from "@/components/blocks"
import {
    pathConfig,
} from "@/resources"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import {
    useSelectedCourse,
} from "./hooks/useSelectedCourse"
import {
    CourseDetail,
} from "./CourseDetail"

/** Props for {@link LearningHistory}. */
export type LearningHistoryProps = WithClassNames<undefined>

/** Number of placeholder course cards shown while the hub loads. */
const SKELETON_COURSE_COUNT = 3

/** Hub-search appears only once the list has at least this many courses. */
const SEARCH_MIN_COURSES = 4

/** Segment colour per course progress dimension. */
const DIM_COLOR: Record<string, string> = {
    content: "var(--accent)",
    challenge: "var(--success)",
    milestone: "var(--warning)",
}

/**
 * Learning history (brainstorm direction A / H1). The HUB lists every joined
 * course as a hinh-2 card — an {@link IconTile}, the title + overall completion %,
 * and a {@link SegmentBar} folding the three dimensions (content / challenge /
 * milestone) into one honest bar — each a press target opening that course's
 * detail (written into `?course=`). A client search filters the cards by title,
 * shown only when there are several courses. When a course is selected, the
 * {@link CourseDetail} view (day timeline + chapter outline) replaces the grid.
 *
 * @param props - optional root className (placement only).
 */
export const LearningHistory = ({
    className,
}: LearningHistoryProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const { selectedCourse, setSelectedCourse } = useSelectedCourse()
    const [search, setSearch] = useState("")
    const coursesSwr = useQueryMyCoursesSwr()
    const courses = useMemo(() => coursesSwr.data ?? [], [coursesSwr.data])

    // search filters the loaded courses by title, client-side
    const query = search.trim().toLowerCase()
    const filtered = useMemo(
        () => (query
            ? courses.filter((course) => course.label.toLowerCase().includes(query))
            : courses),
        [courses, query],
    )

    // a selected course → show its detail (day timeline + chapter outline)
    if (selectedCourse) {
        return <CourseDetail className={className} />
    }

    return (
        <div className={cn("flex flex-col gap-6", className)}>
            <div className="flex flex-col gap-2">
                <Typography type="h4" weight="bold">
                    {t("profileSettings.learning.history.title")}
                </Typography>
                <Typography type="body-sm" color="muted">
                    {t("profileSettings.learning.history.subtitle")}
                </Typography>
            </div>

            {/* search — only worth showing once there are several courses */}
            {courses.length >= SEARCH_MIN_COURSES ? (
                <TextField>
                    <Input
                        aria-label={t("profileSettings.learning.history.searchCourses")}
                        placeholder={t("profileSettings.learning.history.searchCourses")}
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </TextField>
            ) : null}

            <AsyncContent
                isLoading={!coursesSwr.data && !coursesSwr.error}
                skeleton={(
                    <div className="flex flex-col gap-4">
                        {Array.from({ length: SKELETON_COURSE_COUNT }).map((_unused, row) => (
                            <div key={row} className="flex items-center gap-3">
                                <Skeleton className="size-12 shrink-0 rounded-xl" />
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
                emptyContent={{
                    title: t("profileSettings.learning.history.coursesEmpty"),
                    description: t("profileSettings.learning.history.coursesEmptyHint"),
                    onRetry: () => { router.push(pathConfig().locale(locale).course().build()) },
                    retryLabel: t("profileSettings.learning.history.explore"),
                }}
                error={!coursesSwr.data ? coursesSwr.error : undefined}
                errorContent={{
                    title: t("profileSettings.learning.outline.error"),
                    onRetry: () => { void coursesSwr.mutate() },
                    retryLabel: t("profileSettings.learning.loadMore"),
                }}
            >
                {filtered.length === 0 ? (
                    // loaded but the current search matches nothing
                    <EmptyContent title={t("profileSettings.learning.history.noMatch")} />
                ) : (
                    <div className="flex flex-col gap-3">
                        {filtered.map((course) => {
                            const dims = [
                                { key: "content", completed: course.contentCompleted, total: course.contentTotal },
                                { key: "challenge", completed: course.challengeCompleted, total: course.challengeTotal },
                                { key: "milestone", completed: course.completed, total: course.total },
                            ]
                            const totalTasks = dims.reduce((acc, dim) => acc + dim.total, 0)
                            return (
                                <PressableCard
                                    key={course.globalId}
                                    onPress={() => { setSelectedCourse(course.globalId) }}
                                >
                                    <div className="flex items-center gap-3">
                                        <IconTile size="sm" src={course.thumbnailUrl} icon={<BookOpenIcon aria-hidden focusable="false" />} />
                                        <div className="flex min-w-0 flex-1 flex-col gap-2">
                                            <div className="flex items-center justify-between gap-2">
                                                <Typography type="body-sm" weight="semibold" truncate>
                                                    {course.label}
                                                </Typography>
                                                <Typography type="body-xs" color="muted">
                                                    {`${course.completionPercent}%`}
                                                </Typography>
                                            </div>
                                            <SegmentBar
                                                max={totalTasks || 1}
                                                ariaLabel={`${course.label} · ${course.completionPercent}%`}
                                                segments={dims.map((dim) => ({
                                                    key: dim.key,
                                                    label: t(`dashboard.courseProgress.${dim.key}`),
                                                    value: dim.completed,
                                                    color: DIM_COLOR[dim.key],
                                                }))}
                                            />
                                        </div>
                                    </div>
                                </PressableCard>
                            )
                        })}
                    </div>
                )}
            </AsyncContent>
        </div>
    )
}
