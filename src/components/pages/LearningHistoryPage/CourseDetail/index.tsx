"use client"

import React, {
    useState,
} from "react"
import {
    Input,
    Link,
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
    FlagIcon,
    ListBulletsIcon,
} from "@phosphor-icons/react"
import {
    CourseTrialChip,
} from "@/components/blocks/course/CourseTrialChip"
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
    CourseMilestoneOutline,
} from "../CourseMilestoneOutline"
import { useQueryMyCourseOutlineSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyCourseOutlineSwr"
import { useQueryMyCoursesSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyCoursesSwr"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { IconTile } from "@/components/blocks/identity/IconTile"
import { SegmentBar } from "@/components/composites/stats/SegmentBar"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { TabsCard } from "@/components/blocks/navigation/TabsCard"
import { fromGlobalId } from "@/modules/utils/globalId"
import { Box } from "@/components/frames/Box"
import { StackH, StackV } from "@/components/frames/Stack"

/** Props for {@link CourseDetail}. */
export type CourseDetailProps = WithClassNames<undefined>

/** Detail view tabs: course content vs the personal-project capstone. */
type DetailTab = "contents" | "personalProject"

/** Segment colour per course progress dimension. */
const DIM_COLOR: Record<string, string> = {
    content: "var(--accent)",
    challenge: "var(--success)",
    milestone: "var(--warning)",
}

/**
 * Per-course detail. A sticky course header ({@link IconTile} + title +
 * completion % + {@link SegmentBar} + a meta line of lessons / challenges /
 * milestones), a client search over the active tab, and a two-tab toggle — both
 * tabs render an accordion-card off the SAME `myCourseOutline` payload:
 *
 *   - "Contents" (default): the {@link CourseOutline} module → lesson →
 *     challenge tree with read flags.
 *   - "Personal Project": the {@link CourseMilestoneOutline}
 *     milestone → task tree with a roll-up completion status per milestone.
 *
 * Reads the selected course globalId from `?course=` (decoded to the raw id for
 * the shared outline query in each tab).
 *
 * @param props - optional root className (placement only).
 */
export const CourseDetail = ({
    className,
}: CourseDetailProps) => {
    const t = useTranslations()
    const { selectedCourse, setSelectedCourse } = useSelectedCourse()
    const [tab, setTab] = useState<DetailTab>("contents")
    const [search, setSearch] = useState("")

    // decode the selected course globalId (CourseEntity:<id>) → raw id for the outline query
    const rawCourseId = selectedCourse ? fromGlobalId(selectedCourse)?.id ?? null : null
    const outlineSwr = useQueryMyCourseOutlineSwr(rawCourseId)
    const outline = outlineSwr.data
    // the outline payload has no cover; reuse the (cached) course list to show the real
    // course logo in the header IconTile, like the hub list does — falls back to the book icon.
    const coursesSwr = useQueryMyCoursesSwr()
    const selectedCourseItem = (coursesSwr.data ?? [])
        .find((course) => course.globalId === selectedCourse)
    const courseThumbnailUrl = selectedCourseItem?.thumbnailUrl
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
            <Link onPress={() => { setSelectedCourse(null) }} className="text-sm text-muted">
                <StackH
                    inline
                    gap={3}
                    principle="identity"
                    align="center"
                    items={[
                        () => <ArrowLeftIcon aria-hidden focusable="false" className="size-5" />,
                        () => <>{t("profileSettings.learning.history.title")}</>,
                    ]}
                />
            </Link>

            {/* sticky course header — title + progress + meta */}
            <Box principle="row-pad" className="sticky top-16 z-30 -mx-4 bg-background px-4 py-3">
                <StackV gap={4} principle="content-row" items={[
                    () => (
                        <AsyncContent
                            isLoading={outlineSwr.data === null || outlineSwr.data === undefined ? !outlineSwr.error : false}
                            skeleton={(
                                <StackH gap={4} principle="content-row" align="center" items={[
                                    () => <Skeleton className="size-12 shrink-0 rounded-xl" />,
                                    () => (
                                        <StackV gap={3} principle="sibling-stack" classNames={["min-w-0", "flex-1"]} items={[
                                            () => <Skeleton.Typography type="h4" width="1/2" />,
                                            () => <Skeleton.ProgressBar />,
                                        ]} />
                                    ),
                                ]} />
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
                                <StackH gap={4} principle="content-row" align="center" items={[
                                    () => <IconTile size="sm" src={courseThumbnailUrl} icon={<BookOpenIcon aria-hidden focusable="false" />} />,
                                    () => (
                                        <StackV gap={3} principle="sibling-stack" classNames={["min-w-0", "flex-1"]} items={[
                                            () => (
                                                <StackH gap={3} principle="value-row" justify="between" align="center" items={[
                                                    () => (
                                                        <Typography type="h5" weight="bold" truncate className="min-w-0 flex-1">
                                                            {outline.course.title}
                                                        </Typography>
                                                    ),
                                                    () => (selectedCourseItem ? <CourseTrialChip isEnrolled={selectedCourseItem.isEnrolled} /> : null),
                                                    () => (
                                                        <Typography type="body-xs" color="muted">
                                                            {`${progress.completionPercent}%`}
                                                        </Typography>
                                                    ),
                                                ]} />
                                            ),
                                            () => (
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
                                            ),
                                            () => (
                                                <Typography type="body-xs" color="muted">
                                                    {t("profileSettings.learning.detail.meta", {
                                                        lessonsRead: progress.lessonsRead,
                                                        lessonsTotal: progress.lessonsTotal,
                                                        challenges: progress.challengesCompleted,
                                                        milestones: progress.tasksCompleted,
                                                    })}
                                                </Typography>
                                            ),
                                        ]} />
                                    ),
                                ]} />
                            ) : null}
                        </AsyncContent>
                    ),
                ]} />
            </Box>

            {/* search over the active tab (lessons or milestone tasks) */}
            <TextField variant="secondary">
                <Input
                    aria-label={t("profileSettings.learning.detail.searchLessons")}
                    placeholder={t("profileSettings.learning.detail.searchLessons")}
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />
            </TextField>

            {/* Contents vs Personal Project — TabsCard pattern: tabs float ABOVE, each
                tab below is its own accordion-card (Card p-0 skin owned by the view). */}
            <StackV gap={4} principle="content-row" items={[
                () => (
                    <TabsCard
                        leftTabs={{
                            items: [
                                {
                                    key: "contents",
                                    label: t("profileSettings.learning.detail.contents"),
                                    icon: <ListBulletsIcon aria-hidden focusable="false" className="size-5 shrink-0" />,
                                },
                                {
                                    key: "personalProject",
                                    label: t("profileSettings.learning.detail.personalProject"),
                                    icon: <FlagIcon aria-hidden focusable="false" className="size-5 shrink-0" />,
                                },
                            ],
                            selectedKey: tab,
                            ariaLabel: t("profileSettings.learning.detail.viewToggle"),
                            onSelectionChange: (key) => setTab(key as DetailTab),
                        }}
                    />
                ),
                () => (tab === "contents" ? (
                    <CourseOutline search={query} />
                ) : (
                    <CourseMilestoneOutline search={query} />
                )),
            ]} />
        </div>
    )
}
