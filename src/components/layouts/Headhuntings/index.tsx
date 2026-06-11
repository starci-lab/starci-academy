"use client"

import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react"
import { Skeleton } from "@heroui/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { pathConfig } from "@/resources"
import { useAppSelector } from "@/redux"
import {
    useQueryHeadhunterCompaniesSwr,
    useQueryHeadhuntersSwr,
    useQueryHeadhuntingCompanySuggestionsSwr,
} from "@/hooks"
import { SearchInput } from "@/components/reuseable"
import { ConsultantGrid } from "./ConsultantGrid"
import { HeadhuntingsBreadcrumbs } from "./HeadhuntingsBreadcrumbs"

/** Debounce window (ms) before a typed search hits the suggestions backend. */
const SEARCH_DEBOUNCE_MS = 350

/**
 * Learn headhuntings page: grid of consultant cards; card opens profile modal.
 * Container — owns data + breadcrumb orchestration; renders presentational children.
 *
 * The consultant list is loaded in full into Redux by {@link useQueryHeadhuntersSwr}
 * (no server-side search / pagination on that query), so the search field here is an
 * autocomplete-only affordance: a debounced, ES-backed company typeahead
 * ({@link useQueryHeadhuntingCompanySuggestionsSwr}) whose selection deep-links to
 * the chosen recruitment company's page.
 */
export const HeadhuntingsLearnLayout = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const consultants = useAppSelector((state) => state.headhunter.entities)
    const count = useAppSelector((state) => state.headhunter.count)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)

    useQueryHeadhunterCompaniesSwr()
    useQueryHeadhuntersSwr()

    /** Immediate input value (drives the field). */
    const [query, setQuery] = useState("")
    /** Debounced query that actually hits the suggestions backend. */
    const [debouncedQuery, setDebouncedQuery] = useState("")

    // debounce the search input before it drives the suggestions query
    useEffect(() => {
        const handle = setTimeout(() => {
            setDebouncedQuery(query)
        }, SEARCH_DEBOUNCE_MS)
        return () => clearTimeout(handle)
    }, [query])

    // ES Completion Suggester (typeahead): clean { id, label } company items from
    // the BE, no client-side filtering or label munging.
    const { data: suggestionItems } = useQueryHeadhuntingCompanySuggestionsSwr(debouncedQuery)
    const suggestions = suggestionItems ?? []

    const sortedConsultants = useMemo(() => {
        if (!consultants?.length) {
            return []
        }
        return [...consultants].sort((a, b) => a.sortIndex - b.sortIndex)
    }, [consultants])

    /** Deep-link to the chosen company's page (the suggestion id is the company id). */
    const onSelectSuggestion = useCallback(
        (suggestion: { id: string; label: string }) => {
            if (!courseDisplayId) {
                return
            }
            setQuery("")
            router.push(
                pathConfig()
                    .locale(locale)
                    .course(courseDisplayId)
                    .headhuntingCompanies(suggestion.id)
                    .build(),
            )
        },
        [
            courseDisplayId,
            locale,
            router,
        ],
    )

    return (
        <div className="p-3">
            <HeadhuntingsBreadcrumbs />
            <div className="h-6" />
            <div>
                <div className="text-2xl font-bold">{t("headhuntings.title")}</div>
                <p className="text-muted mt-2 text-sm">{t("headhuntings.description")}</p>
            </div>
            <div className="h-6" />
            {/* company search box (debounced) with ES-backed autocomplete dropdown */}
            <SearchInput
                value={query}
                onValueChange={setQuery}
                placeholder={t("headhuntings.companySearchPlaceholder")}
                suggestions={suggestions}
                onSelectSuggestion={onSelectSuggestion}
            />
            <div className="h-6" />
            {!consultants ? (
                <Skeleton className="h-[14px] w-[150px] my-[3px]" />
            ) : (
                <p className="text-muted text-sm">
                    {t("headhuntings.count", { count: count ?? 0 })}
                </p>
            )}
            <div className="h-6" />
            <ConsultantGrid
                consultants={consultants}
                sortedConsultants={sortedConsultants}
            />
        </div>
    )
}
