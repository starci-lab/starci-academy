"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { useQueryCourseSwr } from "@/hooks/swr/api/graphql/queries/useQueryCourseSwr"
import { useAppSelector } from "@/redux/hooks"
import { _CourseValueProps } from "./component"

/**
 * "What you'll get" section — the CONNECTED half: it reads redux + the course SWR flags,
 * resolves every label, and hands them to the presentational {@link _CourseValueProps}.
 * See `design/storybook/architecture/split.md`.
 */
export const CourseValueProps = () => {
    const t = useTranslations()
    const { isLoading, error, mutate } = useQueryCourseSwr()
    const items = useAppSelector((state) => state.course.entity?.valuePropositions) ?? []

    return (
        <_CourseValueProps
            // first load, nothing in hand → shimmer (loading-and-skeleton.md's first-load formula)
            isSkeleton={isLoading && items.length === 0}
            isEmpty={items.length === 0}
            error={error}
            onRetry={() => {
                void mutate()
            }}
            items={items}
            labels={{
                label: t("courseLanding.valueProps"),
                errorTitle: t("courseLanding.errorTitle"),
                retry: t("courseLanding.retry"),
                emptyTitle: t("courseLanding.empty.valueProps.title"),
                emptyDescription: t("courseLanding.empty.valueProps.hint"),
            }}
        />
    )
}
