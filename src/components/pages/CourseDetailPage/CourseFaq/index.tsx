"use client"

import React, { useMemo } from "react"
import { useTranslations } from "next-intl"
import _ from "lodash"
import { useQueryCourseSwr } from "@/hooks/swr/api/graphql/queries/useQueryCourseSwr"
import { useAppSelector } from "@/redux/hooks"
import { _CourseFaq } from "./component"

/**
 * FAQ section — the CONNECTED half: it reads redux + the course SWR flags, resolves every label,
 * and hands them to the presentational {@link _CourseFaq}. See `design/storybook/architecture/split.md`.
 */
export const CourseFaq = () => {
    const t = useTranslations()
    const { isLoading, error, mutate } = useQueryCourseSwr()
    const rawQnas = useAppSelector((state) => state.course.entity?.qnas)

    const qnas = useMemo(
        () => _.cloneDeep(rawQnas ?? []).sort((a, b) => a.sortIndex - b.sortIndex),
        [rawQnas],
    )

    return (
        <_CourseFaq
            // first load, nothing in hand → shimmer (loading-and-skeleton.md's first-load formula)
            isSkeleton={isLoading && qnas.length === 0}
            isEmpty={qnas.length === 0}
            error={error}
            onRetry={() => {
                void mutate()
            }}
            qnas={qnas}
            labels={{
                label: t("courseLanding.faq"),
                errorTitle: t("courseLanding.errorTitle"),
                retry: t("courseLanding.retry"),
                emptyTitle: t("courseLanding.empty.faq.title"),
                emptyDescription: t("courseLanding.empty.faq.hint"),
            }}
        />
    )
}
