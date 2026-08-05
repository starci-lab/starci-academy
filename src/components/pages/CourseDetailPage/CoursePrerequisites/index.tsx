"use client"

import React, {
    useMemo,
} from "react"
import {
    useTranslations,
} from "next-intl"
import _ from "lodash"
import { useQueryCourseSwr } from "@/hooks/swr/api/graphql/queries/useQueryCourseSwr"
import { useAppSelector } from "@/redux/hooks"
import { _CoursePrerequisites } from "./component"

/**
 * "Before you start" section — the CONNECTED half: it reads the course SWR flags + the redux
 * entity, sorts the prerequisite rows, resolves every label, and hands them to the
 * presentational {@link _CoursePrerequisites}. See `tiers/split.md`.
 */
export const CoursePrerequisites = () => {
    const t = useTranslations()
    const { isLoading, error, mutate } = useQueryCourseSwr()
    const rawItems = useAppSelector((state) => state.course.entity?.prerequisites)

    const items = useMemo(
        () => _.cloneDeep(rawItems ?? []).sort((a, b) => a.sortIndex - b.sortIndex),
        [rawItems],
    )

    return (
        <_CoursePrerequisites
            // first load, nothing in hand → shimmer; settled (items in hand) stops it (loading-and-skeleton.md §2)
            isSkeleton={isLoading && items.length === 0}
            isEmpty={items.length === 0}
            error={error}
            onRetry={() => mutate()}
            items={items}
            labels={{
                label: t("courseLanding.prerequisites"),
                errorTitle: t("courseLanding.errorTitle"),
                retry: t("courseLanding.retry"),
                emptyTitle: t("courseLanding.empty.prerequisites.title"),
                emptyDescription: t("courseLanding.empty.prerequisites.hint"),
            }}
        />
    )
}
