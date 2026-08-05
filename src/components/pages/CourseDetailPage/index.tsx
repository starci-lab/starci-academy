"use client"

import React from "react"
import {
    useTranslations,
} from "next-intl"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { useQueryCourseSwr } from "@/hooks/swr/api/graphql/queries/useQueryCourseSwr"
import { useAppSelector } from "@/redux/hooks"
import { _CourseDetailPage } from "./component"

/** Props for {@link CourseDetailPage}. */
export type CourseDetailPageProps = WithClassNames<undefined>

/**
 * Marketing-first course landing (UI 2.0) — the CONNECTED half: it fetches the course, computes the
 * async decisions (`isSkeleton` from the first-load formula, `isEmpty` from the resolved data,
 * `loading-and-skeleton.md` §2), resolves every label, and hands them to the presentational
 * {@link _CourseDetailPage}. See `tiers/split.md`.
 *
 * The route param `[courseId]` is synced into `course.displayId` globally by
 * `useSyncReduxCourseId`, which drives {@link useQueryCourseSwr}.
 *
 * @param props - optional className (placement only).
 */
export const CourseDetailPage = ({ className }: CourseDetailPageProps) => {
    const t = useTranslations()
    const { isLoading, error, mutate } = useQueryCourseSwr()
    const course = useAppSelector((state) => state.course.entity)

    return (
        <_CourseDetailPage
            className={className}
            // first load, nothing in hand → shimmer (loading-and-skeleton.md §2)
            isSkeleton={isLoading && !course}
            // settled with nothing to show
            isEmpty={!course}
            error={error}
            onRetry={() => { void mutate() }}
            labels={{
                notFound: t("courseLanding.notFound"),
                errorTitle: t("courseLanding.errorTitle"),
                retry: t("courseLanding.retry"),
            }}
        />
    )
}
