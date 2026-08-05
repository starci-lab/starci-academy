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
    _FoundationsCategoryPage,
    type FoundationResourceItem,
    type FoundationsHeaderCrumb,
} from "./component"
import type { FoundationKindEnum } from "@/components/starci/blocks/learn/FoundationResourceList"
import { FoundationKind } from "@/modules/types/enums/foundation-kind"
import type { FoundationEntity } from "@/modules/types/entities/foundation"
import { compareFoundations, resolveFoundationMountFileUrl } from "@/components/features/learn/Foundations/utils"
import { pathConfig } from "@/resources/path"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import {
    setFoundation,
    setFoundationId,
    setFoundationLimit,
    setFoundationPageNumber,
    setFoundationSearch,
} from "@/redux/slices/foundation"
import { useQueryFoundationCategoriesSwr } from "@/hooks/swr/api/graphql/queries/useQueryFoundationCategoriesSwr"
import { useQueryFoundationsSwr } from "@/hooks/swr/api/graphql/queries/useQueryFoundationsSwr"
import { usePaymentOverlayState } from "@/hooks/zustand/overlay/hooks"
import { PaymentFlow } from "@/modules/types/payment"

/** Max foundation resources shown per page. */
const PAGE_SIZE = 10
/** Debounce window (ms) before a typed search hits the backend. */
const SEARCH_DEBOUNCE_MS = 350

/**
 * v1's `FoundationKind` (content FORMAT: document / video / external link) →
 * the blueprint block's `FoundationKindEnum` (content GENRE the row's chip
 * names). `document` maps to `"article"` on purpose — it is the exact label
 * v1 already gives it (`messages/en.json` → `foundations.kind.document` =
 * "Article"). `external_link` maps to `"reference"` — the closest existing
 * genre for an off-site link. v1 has no data that is ever `"exercise"`; the
 * block still accepts it; nothing in this mapping produces it today.
 */
const FOUNDATION_KIND_MAP: Record<FoundationKind, FoundationKindEnum> = {
    [FoundationKind.Document]: "article",
    [FoundationKind.Video]: "video",
    [FoundationKind.ExternalLink]: "reference",
}

/**
 * `FoundationsCategoryPage` — the CONNECTED half of the SRC TWIN. Mirrors the
 * data wiring already proven in `src/components/features/learn/Foundations`
 * (v1: `FoundationsLearnLayout`) onto the storybook-driven block tree in
 * `./component` instead of that v1's hand-built layout — same route
 * (`/foundations/[categoryId]`, NOT swapped here), same redux/SWR sources.
 *
 * Server-side search + pagination: the debounced query and page drive the
 * `foundations` SWR key, so the backend returns only the current category's
 * current page (no client-side filtering). There is no separate suggestion
 * endpoint for resources (unlike categories), so the typeahead reuses the
 * same page's titles, exactly as v1's `FoundationsLearnLayout` does. Opening
 * a resource dispatches the same select-and-navigate chain `FoundationCard`
 * already makes: external links open in a new tab, document/video resources
 * navigate to their dedicated page. The ambient trial → enroll nudge reads
 * off the same `state.user` fields `TrialEnrollHook` reads.
 */
