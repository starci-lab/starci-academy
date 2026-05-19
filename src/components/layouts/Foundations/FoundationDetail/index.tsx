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
    useAppSelector,
} from "@/redux"
import {
    useQueryFoundationCategoriesSwr,
    useQueryFoundationsSwr,
} from "@/hooks/singleton"
import { FoundationCardBody } from "../FoundationCardBody"
import { FoundationItemThumbnail } from "../FoundationItemThumbnail"
import { FoundationMeta } from "../FoundationMeta"

/** One breadcrumb row for foundation detail. */
type FoundationDetailBreadcrumbItem = {
    /** Stable React key. */
    key: string
    /** Visible label. */
    label: string
    /** Optional navigation handler. */
    onPress?: () => void
}

/**
 * Learn foundations item detail: full content for one resource.
 */
export const FoundationDetailLayout = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const course = useAppSelector((state) => state.course.entity)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    const category = useAppSelector((state) => state.foundation.category)
    const categoryDisplayId = useAppSelector((state) => state.foundation.categoryDisplayId)
    const foundation = useAppSelector((state) => state.foundation.entity)
    const foundations = useAppSelector((state) => state.foundation.entities)
    const foundationId = useAppSelector((state) => state.foundation.foundationId)

    useQueryFoundationCategoriesSwr()
    useQueryFoundationsSwr()

    const categoryListHref = useMemo(() => {
        if (!courseDisplayId || !categoryDisplayId) {
            return undefined
        }
        return pathConfig()
            .locale(locale)
            .course(courseDisplayId)
            .learn()
            .foundations(categoryDisplayId)
            .build()
    }, [categoryDisplayId, courseDisplayId, locale])

    const breadcrumbItems = useMemo((): Array<FoundationDetailBreadcrumbItem> => [
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
            key: "category",
            label: category?.title || t("foundations.title"),
            onPress: categoryListHref
                ? () => router.push(categoryListHref)
                : undefined,
        },
        {
            key: "item",
            label: foundation?.title || t("foundations.detailTitle"),
        },
    ], [
        category?.title,
        categoryListHref,
        course?.title,
        courseDisplayId,
        foundation?.title,
        locale,
        router,
        t,
    ])

    const isLoading = foundations === undefined
    const isNotFound = foundations !== undefined && foundationId && !foundation

    if (isLoading) {
        return (
            <div className="p-3">
                <Skeleton className="mb-4 h-6 w-2/3 rounded-lg" />
                <Skeleton className="mb-2 h-8 w-full rounded-lg" />
                <Skeleton className="h-48 w-full rounded-lg" />
            </div>
        )
    }

    if (isNotFound || !foundation) {
        return (
            <div className="p-3">
                <p className="text-muted text-sm">{t("foundations.notFound")}</p>
            </div>
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
            <div className="card card--default max-w-2xl overflow-hidden rounded-xl border border-divider/60">
                <FoundationItemThumbnail
                    thumbnailUrl={foundation.thumbnailUrl}
                    title={foundation.title}
                    size="detail"
                />
                <div className="p-4 pt-2">
                    <h1 className="text-2xl font-bold">{foundation.title}</h1>
                    <div className="mt-2">
                        <FoundationMeta foundation={foundation} />
                    </div>
                    {
                        foundation.description ? (
                            <div className="text-muted mt-2 text-sm">{foundation.description}</div>
                        ) : null
                    }
                    <div className="h-6" />
                    <FoundationCardBody foundation={foundation} />
                </div>
            </div>
        </div>
    )
}
