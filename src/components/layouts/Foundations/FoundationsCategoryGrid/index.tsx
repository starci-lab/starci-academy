"use client"

import React, {
    useCallback,
    useMemo,
    useState,
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
    setFoundationCategory,
    setFoundationCategoryId,
    setFoundationId,
    setFoundations,
} from "@/redux/slices"
import type {
    FoundationCategoryEntity,
} from "@/modules/types"
import {
    useQueryFoundationCategoriesSwr,
} from "@/hooks"
import type {
    FoundationsBreadcrumbItem,
} from "../types"
import {
    FoundationsBreadcrumbs,
} from "../FoundationsBreadcrumbs"
import {
    FoundationsCategoryGridHeader,
} from "./FoundationsCategoryGridHeader"
import {
    FoundationsCategoryGridSearch,
} from "./FoundationsCategoryGridSearch"
import {
    FoundationsCategoryGridBody,
} from "./FoundationsCategoryGridBody"

/**
 * Foundations hub container: grid of category cards; selecting one opens the
 * category learn page.
 *
 * Owns data (SWR + redux), breadcrumb/sort derivations and the select action;
 * renders presentational children. `"use client"` for routing and redux.
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

    /** Live search query for filtering the category cards by title/description. */
    const [query, setQuery] = useState("")

    /** Categories sorted ascending by their order index. */
    const sortedCategories = useMemo(() => {
        if (!categories?.length) {
            return []
        }
        return [...categories].sort((a, b) => a.orderIndex - b.orderIndex)
    }, [categories])

    /** Sorted categories narrowed by the (case-insensitive) search query. */
    const filteredCategories = useMemo(() => {
        const normalized = query.trim().toLowerCase()
        if (!normalized) {
            return sortedCategories
        }
        return sortedCategories.filter((category) => {
            const haystack = `${category.title ?? ""} ${category.description ?? ""}`.toLowerCase()
            return haystack.includes(normalized)
        })
    }, [query, sortedCategories])

    /** Categories exist but the current query matched none of them. */
    const hasNoMatches = !isLoading
        && categories !== undefined
        && sortedCategories.length > 0
        && filteredCategories.length === 0

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

    /** Breadcrumb trail from home → courses → course → foundations hub. */
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
            key: "foundations",
            label: t("foundations.title"),
        },
    ], [
        course?.title,
        onPressCourse,
        onPressCourses,
        onPressHome,
        t,
    ])

    /** Select a category: persist it, reset the foundation selection, deep-link the URL. */
    const onSelectCategory = useCallback(
        (category: FoundationCategoryEntity) => {
            dispatch(setFoundationCategoryId(category.id))
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
                    .foundations(category.id)
                    .build(),
            )
        },
        [
            courseDisplayId,
            dispatch,
            locale,
            router,
        ],
    )

    return (
        <div className="p-3">
            <FoundationsBreadcrumbs items={breadcrumbItems} />
            <div className="h-6" />
            <FoundationsCategoryGridHeader />
            <div className="h-6" />
            {/* search box appears once categories have loaded; filters the grid client-side */}
            {!isLoading && (categories?.length ?? 0) > 0 ? (
                <>
                    <FoundationsCategoryGridSearch value={query} onValueChange={setQuery} />
                    <div className="h-6" />
                </>
            ) : null}
            {hasNoMatches ? (
                <p className="text-muted text-sm">{t("foundations.searchEmpty", { query: query.trim() })}</p>
            ) : (
                <FoundationsCategoryGridBody
                    categories={categories}
                    sortedCategories={filteredCategories}
                    isLoading={isLoading}
                    onSelect={onSelectCategory}
                />
            )}
        </div>
    )
}