export const FoundationsCategoryPage = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const dispatch = useAppDispatch()
    const course = useAppSelector((state) => state.course.entity)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    const category = useAppSelector((state) => state.foundation.category)
    const categoryId = useAppSelector((state) => state.foundation.categoryId)
    const foundations = useAppSelector((state) => state.foundation.entities)
    const count = useAppSelector((state) => state.foundation.count)
    const pageNumber = useAppSelector((state) => state.foundation.pageNumber)
    const enrolled = useAppSelector((state) => state.user.enrolled)
    const enrollKnown = useAppSelector((state) => state.user.enrollKnown)
    const { open: openPayment } = usePaymentOverlayState()

    // load the category title so a cold deep-link can resolve it, same as `FoundationsLearnLayout`
    useQueryFoundationCategoriesSwr()
    const { data: foundationsData, isLoading: isFoundationsLoading, error: foundationsError } = useQueryFoundationsSwr()

    /** Immediate search input value (drives the field). */
    const [query, setQuery] = useState("")

    // when the active category changes, reset paging/search to a clean first page
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
    /** First load: nothing cached yet for the current key. */
    const isFirstLoad = (isFoundationsLoading && !foundationsData) || foundations === undefined

    /** Change the current page of resources. */
    const onPageChange = useCallback((nextPage: number) => {
        dispatch(setFoundationPageNumber(nextPage))
    }, [dispatch])

    /** Breadcrumb trail from home → courses → course → foundations hub → category. */
    const breadcrumbItems = useMemo((): Array<FoundationsHeaderCrumb> => [
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
        },
    ], [
        category?.title,
        course?.title,
        courseDisplayId,
        locale,
        router,
        t,
    ])

    /** Open a resource: external links go to a new tab; document/video navigate to their dedicated page — same chain `FoundationCard` makes. */
    const onSelectResource = useCallback(
        (foundation: FoundationEntity) => {
            dispatch(setFoundation(foundation))
            dispatch(setFoundationId(foundation.id))

            if (foundation.kind === FoundationKind.ExternalLink) {
                if (foundation.value?.trim()) {
                    window.open(
                        resolveFoundationMountFileUrl(foundation.value),
                        "_blank",
                        "noopener,noreferrer",
                    )
                }
                return
            }

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
        },
        [
            categoryId,
            courseDisplayId,
            dispatch,
            locale,
            router,
        ],
    )

    /** Current page's resources, sorted the same way `FoundationsList` sorts them (StarCi video → roadmap → cheatsheet → rest). */
    const sortedFoundations = useMemo(
        () => (foundations ?? []).slice().sort(compareFoundations),
        [foundations],
    )

    /** Sorted resources mapped into the block's row shape. */
    const resourceItems: Array<FoundationResourceItem> = useMemo(
        () => sortedFoundations.map((foundation) => ({
            id: foundation.id,
            title: foundation.title,
            description: foundation.description ?? undefined,
            thumbnailUrl: foundation.thumbnailUrl ?? undefined,
            kind: FOUNDATION_KIND_MAP[foundation.kind],
            isRecommended: foundation.isRecommended,
            onPress: () => onSelectResource(foundation),
        })),
        [onSelectResource, sortedFoundations],
    )

    // typeahead suggestions: no separate suggestion endpoint for resources, so reuse
    // the category-scoped server search results (titles), same as `FoundationsLearnLayout`
    const suggestions = useMemo(
        () => (foundations ?? []).map((foundation) => ({
            id: foundation.id,
            label: foundation.title,
        })),
        [foundations],
    )

    /** Fill the search box with the chosen resource's title (the list then narrows to it). */
    const onSelectSuggestion = useCallback(
        (id: string) => {
            const suggestion = foundations?.find((foundation) => foundation.id === id)
            if (suggestion) {
                setQuery(suggestion.title)
            }
        },
        [foundations],
    )

    /** Open the shared enroll payment flow — same call `TrialEnrollHook` makes. */
    const onEnrollTrial = useCallback(
        () => openPayment({ flow: PaymentFlow.CourseEnroll }),
        [openPayment],
    )

    return (
        <_FoundationsCategoryPage
            breadcrumbItems={breadcrumbItems}
            title={category?.title || t("foundations.title")}
            description={category?.description || t("foundations.description")}
            isTrialNudgeVisible={enrollKnown && !enrolled}
            onEnrollTrial={onEnrollTrial}
            searchQuery={query}
            onSearchQueryChange={setQuery}
            suggestions={suggestions}
            onSelectSuggestion={onSelectSuggestion}
            resultCount={isFirstLoad ? undefined : count}
            isResultCountLoading={!isFirstLoad && isFoundationsLoading}
            resources={resourceItems}
            isResourcesLoading={isFirstLoad}
            resourcesError={!foundationsData ? foundationsError : undefined}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            resourceListAriaLabel={category?.title || undefined}
            isSkeleton={isFirstLoad}
        />
    )
}
