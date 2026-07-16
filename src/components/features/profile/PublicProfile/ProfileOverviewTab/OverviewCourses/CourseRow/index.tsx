"use client"

import React from "react"
import { Typography } from "@heroui/react"
import { BookOpenIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { useResolveRouteNavigation } from "@/components/features/dashboard/EntityToken/useResolveRouteNavigation"
import { CourseTrialChip } from "@/components/features/course/CourseTrialChip"
import { IconTile } from "@/components/blocks/identity/IconTile"
import { CourseProgressBar } from "@/components/blocks/stats/CourseProgressBar"
import { SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import type { useQueryUserCoursesSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserCoursesSwr"

/** One profile course-progress item (element of the `useQueryUserCoursesSwr` list). */
type CourseItem = NonNullable<ReturnType<typeof useQueryUserCoursesSwr>["data"]>[number]

/** Props for {@link CourseRow}. */
export interface CourseRowProps {
    /** One profile course-progress item. */
    item: CourseItem
    /** Only the profile OWNER sees the "Học thử" trial chip. */
    isOwnProfile: boolean
}

/**
 * One profile course as a WHOLE-ROW clickable surface-list item — mirrors the
 * dashboard `MyCoursesProgress` CourseRow. Pressing anywhere resolves the course
 * route and navigates ({@link useResolveRouteNavigation} per row); the title
 * underlines on CARD hover with a foreground decoration — NOT a nested
 * `EntityToken`/`<Link>` (which hovers only on the label + draws an accent underline).
 *
 * @param props - {@link CourseRowProps}
 */
export const CourseRow = ({ item, isOwnProfile }: CourseRowProps) => {
    const t = useTranslations()
    const { onPress, pending, routable } = useResolveRouteNavigation({ globalId: item.globalId })

    const dims = [
        { key: "content", completed: item.contentCompleted, total: item.contentTotal },
        { key: "challenge", completed: item.challengeCompleted, total: item.challengeTotal },
        { key: "milestone", completed: item.completed, total: item.total },
    ]
    const totalTasks = dims.reduce((acc, d) => acc + d.total, 0)
    const doneTasks = dims.reduce((acc, d) => acc + d.completed, 0)
    const percent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

    return (
        <SurfaceListCardItem onPress={onPress} isDisabled={!routable || pending} hover="underline">
            <div className="flex items-center gap-3">
                <IconTile size="sm" src={item.thumbnailUrl} icon={<BookOpenIcon aria-hidden focusable="false" />} />
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                        <Typography type="body-sm" weight="medium" truncate className="min-w-0 flex-1 text-accent-soft-foreground underline-offset-2 group-hover:underline">
                            {item.label}
                        </Typography>
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
}
