"use client"

import React from "react"
import { BookOpenIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { useResolveRouteNavigation } from "@/components/blocks/entity/EntityToken/useResolveRouteNavigation"
import { CourseTrialChip } from "@/components/blocks/course/CourseTrialChip"
import { IconTile } from "@/components/blocks/identity/IconTile"
import { CourseProgressBar } from "@/components/blocks/stats/CourseProgressBar"
import { SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { Typography } from "@/components/atoms/text/Typography"
import { StackH, StackV } from "@/components/frames/Stack"
import type { useQueryUserCoursesSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserCoursesSwr"

/** One profile course-progress item (element of the `useQueryUserCoursesSwr` list). */
type CourseItem = NonNullable<ReturnType<typeof useQueryUserCoursesSwr>["data"]>[number]

/** Props for {@link CourseRow}. */
export interface CourseRowProps {
    /** One profile course-progress item. Absent only while {@link CourseRowProps.isSkeleton}. */
    item?: CourseItem
    /** Only the profile OWNER sees the "Trial" chip. */
    isOwnProfile?: boolean
    /**
     * First load, nothing in hand → this row shimmers in place. The resting state lives
     * HERE, beside the loaded one, so the two shapes cannot drift the way a placeholder
     * hand-kept in the list would (`loading-and-skeleton.md`).
     */
    isSkeleton?: boolean
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
export const CourseRow = ({ item, isOwnProfile = false, isSkeleton = false }: CourseRowProps) => {
    const t = useTranslations()
    const { onPress, pending, routable } = useResolveRouteNavigation({ globalId: item?.globalId ?? "" })

    const dims = [
        { key: "content", completed: item?.contentCompleted ?? 0, total: item?.contentTotal ?? 0 },
        { key: "challenge", completed: item?.challengeCompleted ?? 0, total: item?.challengeTotal ?? 0 },
        { key: "milestone", completed: item?.completed ?? 0, total: item?.total ?? 0 },
    ]
    const totalTasks = dims.reduce((acc, d) => acc + d.total, 0)
    const doneTasks = dims.reduce((acc, d) => acc + d.completed, 0)
    const percent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

    const resting = isSkeleton || !item

    return (
        <SurfaceListCardItem
            onPress={resting ? undefined : onPress}
            isDisabled={resting || !routable || pending}
            hover="underline"
        >
            <StackH
                gap={4}
                principle="content-row"
                items={[
                    () => (resting
                        ? <Skeleton className="size-12 shrink-0 rounded-xl" />
                        : <IconTile size="sm" src={item.thumbnailUrl} icon={<BookOpenIcon aria-hidden focusable="false" />} />),
                    () => {
                        const titleRowItems = [
                            () => (
                                <Typography
                                    size="sm"
                                    weight="medium"
                                    truncate
                                    underlineOnGroupHover
                                    isSkeleton={resting}
                                    classNames={resting ? ["w-1/2"] : ["min-w-0", "flex-1"]}
                                    text={item?.label}
                                />
                            ),
                            ...(!resting && isOwnProfile
                                ? [() => <CourseTrialChip isEnrolled={item.isEnrolled} />]
                                : []),
                            () => (
                                <Typography
                                    size="xs"
                                    color="muted"
                                    isSkeleton={resting}
                                    classNames={resting ? ["w-fit"] : undefined}
                                    text={`${percent}%`}
                                />
                            ),
                        ]
                        return (
                            <StackV
                                gap={3}
                                principle="sibling-stack"
                                classNames={["min-w-0", "flex-1"]}
                                items={[
                                    () => (
                                        <StackH
                                            gap={3}
                                            principle="flex-action"
                                            justify="between"
                                            items={titleRowItems}
                                        />
                                    ),
                                    () => (resting
                                        ? <Skeleton.ProgressBar />
                                        : (
                                            <CourseProgressBar
                                                ariaLabel={`${item.label} · ${percent}%`}
                                                dims={dims.map((d) => ({
                                                    ...d,
                                                    label: t(`dashboard.courseProgress.${d.key}`),
                                                }))}
                                            />
                                        )),
                                ]}
                            />
                        )
                    },
                ]}
            />
        </SurfaceListCardItem>
    )
}
