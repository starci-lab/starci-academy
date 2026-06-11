"use client"

import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
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
    setFoundationId,
    setFoundationLimit,
    setFoundationPageNumber,
    setFoundationSearch,
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
import {
    Pagination,
    SearchInput,
    SkeletonText,
} from "@/components/reuseable"

export { FoundationsCategoryGridLayout } from "./FoundationsCategoryGrid"

/** Max foundation resources shown per page. */
const PAGE_SIZE = 10
/** Debounce window (ms) before a typed search hits the backend. */
const SEARCH_DEBOUNCE_MS = 350

/**
 * Learn foundations page container (resources within a category).
 *
 * Server-side search + pagination via the `foundations` query: the debounced
 * search, page number and page size live in Redux and drive the SWR key, so the
 * backend returns only the current page (no client-side filtering). `"use client"`
 * for routing, redux and the open-resource side effect.
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
    const count = useAppSelector((state) => state.foundation.count)
    const pageNumber = useAppSelector((state) => state.foundation.pageNumber)
    const search = useAppSelector((state) => state.foundation.search)
    const openedFromUrlRef = useRef<string | null>(null)

    useQueryFoundationCategoriesSwr()
    const { data: foundationsData, isLoading: isFoundationsLoading } = useQueryFoundationsSwr()

    /** Immediate search input value (drives the field). */
    const [query, setQuery] = useState("")

    // when the active category changes, reset paging/search to a clean first page (size 10)
    useEffect(() => {
        dispatch(setFoundationLimit(PAGE_SIZE))
        dispatch(setFoundationPageNumber(1))
        dispatch(setFoundationSearch(undefined))
        setQuery("")
    }, [category?.id, dispatch])

    // debounce the input into redux; changing the search resets to the first page
    useEffect(() => {
        const handle = setTimeout(() => {
            dispatch(setFoundationSearch(query))
            dispatch(setFoundationPageNumber(1))
        }, SEARCH_DEBOUNCE_MS)
        return () => clearTimeout(handle)
    }, [query, dispatch])

    /** Total pages derived from the server count + page size (at least 1). */
    const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE))
    /** Current page clamped to the available range. */
    const currentPage = Math.min(pageNumber ?? 1, totalPages)
    /** A search is active but the server returned no matches. */
    const hasNoMatches = !isFoundationsLoading
        && foundations !== undefined
        && (search?.trim().length ?? 0) > 0
        && count === 0

    /** Navigate back to the foundations category hub. */
    const onBack = useCallback(() => {
        if (!courseDisplayId) {
            return
        }
        router.push(
            pathConfig()
                .locale(locale)
                .course(courseDisplayId)
                .learn()
                .foundations()
                .build(),
        )
    }, [
        courseDisplayId,
        locale,
        router,
    ])

    /** Change the current page of resources. */
    const onPageChange = useCallback((nextPage: number) => {
        dispatch(setFoundationPageNumber(nextPage))
    }, [dispatch])

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

    // typeahead suggestions for the resource search — reuse the category-scoped server
    // search results (titles) so the dropdown matches the grid without a separate endpoint
    const resourceSuggestions = useMemo(
        () => sortedFoundations.map((foundation) => ({
            id: foundation.id,
            label: foundation.title,
        })),
        [sortedFoundations],
    )

    /** Fill the search box with the chosen resource title (the grid then narrows to it). */
    const onSelectResourceSuggestion = useCallback(
        (suggestion: { id: string; label: string }) => {
            setQuery(suggestion.label)
        },
        [],
    )

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
            <FoundationsLearnHeader
                onBack={onBack}
            />
            <div className="h-6" />
            {/* search row: box (server-side, debounced) on the left, resource count right-aligned */}
            <div className="flex items-center justify-between gap-3">
                <SearchInput
                    variant="secondary"
                    value={query}
                    onValueChange={setQuery}
                    placeholder={t("foundations.searchResourcesPlaceholder")}
                    suggestions={resourceSuggestions}
                    onSelectSuggestion={onSelectResourceSuggestion}
                />
                {(isFoundationsLoading && !foundationsData) || foundations === undefined ? (
                    <SkeletonText size="sm" width="w-[110px]" />
                ) : (
                    <p className="text-muted shrink-0 text-sm">
                        {t("foundations.count", { count: count ?? 0 })}
                    </p>
                )}
            </div>
            <div className="h-6" />
            {hasNoMatches ? (
                <p className="text-muted text-sm">
                    {t("foundations.searchResourcesEmpty", { query: search?.trim() ?? "" })}
                </p>
            ) : (
                <>
                    <FoundationsList
                        foundations={foundations}
                        isLoading={isFoundationsLoading && !foundationsData}
                        sortedFoundations={sortedFoundations}
                        onSelect={onSelectFoundation}
                    />
                    {/* server-driven pagination; persists across page/search loads (count in redux) */}
                    {(count ?? 0) > 0 ? (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={onPageChange}
                        />
                    ) : null}
                </>
            )}
        </div>
    )
}
