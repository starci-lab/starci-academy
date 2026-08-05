"use client"

import React from "react"
import {
    useTranslations,
} from "next-intl"
import { useQueryMyCoursesSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyCoursesSwr"
import { _MyCoursesProgress } from "./component"

/** Props for {@link MyCoursesProgress}. */
export interface MyCoursesProgressProps {
    /** Section label, rendered outside the card (owned here, like every other self-contained section). */
    label: React.ReactNode
}

/**
 * Enrolled-course progress — the CONNECTED half: reads its own `myCourses` leaf query,
 * computes `isSkeleton`/`isEmpty`/`error` from the first-load formula, resolves every label,
 * and hands them to the presentational {@link _MyCoursesProgress}. See
 * `tiers/split.md` — this file owns the fetch and i18n, `component.tsx` owns the render.
 *
 * @param props - {@link MyCoursesProgressProps}
 */
export const MyCoursesProgress = ({
    label,
}: MyCoursesProgressProps) => {
    const t = useTranslations()
    const { data, isLoading, error, mutate } = useQueryMyCoursesSwr()
    const courses = data ?? []

    return (
        <_MyCoursesProgress
            label={label}
            // first load, nothing in hand → shimmer (loading-and-skeleton.md §2)
            isSkeleton={isLoading && courses.length === 0}
            isEmpty={courses.length === 0}
            // only a settled fetch error (nothing cached to fall back to) reaches the block
            error={courses.length === 0 ? error : undefined}
            onRetry={() => { void mutate() }}
            courses={courses}
            labels={{
                errorTitle: t("dashboard.loadError"),
                retry: t("dashboard.retry"),
                emptyTitle: t("dashboard.enrolledCoursesEmpty"),
            }}
        />
    )
}
