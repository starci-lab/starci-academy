"use client"

import React, { useEffect, useMemo, useRef } from "react"
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
    setFoundationId,
} from "@/redux/slices"
import {
    useQueryFoundationCategoriesSwr,
    useQueryFoundationsSwr,
} from "@/hooks/singleton"
import { FoundationCard } from "./FoundationCard"
import { FoundationCardSkeleton } from "./FoundationCardSkeleton"
import { useOpenFoundationResource } from "./hooks"
import { compareFoundations } from "./utils"

/** One breadcrumb row for the learn foundations page. */
type FoundationsLearnBreadcrumbItem = {
    /** Stable React key. */
    key: string
    /** Visible label. */
    label: string
    /** Optional navigation handler. */
    onPress?: () => void
}

export { FoundationsCategoryGridLayout } from "./FoundationsCategoryGrid"

/**
 * Learn foundations page: list of resources; click opens modal or external link.
 */
export const FoundationsLearnLayout = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const dispatch = useAppDispatch()
    const openFoundationResource = useOpenFoundationResource()
    const course = useAppSelector((state) => state.course.entity)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    const category = useAppSelector((state) => state.foundation.category)
    const categoryId = useAppSelector((state) => state.foundation.categoryId)
    const foundations = useAppSelector((state) => state.foundation.entities)
    const count = useAppSelector((state) => state.foundation.count)
    const foundationId = useAppSelector((state) => state.foundation.foundationId)
    const openedFromUrlRef = useRef<string | null>(null)

    useQueryFoundationCategoriesSwr()
    useQueryFoundationsSwr()

    const breadcrumbItems = useMemo((): Array<FoundationsLearnBreadcrumbItem> => [
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
            key: "foundations",
            label: category?.title || t("foundations.title"),
        },
    ], [
        category?.title,
        course?.title,
        courseDisplayId,
        locale,
        router,
        t,
    ])

    const sortedFoundations = useMemo(() => {
        if (!foundations?.length) {
            return []
        }
        return [...foundations].sort(compareFoundations)
    }, [foundations])

    const onSelectFoundation = (foundation: typeof sortedFoundations[number]) => {
        dispatch(setFoundation(foundation))
        dispatch(setFoundationId(foundation.id))

        if (courseDisplayId && categoryId) {
            router.push(
                pathConfig()
                    .locale(locale)
                    .course(courseDisplayId)
                    .learn()
                    .foundations(categoryId)
                    .item(foundation.id)
                    .build(),
            )
        }

        openFoundationResource(foundation)
    }

    useEffect(() => {
        if (!foundationId || !sortedFoundations.length) {
            return
        }
        if (openedFromUrlRef.current === foundationId) {
            return
        }

        const fromUrl = sortedFoundations.find(
            (item) => item.id === foundationId,
        )
        if (!fromUrl) {
            return
        }

        openedFromUrlRef.current = foundationId
        dispatch(setFoundation(fromUrl))
        openFoundationResource(fromUrl)
    }, [
        dispatch,
        foundationId,
        openFoundationResource,
        sortedFoundations,
    ])

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
                <div className="text-2xl font-bold">{category?.title || t("foundations.title")}</div>
                {category?.description ? (
                    <p className="text-muted mt-2 text-sm">{category.description}</p>
                ) : (
                    <p className="text-muted mt-2 text-sm">{t("foundations.description")}</p>
                )}
            </div>
            <div className="h-6" />
            {!foundations ? (
                <Skeleton className="h-[14px] w-[150px] my-[3px]" />
            ) : (
                <p className="text-muted text-sm">
                    {t("foundations.count", { count: count ?? 0 })}
                </p>
            )}
            <div className="h-6" />
            {!foundations ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <FoundationCardSkeleton key={index} />
                    ))}
                </div>
            ) : sortedFoundations.length === 0 ? (
                <p className="text-muted text-sm">{t("foundations.empty")}</p>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {sortedFoundations.map((foundation, index) => (
                        <FoundationCard
                            key={foundation.id}
                            foundation={foundation}
                            displayIndex={index}
                            onSelect={onSelectFoundation}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
