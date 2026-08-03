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
    _HeadhuntingsPage,
    type ConsultantCardConsultant,
    type ConsultantDirectoryHeaderCrumb,
} from "./component"
import { pathConfig } from "@/resources/path"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { setHeadhunterId } from "@/redux/slices/headhunter"
import { useQueryHeadhunterCompaniesSwr } from "@/hooks/swr/api/graphql/queries/useQueryHeadhunterCompaniesSwr"
import { useQueryHeadhuntersSwr } from "@/hooks/swr/api/graphql/queries/useQueryHeadhuntersSwr"
import { useQueryHeadhuntingCompanySuggestionsSwr } from "@/hooks/swr/api/graphql/queries/useQueryHeadhuntingCompanySuggestionsSwr"

/** Debounce window (ms) before a typed company query hits the suggestions backend. */
const SEARCH_DEBOUNCE_MS = 350

/**
 * `HeadhuntingsPage` — the CONNECTED half of the SRC TWIN. Mirrors the data
 * wiring already proven in `src/components/features/careers/Headhunting/
 * Headhuntings` onto the storybook-driven block tree in `./component`
 * instead of that v1's hand-built layout — same route (`/learn/headhuntings`,
 * NOT swapped here), same redux/SWR sources.
 *
 * The consultant list has no server-side search or pagination — the whole
 * roster for the enrolled companies is loaded into `headhunter.entities` by
 * {@link useQueryHeadhuntersSwr}. The company search field is a deep-link only:
 * a debounced, ES-backed company typeahead
 * ({@link useQueryHeadhuntingCompanySuggestionsSwr}) whose selection navigates
 * to the chosen recruiting company's page, and never touches the roster.
 * Opening a consultant's card stores their id on the `headhunter` slice the
 * same way `useQueryHeadhuntersSwr` already resolves `headhunter.entity` from
 * it.
 */
export const HeadhuntingsPage = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const dispatch = useAppDispatch()
    const course = useAppSelector((state) => state.course.entity)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    const consultants = useAppSelector((state) => state.headhunter.entities)
    const consultantCount = useAppSelector((state) => state.headhunter.count)

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
    const { data: suggestionItems, isLoading: isLoadingSuggestions } = useQueryHeadhuntingCompanySuggestionsSwr(debouncedQuery)
    const companySuggestions = suggestionItems ?? []

    /** Deep-link to the chosen company's page; never changes the roster. */
    const onSelectCompany = useCallback(
        (companyId: string) => {
            if (!courseDisplayId) {
                return
            }
            setQuery("")
            router.push(
                pathConfig()
                    .locale(locale)
                    .course(courseDisplayId)
                    .headhuntingCompanies(companyId)
                    .build(),
            )
        },
        [
            courseDisplayId,
            locale,
            router,
        ],
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

    /** Breadcrumb trail from home → courses → course → headhuntings. */
    const breadcrumbItems = useMemo((): Array<ConsultantDirectoryHeaderCrumb> => [
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
            key: "headhuntings",
            label: t("headhuntings.title"),
        },
    ], [
        course?.title,
        onPressCourse,
        onPressCourses,
        onPressHome,
        t,
    ])

    /** Roster mapped into the block's row shape (the entity's nullable fields become `undefined`). */
    const consultantItems: Array<ConsultantCardConsultant> | undefined = useMemo(
        () => consultants?.map((consultant) => ({
            id: consultant.id,
            fullName: consultant.fullName,
            jobTitle: consultant.jobTitle ?? undefined,
            companyTitle: consultant.company?.title ?? undefined,
            description: consultant.description ?? undefined,
            avatarUrl: consultant.avatarUrl ?? undefined,
        })),
        [consultants],
    )

    /** Select a consultant: store their id, the same field `useQueryHeadhuntersSwr` resolves `headhunter.entity` from. */
    const onOpenConsultant = useCallback(
        (id: string) => dispatch(setHeadhunterId(id)),
        [dispatch],
    )

    /** First load: the roster has not resolved for this session yet. */
    const isFirstLoad = !consultants

    return (
        <_HeadhuntingsPage
            breadcrumbItems={breadcrumbItems}
            title={t("headhuntings.title")}
            description={t("headhuntings.description")}
            companyQuery={query}
            onCompanyQueryChange={setQuery}
            companySuggestions={companySuggestions}
            isLoadingCompanySuggestions={isLoadingSuggestions}
            onSelectCompany={onSelectCompany}
            consultants={consultantItems}
            consultantCount={consultantCount}
            isLoadingConsultants={isFirstLoad}
            onOpenConsultant={onOpenConsultant}
            consultantsEmptyTitle={t("headhuntings.empty")}
            consultantsAriaLabel={t("headhuntings.title")}
            isSkeleton={isFirstLoad}
        />
    )
}
