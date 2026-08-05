"use client"

import React, {
    useCallback,
    useEffect,
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
    _FoundationsGridPage,
    type FoundationCategoryHeaderCrumb,
    type FoundationCategoryListItem,
} from "./component"
import { resolveFoundationLogo } from "@/modules/utils/foundation/foundation-logo"
import { pathConfig } from "@/resources/path"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import {
    setFoundation,
    setFoundationCategory,
    setFoundationCategoryId,
    setFoundationId,
    setFoundations,
} from "@/redux/slices/foundation"
import { useQueryFoundationCategoriesSwr } from "@/hooks/swr/api/graphql/queries/useQueryFoundationCategoriesSwr"
import { useQueryFoundationCategorySuggestionsSwr } from "@/hooks/swr/api/graphql/queries/useQueryFoundationCategorySuggestionsSwr"
import { usePaymentOverlayState } from "@/hooks/zustand/overlay/hooks"
import { PaymentFlow } from "@/modules/types/payment"

/** Max category rows shown per page. */
const PAGE_SIZE = 10
/** Debounce window (ms) before a typed search hits the backend. */
const SEARCH_DEBOUNCE_MS = 350

/**
 * `FoundationsGridPage` — the CONNECTED half of the SRC TWIN. Mirrors the data
 * wiring already proven in `src/components/features/learn/Foundations/
 * FoundationsCategoryGrid` (v1: `FoundationsCategoryGridLayout`) onto the
 * storybook-driven block tree in `./component` instead of that v1's hand-built
 * layout — same route (`/foundations`, NOT swapped here), same redux/SWR
 * sources.
 *
 * Server-side search + pagination: the debounced query and page drive the
 * `foundationCategories` SWR key, so the backend returns only the current
 * page (no client-side filtering). Autocomplete suggestions come from the
 * separate `foundationCategorySuggestions` ES-backed query. Selecting a
 * category persists it to redux and navigates into it (same dispatch chain
 * `FoundationCategoryCard` already makes). The ambient trial → enroll nudge
 * reads off the same `state.user` fields `TrialEnrollHook` reads.
 */
export const FoundationsGridPage = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const dispatch = useAppDispatch()
    const course = useAppSelector((state) => state.course.entity)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    const enrolled = useAppSelector((state) => state.user.enrolled)
    const enrollKnown = useAppSelector((state) => state.user.enrollKnown)
    const { open: openPayment } = usePaymentOverlayState()

    /** Immediate input value (drives the field). */
    const [query, setQuery] = useState("")
    /** Debounced query that actually hits the backend. */
    const [debouncedQuery, setDebouncedQuery] = useState("")
    /** 1-based current page. */
    const [page, setPage] = useState(1)

    // debounce the search input; changing the query also resets to the first page
    useEffect(() => {
        const handle = setTimeout(() => {
            setDebouncedQuery(query)
            setPage(1)
        }, SEARCH_DEBOUNCE_MS)
        return () => clearTimeout(handle)
    }, [query])

    // server-side: the backend returns exactly this page for this search
    const { data, isLoading } = useQueryFoundationCategoriesSwr({
        search: debouncedQuery,
        page,
        limit: PAGE_SIZE,
    })

    /** Categories for the current page (undefined while the first load is in flight). */
    const pageCategories = data?.data
    /** Total matching categories across all pages (from the server). */
    const totalCount = data?.totalCount ?? 0
    /** Total pages derived from the server total (at least 1). */
    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
    /** Page clamped to the available range for the pagination control. */
    const currentPage = Math.min(page, totalPages)
    /** First load: nothing cached yet for the current key. */
    const isFirstLoad = isLoading && !data

    // ES Completion Suggester (typeahead): clean { id, label } items from the BE,
    // no client-side filtering or label munging.
    const { data: suggestionItems } = useQueryFoundationCategorySuggestionsSwr(debouncedQuery)
    const suggestions = suggestionItems ?? []

    /** Fill the search box with the chosen suggestion's label (the grid then narrows to it). */
    const onSelectSuggestion = useCallback(
        (id: string) => {
            const suggestion = suggestions.find((item) => item.id === id)
            if (suggestion) {
                setQuery(suggestion.label)
            }
        },
        [suggestions],
    )

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
    const breadcrumbItems = useMemo((): Array<FoundationCategoryHeaderCrumb> => [
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

    /** Current page's categories, mapped into the block's row shape. */
    const categoryItems: Array<FoundationCategoryListItem> = useMemo(
        () => (pageCategories ?? []).map((category) => ({
            id: category.id,
            title: category.title,
            description: category.description ?? undefined,
            logoSrc: resolveFoundationLogo(category.title) ?? undefined,
            thumbnailUrl: category.thumbnailUrl ?? undefined,
        })),
        [pageCategories],
    )

    /** Select a category: persist to store, reset foundation state, navigate — same chain `FoundationCategoryCard` makes. */
    const onSelectCategory = useCallback(
        (id: string) => {
            const category = pageCategories?.find((item) => item.id === id)
            if (!category) {
                return
            }
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
            pageCategories,
            router,
        ],
    )

    /** Open the shared enroll payment flow — same call `TrialEnrollHook` makes. */
    const onEnrollTrial = useCallback(
        () => openPayment({ flow: PaymentFlow.CourseEnroll }),
        [openPayment],
    )

    return (
        <_FoundationsGridPage
            breadcrumbItems={breadcrumbItems}
            title={t("foundations.title")}
            description={t("foundations.gridDescription")}
            isTrialBannerVisible={enrollKnown && !enrolled}
            onEnrollTrial={onEnrollTrial}
            searchQuery={query}
            onSearchQueryChange={setQuery}
            suggestions={suggestions}
            onSelectSuggestion={onSelectSuggestion}
            categoryCount={isFirstLoad ? undefined : totalCount}
            categories={categoryItems}
            onSelectCategory={onSelectCategory}
            pagination={totalCount > 0 ? { currentPage, totalPages, onPageChange: setPage } : undefined}
            isSkeleton={isFirstLoad}
        />
    )
}
