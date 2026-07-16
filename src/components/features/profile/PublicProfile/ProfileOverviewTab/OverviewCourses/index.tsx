"use client"

import React from "react"
import { Typography } from "@heroui/react"
import { BookOpenIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { EntityToken } from "@/components/features/dashboard/EntityToken"
import { CourseTrialChip } from "@/components/features/course/CourseTrialChip"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { useProfileUsername } from "../../hooks/useProfileUsername"
import { useQueryUserCoursesSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserCoursesSwr"
import { useQueryUserProfileSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserProfileSwr"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { IconTile } from "@/components/blocks/identity/IconTile"
import { CourseProgressBar } from "@/components/blocks/stats/CourseProgressBar"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { useAppSelector } from "@/redux/hooks"

/** Props for {@link OverviewCourses}. */
export interface OverviewCoursesProps extends WithClassNames<undefined> {
    /** Section label, rendered outside the card (owned here, like every other self-contained section). */
    label: React.ReactNode
    /** Optional "see more" link on the label row. */
    onSeeMore?: () => void
    /** Text for the see-more link. */
    seeMoreLabel?: React.ReactNode
}

/**
 * Overview content — courses the profile owner has joined. Each course is one
 * compact row: a course icon, the title + overall completion %, and a single
 * segmented bar that folds the three dimensions (content / challenge / milestone)
 * into one honest progress bar (filled to the real total, coloured by dimension).
 * Owns its own `LabeledCard`, with `frameless` computed HERE (not hardcoded) so
 * the loaded list (self-framed as a `SurfaceListCard`) skips the outer `Card` —
 * but the skeleton/empty/error states, which have no bounded surface of their
 * own, still get one. Data states go through {@link AsyncContent}.
 *
 * @param props - {@link OverviewCoursesProps}
 */
export const OverviewCourses = ({ className, label, onSeeMore, seeMoreLabel }: OverviewCoursesProps) => {
    const t = useTranslations()
    const username = useProfileUsername()
    const { data: user } = useQueryUserProfileSwr(username)
    const userId = user?.id ?? null
    // only the profile OWNER sees the "Học thử" chip — don't broadcast "hasn't paid"
    // for a course on someone else's public profile.
    const viewerId = useAppSelector((state) => state.user.user?.id)
    const isOwnProfile = Boolean(viewerId) && viewerId === userId
    const { data, isLoading, error, mutate } = useQueryUserCoursesSwr(userId)

    const courses = data ?? []
    const hasCourses = !(isLoading || !userId) && !error && courses.length > 0

    return (
        <LabeledCard
            className={className}
            label={label}
            onSeeMore={onSeeMore}
            seeMoreLabel={seeMoreLabel}
            frameless={hasCourses}
        >
            <AsyncContent
                isLoading={(isLoading || !userId) && courses.length === 0}
                skeleton={(
                    // mirror the real list: surface list card with course item rows
                    <SurfaceListCard>
                        {[0, 1].map((row) => (
                            <SurfaceListCardItem key={row}>
                                <div className="flex items-center gap-3">
                                    {/* IconTile (md = size-16 rounded-2xl) */}
                                    <Skeleton className="size-12 shrink-0 rounded-2xl" />
                                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                                        {/* title + percent row */}
                                        <div className="flex items-center justify-between gap-2">
                                            <Skeleton.Typography type="body-sm" width="1/2" />
                                            <Skeleton className="h-3 w-8 rounded" />
                                        </div>
                                        {/* SegmentBar track */}
                                        <Skeleton.ProgressBar />
                                    </div>
                                </div>
                            </SurfaceListCardItem>
                        ))}
                    </SurfaceListCard>
                )}
                isEmpty={courses.length === 0}
                emptyContent={{ title: t("publicProfile.coursesEmpty") }}
                error={courses.length === 0 ? error : undefined}
                errorContent={{
                    title: t("publicProfile.loadError"),
                    onRetry: () => { void mutate() },
                    retryLabel: t("publicProfile.loadErrorRetry"),
                }}
            >
                <SurfaceListCard>
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
                            <SurfaceListCardItem key={item.globalId}>
                                <div className="flex items-center gap-3">
                                    <IconTile size="sm" src={item.thumbnailUrl} icon={<BookOpenIcon aria-hidden focusable="false" />} />
                                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                                        <div className="flex items-center justify-between gap-2">
                                            {/* course title is a link into the course */}
                                            <EntityToken
                                                globalId={item.globalId}
                                                label={item.label}
                                                className="min-w-0 flex-1 truncate"
                                            />
                                            {isOwnProfile ? <CourseTrialChip isEnrolled={item.isEnrolled} /> : null}
                                            <Typography type="body-xs" color="muted">
                                                {percent}%
                                            </Typography>
                                        </div>
                                        <CourseProgressBar
                                            ariaLabel={`${item.label} · ${percent}%`}
                                            dims={dims.map((d) => ({
                                                ...d,
                                                label: t(`dashboard.courseProgress.${d.key}`),
                                            }))}
                                        />
                                    </div>
                                </div>
                            </SurfaceListCardItem>
                        )
                    })}
                </SurfaceListCard>
            </AsyncContent>
        </LabeledCard>
    )
}
