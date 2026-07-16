"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { CourseRow } from "./CourseRow"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { useProfileUsername } from "../../hooks/useProfileUsername"
import { useQueryUserCoursesSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserCoursesSwr"
import { useQueryUserProfileSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserProfileSwr"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
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
                    {courses.map((item) => (
                        <CourseRow key={item.globalId} item={item} isOwnProfile={isOwnProfile} />
                    ))}
                </SurfaceListCard>
            </AsyncContent>
        </LabeledCard>
    )
}
