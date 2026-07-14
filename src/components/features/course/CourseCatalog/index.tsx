"use client"

import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react"
import {
    Breadcrumbs,
    Card,
    Pagination,
    Skeleton,
    Typography,
} from "@heroui/react"
import {
    ListIcon,
    SquaresFourIcon,
} from "@phosphor-icons/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    CatalogCourseCard,
} from "./CatalogCourseCard"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { SearchInput } from "@/components/reuseable/SearchInput"
import { SegmentedControl } from "@/components/blocks/navigation/SegmentedControl"
import { useQueryCoursesSwr } from "@/hooks/swr/api/graphql/queries/useQueryCoursesSwr"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { CourseCardSkeleton } from "@/components/blocks/cards/CourseCardSkeleton"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { pathConfig } from "@/resources/path"

/** Debounce window (ms) before a typed search hits the backend. */
const SEARCH_DEBOUNCE_MS = 350
/** Courses per page (3 columns × 3 rows on desktop). */
const PAGE_SIZE = 9

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

/** How the catalog is laid out — a roomy card grid or a compact row list. */
type CatalogView = "grid" | "line"
/** localStorage key persisting the chosen catalog view across sessions. */
const VIEW_STORAGE_KEY = "starci.course.catalogView"

/** Props for {@link CourseCatalog}. */
export type CourseCatalogProps = WithClassNames<undefined>

/**
 * Featured courses catalog (UI 2.0 feature).
 *
 * Left-aligned header (breadcrumb → title), then a search row carrying the live
 * result count + a grid ⇆ list view toggle (persisted), and a server-side
 * searchable + paginated catalog (ES-backed `courses`) rendered through
 * {@link AsyncContent} with the {@link CourseCard} block in either a roomy grid or
 * a compact line list. Self-contained: owns the search + page + view state and
 * reads the courses SWR.
 *
 * @param props - optional className (placement only).
 */
