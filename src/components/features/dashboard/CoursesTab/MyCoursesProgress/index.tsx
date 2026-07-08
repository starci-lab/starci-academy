"use client"

import React from "react"
import {
    useTranslations,
} from "next-intl"
import {
    CourseRow,
} from "./CourseRow"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { useQueryMyCoursesSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyCoursesSwr"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"

/** Props for {@link MyCoursesProgress}. */
export interface MyCoursesProgressProps extends WithClassNames<undefined> {
    /** Section label, rendered outside the card (owned here, like every other self-contained section). */
    label: React.ReactNode
    /** Optional leading icon before the label. */
    icon?: React.ReactNode
}

/**
 * Enrolled-course progress — each course as one whole-row clickable item inside a
 * single surface list card. `frameless` is computed HERE (not hardcoded) so the
 * loaded list (self-framed as a `SurfaceListCard`) skips the outer `Card` — but
 * the skeleton/empty/error states, which have no bounded surface of their own,
 * still get one (avoids them rendering bare on the page background). Reads its
 * own `myCourses` leaf query through {@link AsyncContent}.
 * @param props - {@link MyCoursesProgressProps}
 */
export const MyCoursesProgress = ({
    className,
    label,
    icon,
}: MyCoursesProgressProps) => {
    const t = useTranslations()
    const { data, isLoading, error, mutate } = useQueryMyCoursesSwr()
    const courses = data ?? []
    const hasCourses = !isLoading && !error && courses.length > 0

    return (
        <LabeledCard className={className} label={label} icon={icon} frameless={hasCourses}>
            <AsyncContent
                isLoading={isLoading && courses.length === 0}
                skeleton={(
                    <SurfaceListCard>
                        {[0, 1].map((row) => (
                            <SurfaceListCardItem key={row}>
                                <div className="flex items-center gap-3">
                                    <Skeleton className="size-12 shrink-0 rounded-2xl" />
                                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                                        <div className="flex items-center justify-between gap-2">
                                            <Skeleton.Typography type="body-sm" width="1/2" />
                                            <Skeleton className="h-3 w-8 rounded" />
                                        </div>
                                        <Skeleton.ProgressBar />
                                    </div>
                                </div>
                            </SurfaceListCardItem>
                        ))}
                    </SurfaceListCard>
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
                <SurfaceListCard>
                    {courses.map((item) => (
                        <CourseRow key={item.globalId} item={item} />
                    ))}
                </SurfaceListCard>
            </AsyncContent>
        </LabeledCard>
    )
}
