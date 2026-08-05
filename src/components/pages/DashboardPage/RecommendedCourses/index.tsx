"use client"

import React from "react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    pathConfig,
} from "@/resources/path"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { useQueryRecommendedCoursesSwr } from "@/hooks/swr/api/graphql/queries/useQueryRecommendedCoursesSwr"
import { _RecommendedCourses, type RecommendedCoursesItem } from "./component"

/** Props for {@link RecommendedCourses}. */
export type RecommendedCoursesProps = WithClassNames<undefined>

/**
 * "Courses for you" — the CONNECTED half: self-fetches the viewer's recommended
 * (not-enrolled) courses, builds each course's locale-prefixed deep link and its
 * already-translated discount-reason line, and hands them to the presentational
 * {@link _RecommendedCourses}. See `tiers/split.md`.
 * @param props - optional className for the root element.
 */
export const RecommendedCourses = ({
    className,
}: RecommendedCoursesProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const { data, isLoading, error, mutate } = useQueryRecommendedCoursesSwr()
    const items = data?.items ?? []

    const resolvedItems: Array<RecommendedCoursesItem> = items.map((course) => {
        const discounted = course.discountPercent > 0
        return {
            displayId: course.displayId,
            title: course.title,
            description: course.description,
            thumbnailUrl: course.thumbnailUrl,
            href: pathConfig().locale(locale).course(course.displayId).build(),
            discountedPriceVnd: course.discountedPriceVnd,
            originalPriceVnd: course.originalPriceVnd,
            discounted,
            reasonText: discounted && course.discountReason !== "none"
                ? t(`DashboardPage.recommended.reason.${course.discountReason}`, { count: course.enrolledCount })
                : undefined,
        }
    })

    return (
        <_RecommendedCourses
            className={className}
            // first load, nothing in hand → shimmer (loading-and-skeleton.md's dominant idiom)
            isSkeleton={isLoading && items.length === 0}
            // settled with zero recommendations → the block hides itself
            isEmpty={items.length === 0}
            // only a settled fetch error with nothing in hand reaches the block — a background
            // revalidation failure never interrupts an already-loaded list
            error={items.length === 0 ? error : undefined}
            onRetry={() => { void mutate() }}
            items={resolvedItems}
            labels={{
                title: t("DashboardPage.recommended.title"),
                loadErrorTitle: t("DashboardPage.loadError"),
                retry: t("DashboardPage.retry"),
            }}
        />
    )
}