export const CourseCatalog = ({ className }: CourseCatalogProps) => {
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
    const pageNumbers = useMemo(
        () => Array.from({ length: totalPages }, (_, index) => index + 1),
        [totalPages],
    )

    /** Navigate to the home page (breadcrumb root). */
    const onNavigateHome = useCallback(
        () => router.push(pathConfig().locale(locale).build()),
        [router, locale],
    )

    // skeleton mirrors the active view so the catalog does not jump on resolve
    const gridSkeleton = (
        <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
                <CourseCardSkeleton key={index} />
            ))}
        </div>
    )
    const lineSkeleton = (
        <div className="flex w-full flex-col gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="rounded-3xl">
                    {/* plain div, NOT Card.Content — mirrors the real line CourseCard
                        (Card.Content bakes flex-col, which breaks a horizontal row) */}
                    <div className="flex items-center gap-4">
                        <Skeleton className="hidden aspect-video w-36 shrink-0 rounded-2xl sm:block" />
                        <div className="flex min-w-0 flex-1 flex-col gap-2">
                            <Skeleton className="h-5 w-1/2 rounded" />
                            <Skeleton className="h-4 w-3/4 rounded" />
                        </div>
                        {/* price row + 2-button action row — mirrors real line CourseCard
                            (primary "view/continue" + secondary flex-1 each), not 1 button */}
                        <div className="flex w-40 shrink-0 flex-col items-end gap-2">
                            <Skeleton className="h-4 w-1/2 rounded" />
                            <div className="flex w-full items-center gap-2">
                                <Skeleton className="h-9 flex-1 rounded" />
                                <Skeleton className="h-9 flex-1 rounded" />
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    )

    return (
        <div className={className}>
            <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4 px-6 py-6">
                {/* shared PageHeader block (breadcrumb + title); the result count now
                    lives on the search row next to the view toggle */}
                <PageHeader
                    breadcrumb={(
                        <Breadcrumbs>
                            <Breadcrumbs.Item onPress={onNavigateHome}>
                                {t("nav.home")}
                            </Breadcrumbs.Item>
                            <Breadcrumbs.Item>
                                {t("nav.courses")}
                            </Breadcrumbs.Item>
                        </Breadcrumbs>
                    )}
                    title={t("courses.featuredTitle")}
                />

                {/* search row: filter input (left) + result count & grid⇆line toggle (right) */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <SearchInput
                        className="w-full sm:max-w-sm"
                        value={query}
                        onValueChange={setQuery}
                        placeholder={t("courses.searchPlaceholder")}
                    />
                    <div className="flex shrink-0 items-center gap-3">
                        {count > 0 ? (
                            <Typography type="body-sm" color="muted">
                                {t("courses.count", { count })}
                            </Typography>
                        ) : null}
                        <SegmentedControl<CatalogView>
                            ariaLabel={t("courses.viewAria")}
                            value={view}
                            onChange={onChangeView}
                            items={[
                                {
                                    value: "grid",
                                    label: (
                                        <SquaresFourIcon
                                            className="size-5"
                                            aria-label={t("courses.viewGrid")}
                                            focusable="false"
                                        />
                                    ),
                                },
                                {
                                    value: "line",
                                    label: (
                                        <ListIcon
                                            className="size-5"
                                            aria-label={t("courses.viewLine")}
                                            focusable="false"
                                        />
                                    ),
                                },
                            ]}
                        />
                    </div>
                </div>

                <AsyncContent
                    isLoading={swr.isLoading && list.length === 0}
                    error={list.length === 0 ? swr.error : undefined}
                    errorContent={{
                        title: t("courses.loadError"),
                        onRetry: () => void swr.mutate(),
                        retryLabel: t("courses.retry"),
                    }}
                    isEmpty={!swr.isLoading && list.length === 0}
                    emptyContent={debouncedQuery ? {
                        title: t("courses.emptyFiltered.title", { query: debouncedQuery }),
                        description: t("courses.emptyFiltered.description"),
                        onRetry: () => {
                            setQuery("")
                            setDebouncedQuery("")
                        },
                        retryLabel: t("courses.emptyFiltered.clearFilter"),
                    } : { title: t("courses.empty") }}
                    skeleton={view === "grid" ? gridSkeleton : lineSkeleton}
                >
                    {view === "grid" ? (
                        <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                            {list.map((course) => (
                                <CatalogCourseCard key={course.id} course={course} layout="grid" />
                            ))}
                        </div>
                    ) : (
                        <div className="flex w-full flex-col gap-3">
                            {list.map((course) => (
                                <CatalogCourseCard key={course.id} course={course} layout="line" />
                            ))}
                        </div>
                    )}
                </AsyncContent>

                {/* pager: left-aligned with the cards. Always rendered (even a single
                    page) so the catalog's page-boundary UI is stable as the course
                    count grows — per the teacher's call, do not hide it at ≤ PAGE_SIZE.
                    HeroUI Pagination bakes no hover/cursor → add per the rule. */}
                <Pagination
                    aria-label={t("common.pagination.navAria")}
                    className="justify-start"
                    size="sm"
                >
                    <Pagination.Content className="flex flex-wrap justify-start gap-2">
                        <Pagination.Item>
                            <Pagination.Previous
                                aria-label={t("common.pagination.previous")}
                                isDisabled={currentPage <= 1}
                                className="cursor-pointer rounded-medium transition-colors hover:bg-default"
                                onPress={() => setPageNumber((prev) => Math.max(0, prev - 1))}
                            >
                                <Pagination.PreviousIcon />
                            </Pagination.Previous>
                        </Pagination.Item>
                        {pageNumbers.map((pageNo) => (
                            <Pagination.Item key={pageNo}>
                                <Pagination.Link
                                    isActive={pageNo === currentPage}
                                    className="cursor-pointer rounded-medium transition-colors hover:bg-default data-[active=true]:hover:bg-accent"
                                    onPress={() => setPageNumber(pageNo - 1)}
                                >
                                    {pageNo}
                                </Pagination.Link>
                            </Pagination.Item>
                        ))}
                        <Pagination.Item>
                            <Pagination.Next
                                aria-label={t("common.pagination.next")}
                                isDisabled={currentPage >= totalPages}
                                className="cursor-pointer rounded-medium transition-colors hover:bg-default"
                                onPress={() => setPageNumber((prev) => prev + 1)}
                            >
                                <Pagination.NextIcon />
                            </Pagination.Next>
                        </Pagination.Item>
                    </Pagination.Content>
                </Pagination>
            </div>
        </div>
    )
}
