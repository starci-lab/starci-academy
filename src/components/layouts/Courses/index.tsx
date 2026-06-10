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
    useAppSelector,
} from "@/redux"
import {
    pathConfig,
} from "@/resources"
import {
    SearchInput,
    Spacer,
} from "@/components/reuseable"
import type {
    SearchInputSuggestion,
} from "@/components/reuseable"
import {
    useQueryCourseSuggestionsSwr,
} from "@/hooks"
import {
    CourseCard,
} from "./CourseCard"

/** Debounce window (ms) before a typed search hits the backend. */
const SEARCH_DEBOUNCE_MS = 350

/**
 * Featured courses grid container.
 *
 * Pulls the course list from redux and renders a responsive grid of cards. A
 * Google-style autocomplete sits above the grid: it is fed by the ES-backed
 * `courseSuggestions` query (debounced) and deep-links to the chosen course.
 * `"use client"` for the redux selector, routing, and the debounce effect.
 */
export const Courses = () => {
    const courses = useAppSelector((state) => state.course.entities)
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()

    /** Immediate input value (drives the field). */
    const [query, setQuery] = useState("")
    /** Debounced query that actually hits the backend. */
    const [debouncedQuery, setDebouncedQuery] = useState("")

    // debounce the search input before it reaches the suggestions query
    useEffect(() => {
        const handle = setTimeout(() => {
            setDebouncedQuery(query)
        }, SEARCH_DEBOUNCE_MS)
        return () => clearTimeout(handle)
    }, [query])

    // ES Completion Suggester (typeahead): clean { id, label } items from the BE,
    // no client-side filtering or label munging.
    const { data: suggestionItems } = useQueryCourseSuggestionsSwr(debouncedQuery)
    const suggestions = suggestionItems ?? []

    /** Course list to render (empty until the courses are loaded). */
    const list = useMemo(
        () => courses ?? [],
        [courses],
    )

    /**
     * Deep-link to the chosen course. The suggestion id is the course id, while
     * the course route is keyed by `displayId`, so resolve it from the loaded
     * list and fall back to the id when the course is not in the redux cache.
     */
    const onSelectSuggestion = useCallback(
        (suggestion: SearchInputSuggestion) => {
            const matched = courses?.find((course) => course.id === suggestion.id)
            const displayId = matched?.displayId ?? suggestion.id
            router.push(pathConfig().locale(locale).course(displayId).build())
        },
        [courses, locale, router],
    )

    return (
        <div className="flex flex-col items-center">
            <div className="text-2xl font-bold flex gap-1 text-center">{t("courses.featuredTitle")}</div>
            <Spacer y={4} />
            {/* search box (debounced) with ES-backed autocomplete dropdown */}
            <SearchInput
                value={query}
                onValueChange={setQuery}
                placeholder={t("courses.searchPlaceholder")}
                suggestions={suggestions}
                onSelectSuggestion={onSelectSuggestion}
            />
            <Spacer y={4} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {list.map((course) => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>
        </div>
    )
}
