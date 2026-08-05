"use client"

import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import debounce from "lodash/debounce"
import { _GlobalSearchModal, type GlobalSearchKind, type GlobalSearchModalPopularCourse, type GlobalSearchModalSection, type GlobalSearchResultRow } from "./component"
import { useSearchOverlayState } from "@/hooks/zustand/overlay/hooks"
import { setSearchQuery } from "@/redux/slices/search"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { useQueryRecommendedCoursesSwr } from "@/hooks/swr/api/graphql/queries/useQueryRecommendedCoursesSwr"
import { pathConfig } from "@/resources/path"
import type { AutocompleteGlobalSearchItem } from "@/modules/api/graphql/queries/types/autocomplete-global-search"

/** How long typing pauses before the committed query (and the socket search it drives) updates. */
const SEARCH_DEBOUNCE_MS = 200

/** How many popular courses to offer as a fallback (idle palette / no-match query). */
const POPULAR_COURSE_COUNT = 4

/** Every bucket this modal groups results into, in display order — kind + its i18n key. */
const SEARCH_BUCKETS: ReadonlyArray<{ kind: GlobalSearchKind; labelKey: string }> = [
    { kind: "course", labelKey: "search.suggestions.courses" },
    { kind: "module", labelKey: "search.suggestions.modules" },
    { kind: "content", labelKey: "search.suggestions.contents" },
    { kind: "challenge", labelKey: "search.suggestions.challenges" },
    { kind: "flashcardDeck", labelKey: "search.suggestions.flashcards" },
    { kind: "milestone", labelKey: "search.suggestions.milestones" },
    { kind: "milestoneTask", labelKey: "search.suggestions.milestoneTasks" },
    { kind: "foundation", labelKey: "search.suggestions.foundations" },
]

/**
 * Resolves one raw API hit into the already-decided row the presentational
 * half renders — which badges apply, and the raw `path` it navigates on.
 */
const toResultRow = (kind: GlobalSearchKind, item: AutocompleteGlobalSearchItem): GlobalSearchResultRow => ({
    id: item.id,
    kind,
    title: item.title ?? item.texts?.[0] ?? item.displayId ?? "",
    textLines: item.texts ?? [],
    path: item.path,
    // course state badge: enrolled → "Enrolled"; not-enrolled+free → "Free"; paid → no chip.
    showEnrolledChip: kind === "course" && item.isEnrolled === true,
    showFreeChip:
        (kind === "course" && item.isEnrolled !== true && item.isFree === true) ||
        (kind === "content" && item.isPremium === false),
    showPremiumLock: kind === "content" && item.isPremium === true,
    showViewCourseHint: kind === "course",
})

/**
 * Global search command palette opened by Navbar (Ctrl/Cmd+K) — the CONNECTED
 * half: owns the overlay open-state, the debounced query → redux sync, the
 * socket-fed result buckets, the recommended-courses fallback fetch, and
 * every translated string, handing everything already resolved to the
 * presentational {@link _GlobalSearchModal}. See `tiers/split.md`.
 */
export const GlobalSearchModal = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const { isOpen, setOpen } = useSearchOverlayState()
    const dispatch = useAppDispatch()

    // The search box is just text synced (debounced) to redux `search.query` — no form lib needed.
    // Initialized from redux; every result bucket below reads from the COMMITTED (post-debounce) value.
    const [query, setQuery] = useState(useAppSelector((state) => state.search.query))

    useEffect(() => {
        if (!isOpen) return
        const emitSearch = debounce((next: string) => {
            dispatch(setSearchQuery(next))
        }, SEARCH_DEBOUNCE_MS)
        emitSearch(query.trim())
        return () => emitSearch.cancel()
    }, [dispatch, query, isOpen])

    const committedQuery = useAppSelector((state) => state.search.query).trim()

    const courses = useAppSelector((state) => state.socketIo.globalSearchResults?.data?.courses)
    const modules = useAppSelector((state) => state.socketIo.globalSearchResults?.data?.modules)
    const challenges = useAppSelector((state) => state.socketIo.globalSearchResults?.data?.challenges)
    const contents = useAppSelector((state) => state.socketIo.globalSearchResults?.data?.contents)
    const flashcardDecks = useAppSelector((state) => state.socketIo.globalSearchResults?.data?.flashcardDecks)
    const milestones = useAppSelector((state) => state.socketIo.globalSearchResults?.data?.milestones)
    const milestoneTasks = useAppSelector((state) => state.socketIo.globalSearchResults?.data?.milestoneTasks)
    const foundations = useAppSelector((state) => state.socketIo.globalSearchResults?.data?.foundations)

    // One section per bucket, in display order; only non-empty buckets are kept.
    const sections = useMemo<Array<GlobalSearchModalSection>>(
        () => {
            const bucketItems: Record<GlobalSearchKind, Array<AutocompleteGlobalSearchItem> | undefined> = {
                course: courses,
                module: modules,
                content: contents,
                challenge: challenges,
                flashcardDeck: flashcardDecks,
                milestone: milestones,
                milestoneTask: milestoneTasks,
                foundation: foundations,
            }
            return SEARCH_BUCKETS
                .map(({ kind, labelKey }) => {
                    const items = bucketItems[kind] ?? []
                    return {
                        kind,
                        label: t(labelKey),
                        items: items.map((item) => toResultRow(kind, item)),
                    }
                })
                .filter((section) => section.items.length > 0)
        },
        [courses, modules, contents, challenges, flashcardDecks, milestones, milestoneTasks, foundations, t],
    )

    const { data: recommendedData } = useQueryRecommendedCoursesSwr()
    const popularCourses = useMemo<Array<GlobalSearchModalPopularCourse>>(
        () => (recommendedData?.items ?? []).slice(0, POPULAR_COURSE_COUNT).map((course) => ({
            id: course.displayId,
            displayId: course.displayId,
            title: course.title,
            discountedPriceVnd: course.discountedPriceVnd,
        })),
        [recommendedData],
    )

    // Navigate to the canonical server-built route for the pressed hit, then close.
    const onSelectResult = useCallback(
        (row: GlobalSearchResultRow) => {
            // ignore presses with no resolvable route (cache miss / unroutable kind)
            if (!row.path) return
            // server path is locale-agnostic → prepend the active locale
            router.push(`/${locale}${row.path}`)
            setOpen(false)
        },
        [locale, router, setOpen],
    )

    const onSelectPopularCourse = useCallback(
        (course: GlobalSearchModalPopularCourse) => {
            router.push(pathConfig().locale(locale).course(course.displayId).build())
            setOpen(false)
        },
        [locale, router, setOpen],
    )

    return (
        <_GlobalSearchModal
            isOpen={isOpen}
            onOpenChange={setOpen}
            query={query}
            onQueryChange={setQuery}
            sections={sections}
            hasQuery={committedQuery.length > 0}
            popularCourses={popularCourses}
            labels={{
                placeholder: t("search.placeholder"),
                hintMove: t("search.hint.move"),
                hintOpen: t("search.hint.open"),
                hintClose: t("search.hint.close"),
                noResults: t("search.noResults"),
                idleHint: t("search.idleHint"),
                popular: t("search.popular"),
                enrolled: t("search.result.enrolled"),
                free: t("search.result.free"),
                viewCourse: t("search.result.viewCourse"),
                premiumLock: t("learning.outline.premium"),
            }}
            onSelectResult={onSelectResult}
            onSelectPopularCourse={onSelectPopularCourse}
        />
    )
}
