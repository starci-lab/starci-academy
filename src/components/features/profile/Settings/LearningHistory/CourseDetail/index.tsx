"use client"

import React, {
    useState,
} from "react"
import {
    Input,
    Link,
    Tabs,
    TextField,
    Typography,
    cn,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    ArrowLeftIcon,
    BookOpenIcon,
    CalendarBlankIcon,
    ListBulletsIcon,
} from "@phosphor-icons/react"
import {
    useQueryMyCourseOutlineSwr,
} from "@/hooks"
import {
    AsyncContent,
    ExtendedTabs,
    IconTile,
    SegmentBar,
    Skeleton,
} from "@/components/blocks"
import {
    fromGlobalId,
} from "@/modules/utils"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import {
    useSelectedCourse,
} from "../hooks/useSelectedCourse"
import {
    CourseOutline,
} from "../CourseOutline"
import {
    CourseDayTimeline,
} from "./CourseDayTimeline"

/** Props for {@link CourseDetail}. */
export type CourseDetailProps = WithClassNames<undefined>

/** Detail view tabs. */
type DetailTab = "day" | "chapter"

/** Segment colour per course progress dimension. */
const DIM_COLOR: Record<string, string> = {
    content: "var(--accent)",
    challenge: "var(--success)",
    milestone: "var(--warning)",
}

/**
 * Per-course detail (brainstorm direction A / H1). A sticky course header
 * ({@link IconTile} + title + completion % + {@link SegmentBar} + a meta line of
 * lessons / challenges / milestones), a client search over the course's lessons,
 * and an {@link ExtendedTabs} toggle:
 *
 *   - "Theo ngày" (default): the {@link CourseDayTimeline} — a journal of the
 *     viewer's learning events grouped by day (needs `courseLearningHistory`).
 *   - "Theo chương": the existing {@link CourseOutline} chapter tree, filtered by
 *     the same search — the "what's left to learn" view.
 *
 * Reads the selected course globalId from `?course=` (passes it straight to the
 * day-timeline query; decodes it to the raw id for the outline query).
 *
 * @param props - optional root className (placement only).
 */
export const CourseDetail = ({
    className,
}: CourseDetailProps) => {
    const t = useTranslations()
    const { selectedCourse, setSelectedCourse } = useSelectedCourse()
    const [tab, setTab] = useState<DetailTab>("day")
    const [search, setSearch] = useState("")

    // decode the selected course globalId (CourseEntity:<id>) → raw id for the outline query
    const rawCourseId = selectedCourse ? fromGlobalId(selectedCourse)?.id ?? null : null
    const outlineSwr = useQueryMyCourseOutlineSwr(rawCourseId)
    const outline = outlineSwr.data
    const query = search.trim().toLowerCase()

    const progress = outline?.progress
    const headerDims = progress
        ? [
            { key: "content", completed: progress.lessonsRead, total: progress.lessonsTotal },
            { key: "challenge", completed: progress.challengesCompleted, total: progress.challengesTotal },
            { key: "milestone", completed: progress.tasksCompleted, total: progress.tasksTotal },
        ]
        : []
    const headerTotal = headerDims.reduce((acc, dim) => acc + dim.total, 0)

    return (
        <div className={cn("flex flex-col gap-6", className)}>
            <Link
                onPress={() => { setSelectedCourse(null) }}
                className="flex w-fit items-center gap-2 text-sm text-muted"
            >
                <ArrowLeftIcon aria-hidden focusable="false" className="size-4" />
                {t("profileSettings.learning.history.title")}
            </Link>

            {/* sticky course header — title + progress + meta */}
            <div className="sticky top-16 z-30 -mx-4 flex flex-col gap-3 bg-background px-4 py-3">
                <AsyncContent
                    isLoading={!outlineSwr.data && !outlineSwr.error}
                    skeleton={(
                        <div className="flex items-center gap-3">
                            <Skeleton className="size-12 shrink-0 rounded-xl" />
                            <div className="flex min-w-0 flex-1 flex-col gap-2">
                                <Skeleton.Typography type="h4" width="1/2" />
                                <Skeleton.ProgressBar />
                            </div>
                        </div>
                    )}
                    isEmpty={!outline}
                    emptyContent={{ title: t("profileSettings.learning.outline.empty") }}
                    error={!outlineSwr.data ? outlineSwr.error : undefined}
                    errorContent={{
                        title: t("profileSettings.learning.outline.error"),
                        onRetry: () => { void outlineSwr.mutate() },
                        retryLabel: t("profileSettings.learning.loadMore"),
                    }}
                >
                    {outline && progress ? (
                        <div className="flex items-center gap-3">
                            <IconTile size="sm" icon={<BookOpenIcon aria-hidden focusable="false" />} />
                            <div className="flex min-w-0 flex-1 flex-col gap-2">
                                <div className="flex items-center justify-between gap-2">
                                    <Typography type="h5" weight="bold" truncate>
                                        {outline.course.title}
                                    </Typography>
                                    <Typography type="body-xs" color="muted">
                                        {`${progress.completionPercent}%`}
                                    </Typography>
                                </div>
                                <SegmentBar
                                    max={headerTotal || 1}
                                    hideLegend
                                    ariaLabel={`${outline.course.title} · ${progress.completionPercent}%`}
                                    segments={headerDims.map((dim) => ({
                                        key: dim.key,
                                        label: t(`dashboard.courseProgress.${dim.key}`),
                                        value: dim.completed,
                                        color: DIM_COLOR[dim.key],
                                    }))}
                                />
                                <Typography type="body-xs" color="muted">
                                    {t("profileSettings.learning.detail.meta", {
                                        lessonsRead: progress.lessonsRead,
                                        lessonsTotal: progress.lessonsTotal,
                                        challenges: progress.challengesCompleted,
                                        milestones: progress.tasksCompleted,
                                    })}
                                </Typography>
                            </div>
                        </div>
                    ) : null}
                </AsyncContent>
            </div>

            {/* search over the course's lessons / events (filters both tabs) */}
            <TextField>
                <Input
                    aria-label={t("profileSettings.learning.detail.searchLessons")}
                    placeholder={t("profileSettings.learning.detail.searchLessons")}
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />
            </TextField>

            {/* toggle: day journal vs chapter outline */}
            <ExtendedTabs
                selectedKey={tab}
                onSelectionChange={(key) => setTab(key as DetailTab)}
            >
                <Tabs.ListContainer>
                    <Tabs.List aria-label={t("profileSettings.learning.detail.viewToggle")}>
                        <Tabs.Tab id="day" aria-controls="learning-detail-day">
                            <span className="flex items-center gap-2">
                                <CalendarBlankIcon aria-hidden focusable="false" className="size-5 shrink-0" />
                                {t("profileSettings.learning.detail.byDay")}
                            </span>
                            <Tabs.Indicator />
                        </Tabs.Tab>
                        <Tabs.Tab id="chapter" aria-controls="learning-detail-chapter">
                            <span className="flex items-center gap-2">
                                <ListBulletsIcon aria-hidden focusable="false" className="size-5 shrink-0" />
                                {t("profileSettings.learning.detail.byChapter")}
                            </span>
                            <Tabs.Indicator />
                        </Tabs.Tab>
                    </Tabs.List>
                </Tabs.ListContainer>
            </ExtendedTabs>

            {tab === "day" ? (
                selectedCourse ? (
                    <div id="learning-detail-day">
                        <CourseDayTimeline courseGlobalId={selectedCourse} query={query} />
                    </div>
                ) : null
            ) : (
                <div id="learning-detail-chapter">
                    <CourseOutline search={query} />
                </div>
            )}
        </div>
    )
}
