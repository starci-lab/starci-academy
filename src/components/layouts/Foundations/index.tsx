"use client"

import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
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
    useAppDispatch,
    useAppSelector,
} from "@/redux"
import {
    setFoundation,
    setFoundationId,
} from "@/redux/slices"
import type {
    FoundationEntity,
} from "@/modules/types"
import {
    useQueryFoundationCategoriesSwr,
    useQueryFoundationsSwr,
} from "@/hooks"
import type {
    FoundationsBreadcrumbItem,
} from "./types"
import {
    useOpenFoundationResource,
} from "./hooks"
import {
    compareFoundations,
} from "./utils"
import {
    FoundationsBreadcrumbs,
} from "./FoundationsBreadcrumbs"
import {
    FoundationsLearnHeader,
} from "./FoundationsLearnHeader"
import {
    FoundationsList,
} from "./FoundationsList"

export { FoundationsCategoryGridLayout } from "./FoundationsCategoryGrid"

/**
 * Learn foundations page container.
 *
 * Owns the cross-cutting concerns: SWR data loading, the shared breadcrumb trail
 * (the breadcrumb component is reused across the hub/category/detail pages, so it
 * stays prop-driven), the foundations sort, the select action and the deep-link
 * auto-open effect. The header is a self-contained section that reads its own
 * Redux/i18n; the list stays prop-driven because it shares the sorted list with
 * the auto-open effect. `"use client"` for routing, redux and the open-resource
 * side effect.
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
    const foundationId = useAppSelector((state) => state.foundation.foundationId)
    const openedFromUrlRef = useRef<string | null>(null)

    useQueryFoundationCategoriesSwr()
    useQueryFoundationsSwr()

    /** Breadcrumb trail from home → courses → course → foundations hub → category. */
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

    /** Foundations sorted into display order (StarCi video → roadmap → cheatsheet → rest). */
    const sortedFoundations = useMemo(() => {
        if (!foundations?.length) {
            return []
        }
        return [...foundations].sort(compareFoundations)
    }, [foundations])

    /** Select a foundation: persist it, deep-link the URL, then open its viewer. */
    const onSelectFoundation = useCallback(
        (foundation: FoundationEntity) => {
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
        },
        [
            dispatch,
            courseDisplayId,
            categoryId,
            locale,
            router,
            openFoundationResource,
        ],
    )

    // auto-open a deep-linked foundation once the list is available
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
            <FoundationsBreadcrumbs items={breadcrumbItems} />
            <div className="h-6" />
            <FoundationsLearnHeader />
            <div className="h-6" />
            <FoundationsList
                foundations={foundations}
                sortedFoundations={sortedFoundations}
                onSelect={onSelectFoundation}
            />
        </div>
    )
}
