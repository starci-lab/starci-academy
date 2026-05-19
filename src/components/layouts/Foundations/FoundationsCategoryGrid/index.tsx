"use client"

import React, { useMemo } from "react"
import {
    Breadcrumbs,
    Skeleton,
} from "@heroui/react"
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
    useAppDispatch,
    useAppSelector,
} from "@/redux"
import {
    setFoundation,
    setFoundationCategory,
    setFoundationCategoryDisplayId,
    setFoundationId,
    setFoundations,
} from "@/redux/slices"
import {
    useQueryFoundationCategoriesSwr,
} from "@/hooks/singleton"
import { FoundationCategoryCard } from "../FoundationCategoryCard"

/** One breadcrumb row for the foundations overview page. */
type FoundationsGridBreadcrumbItem = {
    /** Stable React key. */
    key: string
    /** Visible label. */
    label: string
    /** Optional navigation handler. */
    onPress?: () => void
}

/**
 * Foundations hub: grid of category cards; click opens the category learn page.
 */
export const FoundationsCategoryGridLayout = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const dispatch = useAppDispatch()
    const course = useAppSelector((state) => state.course.entity)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    const categories = useAppSelector((state) => state.foundation.categories)

    const { isLoading } = useQueryFoundationCategoriesSwr()

    const sortedCategories = useMemo(() => {
        if (!categories?.length) {
            return []
        }
        return [...categories].sort((a, b) => a.orderIndex - b.orderIndex)
    }, [categories])

    const breadcrumbItems = useMemo((): Array<FoundationsGridBreadcrumbItem> => [
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
            key: "foundations",
            label: t("foundations.title"),
        },
    ], [
        course?.title,
        courseDisplayId,
        locale,
        router,
        t,
    ])

    const onSelectCategory = (category: typeof sortedCategories[number]) => {
        dispatch(setFoundationCategoryDisplayId(category.displayId))
        dispatch(setFoundationCategory(category))
        dispatch(setFoundationId(undefined))
        dispatch(setFoundation(undefined))
        dispatch(setFoundations(undefined))

        if (!courseDisplayId) {
            return
        }
        router.push(
            pathConfig()
                .locale(locale)
                .course(courseDisplayId)
                .learn()
                .foundations(category.displayId)
                .build(),
        )
    }

    return (
        <div className="p-3">
            <Breadcrumbs>
                {breadcrumbItems.map((item) => (
                    <Breadcrumbs.Item
                        key={item.key}
                        onPress={item.onPress}
                    >
                        {item.label}
                    </Breadcrumbs.Item>
                ))}
            </Breadcrumbs>
            <div className="h-6" />
            <div>
                <h1 className="text-2xl font-bold">{t("foundations.title")}</h1>
                <p className="text-muted mt-2 text-sm">{t("foundations.gridDescription")}</p>
            </div>
            <div className="h-6" />
            {isLoading || categories === undefined ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <Skeleton key={index} className="h-48 rounded-xl" />
                    ))}
                </div>
            ) : sortedCategories.length === 0 ? (
                <p className="text-muted text-sm">{t("foundations.emptyCategories")}</p>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {sortedCategories.map((category) => (
                        <FoundationCategoryCard
                            key={category.id}
                            category={category}
                            onPress={onSelectCategory}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
