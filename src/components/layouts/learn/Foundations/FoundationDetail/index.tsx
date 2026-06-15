"use client"

import React, {
    useCallback,
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
    pathConfig,
} from "@/resources"
import {
    useAppSelector,
} from "@/redux"
import {
    useQueryFoundationCategoriesSwr,
    useQueryFoundationsSwr,
} from "@/hooks"
import type {
    FoundationsBreadcrumbItem,
} from "../types"
import {
    FoundationsBreadcrumbs,
} from "../shared/FoundationsBreadcrumbs"
import {
    FoundationDetailSkeleton,
} from "./FoundationDetailSkeleton"
import {
    FoundationDetailNotFound,
} from "./FoundationDetailNotFound"
import {
    FoundationDetailCard,
} from "./FoundationDetailCard"

/**
 * Learn foundations item detail container: full content for one resource.
 *
 * Owns data (SWR + redux) and breadcrumb derivation; renders presentational
 * children. `"use client"` for routing and redux state.
 */
export const FoundationDetailLayout = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const course = useAppSelector((state) => state.course.entity)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    const category = useAppSelector((state) => state.foundation.category)
    const categoryId = useAppSelector((state) => state.foundation.categoryId)
    const foundation = useAppSelector((state) => state.foundation.entity)
    const foundations = useAppSelector((state) => state.foundation.entities)
    const foundationId = useAppSelector((state) => state.foundation.foundationId)

    useQueryFoundationCategoriesSwr()
    useQueryFoundationsSwr()

    /** Deep link back to the category foundations list, when ids are known. */
    const categoryListHref = useMemo(() => {
        if (!courseDisplayId || !categoryId) {
            return undefined
        }
        return pathConfig()
            .locale(locale)
            .course(courseDisplayId)
            .learn()
            .foundations(categoryId)
            .build()
    }, [categoryId, courseDisplayId, locale])

    /** Navigate to the localized home page. */
    const onPressHome = useCallback(() => {
        router.push(pathConfig().locale().build())
    }, [router])

    /** Navigate to the courses listing. */
    const onPressCourses = useCallback(() => {
        router.push(pathConfig().locale(locale).course().build())
    }, [locale, router])

    /** Navigate to the current course overview. */
    const onPressCourse = useCallback(() => {
        router.push(pathConfig().locale(locale).course(courseDisplayId).build())
    }, [courseDisplayId, locale, router])

    /** Navigate back to the category foundations list, when available. */
    const onPressCategory = useCallback(() => {
        if (!categoryListHref) {
            return
        }
        router.push(categoryListHref)
    }, [categoryListHref, router])

    /** Breadcrumb trail from home → courses → course → category → item. */
    const breadcrumbItems = useMemo((): Array<FoundationsBreadcrumbItem> => [
        {
            key: "home",
            label: t("nav.home"),
            onPress: onPressHome,
        },
        {
            key: "courses",
            label: t("nav.courses"),
            onPress: onPressCourses,
        },
        {
            key: "course",
            label: course?.title || t("nav.courses"),
            onPress: onPressCourse,
        },
        {
            key: "category",
            label: category?.title || t("foundations.title"),
            onPress: categoryListHref ? onPressCategory : undefined,
        },
        {
            key: "item",
            label: foundation?.title || t("foundations.detailTitle"),
        },
    ], [
        category?.title,
        categoryListHref,
        course?.title,
        foundation?.title,
        onPressCategory,
        onPressCourse,
        onPressCourses,
        onPressHome,
        t,
    ])

    const isLoading = foundations === undefined
    const isNotFound = foundations !== undefined && foundationId && !foundation

    if (isLoading) {
        return <FoundationDetailSkeleton />
    }

    if (isNotFound || !foundation) {
        return <FoundationDetailNotFound />
    }

    return (
        <div className="p-3">
            <FoundationsBreadcrumbs items={breadcrumbItems} />
            <div className="h-6" />
            <FoundationDetailCard foundation={foundation} />
        </div>
    )
}
