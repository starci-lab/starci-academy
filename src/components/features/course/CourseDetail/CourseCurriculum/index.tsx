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
import { _CourseCurriculum } from "./component"

/**
 * Curriculum section (connected half, `tiers/split.md`): fetches the course, reads its modules from
 * redux, computes the async decisions (`isSkeleton` from the first-load formula, `isEmpty` from the
 * resolved list), resolves every label, and hands them to the presentational
 * {@link _CourseCurriculum}.
 */
export const CourseCurriculum = () => {
    const t = useTranslations()
    const { isLoading, error, mutate } = useQueryCourseSwr()
    const rawModules = useAppSelector((state) => state.course.entity?.modules)

    const modules = useMemo(
        () => _.cloneDeep(rawModules ?? []).sort((a, b) => a.sortIndex - b.sortIndex),
        [rawModules],
    )

    return (
        <_CourseCurriculum
            // first load, nothing in hand → shimmer (loading-and-skeleton.md §2)
            isSkeleton={isLoading && modules.length === 0}
            // settled with no modules → the empty message
            isEmpty={modules.length === 0}
            error={error}
            onRetry={() => { void mutate() }}
            modules={modules}
            labels={{
                curriculum: t("courseLanding.curriculum"),
                errorTitle: t("courseLanding.errorTitle"),
                retry: t("courseLanding.retry"),
                emptyTitle: t("courseLanding.empty.curriculum.title"),
                emptyDescription: t("courseLanding.empty.curriculum.hint"),
            }}
        />
    )
}
