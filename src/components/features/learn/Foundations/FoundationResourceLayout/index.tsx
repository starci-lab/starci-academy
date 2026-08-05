"use client"

import React, {
    useMemo,
} from "react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    _FoundationResourceLayout,
} from "./component"
import type {
    FoundationsBreadcrumbItem,
} from "../types"
import { useAppSelector } from "@/redux/hooks"
import { useQueryFoundationCategoriesSwr } from "@/hooks/swr/api/graphql/queries/useQueryFoundationCategoriesSwr"
import { useQueryFoundationsSwr } from "@/hooks/swr/api/graphql/queries/useQueryFoundationsSwr"
import { pathConfig } from "@/resources/path"

/**
 * Dedicated foundation resource page (replaces the old viewer modal) — the
 * CONNECTED half of the split (`tiers/split.md`). Route
 * `/foundations/[categoryId]/[foundationId]` renders this instead of the
 * list. The active resource is URL-synced into Redux (`UseEffects`); we load
 * the category's resource list here so a cold deep-link can resolve the
 * entity by id. `"use client"` for redux + routing.
 */
export const FoundationResourceLayout = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const course = useAppSelector((state) => state.course.entity)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    const category = useAppSelector((state) => state.foundation.category)
    const categoryId = useAppSelector((state) => state.foundation.categoryId)
    const foundation = useAppSelector((state) => state.foundation.entity)

    // load the category title + the resource list so the URL-synced entity resolves on a cold load
    useQueryFoundationCategoriesSwr()
    const { data: foundationsData, isLoading } = useQueryFoundationsSwr()

    /** First load: list still in flight and no resolved entity cached yet (loading-and-skeleton.md §2). */
    const isSkeleton = (isLoading && !foundationsData) || !foundation

    /** Breadcrumb: home → courses → course → foundations hub → category → this resource. */
    const breadcrumbItems = useMemo((): Array<FoundationsBreadcrumbItem> => [
        {
            key: "home",
            label: t("nav.home"),
            onPress: () => router.push(pathConfig().locale().build()),
        },
        {
            key: "courses",
            label: t("nav.courses"),
            onPress: () => router.push(pathConfig().locale(locale).course().build()),
        },
        {
            key: "course",
            label: course?.title || t("nav.courses"),
            onPress: () => router.push(pathConfig().locale(locale).course(courseDisplayId).build()),
        },
        {
            key: "foundations-hub",
            label: t("foundations.title"),
            onPress: () => router.push(
                pathConfig().locale(locale).course(courseDisplayId).learn().foundations().build(),
            ),
        },
        {
            key: "category",
            label: category?.title || t("foundations.title"),
            onPress: () => router.push(
                pathConfig().locale(locale).course(courseDisplayId).learn().foundations(categoryId).build(),
            ),
        },
        {
            key: "foundation",
            label: foundation?.title || t("foundations.title"),
        },
    ], [
        category?.title,
        categoryId,
        course?.title,
        courseDisplayId,
        foundation?.title,
        locale,
        router,
        t,
    ])

    return (
        <_FoundationResourceLayout
            breadcrumbItems={breadcrumbItems}
            isSkeleton={isSkeleton}
            isEmpty={!isSkeleton && !foundation}
            foundation={foundation}
            emptyTitle={t("foundations.empty")}
        />
    )
}
