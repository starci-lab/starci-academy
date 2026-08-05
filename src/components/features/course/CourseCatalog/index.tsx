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
    _CourseCatalog,
    PAGE_SIZE,
    type CatalogView,
} from "./component"
import { useQueryCoursesSwr } from "@/hooks/swr/api/graphql/queries/useQueryCoursesSwr"
import { pathConfig } from "@/resources/path"

/** Debounce window (ms) before a typed search hits the backend. */
const SEARCH_DEBOUNCE_MS = 350

/**
 * Curated learning-path order for the featured tracks (Fullstack → Claude). The
 * ES-backed `courses` query only sorts by title/date, so the catalog reorders
 * client-side by `displayId`; courses outside this list keep their tail order.
 */
const COURSE_ORDER: ReadonlyArray<string> = [
    "fullstack-mastery",
    "system-design-mastery",
    "devops-mastery",
    "ai-llm-mastery",
    "claude-mastery",
]

/** localStorage key persisting the chosen catalog view across sessions. */
const VIEW_STORAGE_KEY = "starci.course.catalogView"

/** Props for {@link CourseCatalog}. */
/**
 * Featured courses catalog (UI 2.0 feature) — the CONNECTED half: owns the
 * search + page + view state, reads the courses SWR, computes the async
 * decisions (`isSkeleton`/`isEmpty`/`error`, `loading-and-skeleton.md`), and
 * resolves every label before handing them to the presentational
 * `_CourseCatalog`. See `design/storybook/architecture/tiers/split.md`.
 *
 * @param props - {@link CourseCatalogProps}
 */
export const CourseCatalog = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()

    /** Immediate input value (drives the field). */
    const [query, setQuery] = useState("")
    /** Debounced query that actually hits the backend. */
    const [debouncedQuery, setDebouncedQuery] = useState("")
    /** Zero-based page index. */
    const [pageNumber, setPageNumber] = useState(0)
    /** grid (default) vs line layout; hydrated from localStorage after mount (SSR-safe). */
    const [view, setView] = useState<CatalogView>("grid")

    useEffect(() => {
        const saved = window.localStorage.getItem(VIEW_STORAGE_KEY)
        if (saved === "grid" || saved === "line") {
            setView(saved)
        }
    }, [])

    const onChangeView = useCallback((next: CatalogView) => {
        setView(next)
        try {
            window.localStorage.setItem(VIEW_STORAGE_KEY, next)
        } catch {
            // storage unavailable (private mode) — the view simply won't persist
        }
    }, [])

    // debounce the search input before it reaches the backend
    useEffect(() => {
        const handle = setTimeout(() => setDebouncedQuery(query), SEARCH_DEBOUNCE_MS)
        return () => clearTimeout(handle)
    }, [query])

    // a new search always restarts at the first page
    useEffect(() => {
        setPageNumber(0)
    }, [debouncedQuery])

    const swr = useQueryCoursesSwr({
        search: debouncedQuery,
        pageNumber,
        limit: PAGE_SIZE,
    })
    const payload = swr.data?.courses?.data
    const list = useMemo(() => {
        const data = payload?.data ?? []
        // reorder by the curated learning-path order (Fullstack → Claude); courses
        // not in COURSE_ORDER fall to the tail in their original order.
        const rankOf = (displayId: string) => {
            const index = COURSE_ORDER.indexOf(displayId)
            return index === -1 ? COURSE_ORDER.length : index
        }
        return [...data].sort((left, right) => rankOf(left.displayId) - rankOf(right.displayId))
    }, [payload])
    const count = payload?.count ?? 0
    const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE))
    const currentPage = pageNumber + 1

    /** Navigate to the home page (breadcrumb root). */
    const onNavigateHome = useCallback(
        () => router.push(pathConfig().locale(locale).build()),
        [router, locale],
    )

    /** Clears the search so the filtered-empty "clear filter" action can reset it. */
    const onClearFilter = useCallback(() => {
        setQuery("")
        setDebouncedQuery("")
    }, [])

    return (
        <_CourseCatalog
            // first load, nothing in hand → shimmer; matches the pre-split `isLoading && list.length === 0`
            isSkeleton={swr.isLoading && list.length === 0}
            isEmpty={!swr.isLoading && list.length === 0}
            // only a settled fetch error (nothing cached to fall back to) reaches the block
            error={list.length === 0 ? swr.error : undefined}
            errorContent={{
                title: t("courses.loadError"),
                onRetry: () => void swr.mutate(),
                retryLabel: t("courses.retry"),
            }}
            emptyContent={debouncedQuery ? {
                title: t("courses.emptyFiltered.title", { query: debouncedQuery }),
                description: t("courses.emptyFiltered.description"),
                onRetry: onClearFilter,
                retryLabel: t("courses.emptyFiltered.clearFilter"),
            } : { title: t("courses.empty") }}
            list={list}
            view={view}
            onChangeView={onChangeView}
            query={query}
            onQueryChange={setQuery}
            countLabel={count > 0 ? t("courses.count", { count }) : undefined}
            onNavigateHome={onNavigateHome}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(nextPage) => setPageNumber(nextPage - 1)}
            labels={{
                navHome: t("nav.home"),
                navCourses: t("nav.courses"),
                title: t("courses.featuredTitle"),
                searchPlaceholder: t("courses.searchPlaceholder"),
                viewAria: t("courses.viewAria"),
                viewGrid: t("courses.viewGrid"),
                viewLine: t("courses.viewLine"),
            }}
        />
    )
}
