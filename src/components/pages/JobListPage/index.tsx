"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { pathConfig } from "@/resources/path"
import { useQueryJobPostingsSwr } from "@/hooks/swr/api/graphql/queries/useQueryJobPostingsSwr"
import { JobEmploymentType } from "@/modules/types/enums/job-employment-type"
import { WorkMode } from "@/modules/types/enums/work-mode"
import {
    _JobListPage,
    type EmploymentTypeFilterValue,
    type WorkModeFilterValue,
} from "./component"

/** Postings shown per page before the pager kicks in. */
const JOBS_PER_PAGE = 20

/**
 * The job board (`/jobs`) — the CONNECTED half: it owns the search/filter/pagination state,
 * fetches the matching postings, resolves every label, and hands them to the presentational
 * {@link _JobListPage}. See `tiers/split.md`. Public — works for anonymous viewers; called with no
 * props from `app/[locale]/jobs/page.tsx`.
 *
 */
export const JobListPage = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()

    const [search, setSearch] = useState("")
    const [workModeFilter, setWorkModeFilter] = useState<WorkModeFilterValue>("all")
    const [employmentTypeFilter, setEmploymentTypeFilter] = useState<EmploymentTypeFilterValue>("all")
    const [page, setPage] = useState(1)
    const activeFacetCount = (workModeFilter !== "all" ? 1 : 0) + (employmentTypeFilter !== "all" ? 1 : 0)
    const onClearFacets = () => {
        setWorkModeFilter("all")
        setEmploymentTypeFilter("all")
    }

    // any filter/search resets the page back to 1 so a narrowed result set never
    // opens on an out-of-range page
    useEffect(() => {
        setPage(1)
    }, [search, workModeFilter, employmentTypeFilter])

    const { data, isLoading, error, mutate } = useQueryJobPostingsSwr({
        limit: JOBS_PER_PAGE,
        offset: (page - 1) * JOBS_PER_PAGE,
        workMode: workModeFilter === "all" ? undefined : workModeFilter,
        employmentType: employmentTypeFilter === "all" ? undefined : employmentTypeFilter,
        search,
    })

    const items = data?.items ?? []
    const total = data?.total ?? 0
    const totalPages = Math.max(1, Math.ceil(total / JOBS_PER_PAGE))

    const hasActiveFilter = Boolean(
        search.trim() || workModeFilter !== "all" || employmentTypeFilter !== "all",
    )
    // "truly empty" = zero postings platform-wide AND the viewer has not filtered
    // anything out — distinguishes "nothing here" from "nothing matched"
    const isPlatformEmpty = total === 0 && !hasActiveFilter

    const onClearFilters = () => {
        setSearch("")
        setWorkModeFilter("all")
        setEmploymentTypeFilter("all")
    }

    const onPostJob = () => {
        router.push(pathConfig().locale(locale).jobs().post().build())
    }

    const workModeItems = useMemo(
        () => [
            { value: "all" as const, content: t("jobs.list.filters.allWorkModes") },
            { value: WorkMode.Remote, content: t("publicProfile.workMode.remote") },
            { value: WorkMode.Hybrid, content: t("publicProfile.workMode.hybrid") },
            { value: WorkMode.Onsite, content: t("publicProfile.workMode.onsite") },
        ],
        [t],
    )

    const employmentTypeItems = useMemo(
        () => [
            { value: "all" as const, content: t("jobs.list.filters.allEmploymentTypes") },
            { value: JobEmploymentType.Fulltime, content: t("jobs.employmentType.fulltime") },
            { value: JobEmploymentType.Parttime, content: t("jobs.employmentType.parttime") },
            { value: JobEmploymentType.Internship, content: t("jobs.employmentType.internship") },
            { value: JobEmploymentType.Contract, content: t("jobs.employmentType.contract") },
        ],
        [t],
    )

    return (
        <_JobListPage
            // first load, nothing in hand → shimmer; settled (data OR error) stops it (loading-and-skeleton.md)
            isSkeleton={isLoading && items.length === 0}
            isEmpty={items.length === 0}
            // error only surfaces once there's nothing in hand to keep showing (mirrors the pre-split gate)
            error={items.length === 0 ? error : undefined}
            onRetry={() => { void mutate() }}
            items={items}
            isPlatformEmpty={isPlatformEmpty}
            onClearFilters={onClearFilters}
            onPostJob={onPostJob}
            search={search}
            onSearchChange={setSearch}
            workModeFilter={workModeFilter}
            onWorkModeFilterChange={setWorkModeFilter}
            workModeItems={workModeItems}
            employmentTypeFilter={employmentTypeFilter}
            onEmploymentTypeFilterChange={setEmploymentTypeFilter}
            employmentTypeItems={employmentTypeItems}
            activeFacetCount={activeFacetCount}
            onClearFacets={onClearFacets}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            labels={{
                pageTitle: t("jobs.list.title"),
                pageDescription: t("jobs.list.description"),
                postCta: t("jobs.list.postCta"),
                searchPlaceholder: t("jobs.list.searchPlaceholder"),
                filterButtonAria: t("jobs.list.filters.filterButton"),
                workModeHeading: t("jobs.list.filters.workModeHeading"),
                workModeAria: t("jobs.list.filters.workModeAria"),
                employmentTypeHeading: t("jobs.list.filters.employmentTypeHeading"),
                employmentTypeAria: t("jobs.list.filters.employmentTypeAria"),
                clearFacets: t("jobs.list.filters.clearFilters"),
                found: t("jobs.list.found", { count: total }),
                emptyPlatformTitle: t("jobs.list.emptyPlatform.title"),
                emptyPlatformDescription: t("jobs.list.emptyPlatform.description"),
                emptyPlatformCta: t("jobs.list.emptyPlatform.cta"),
                emptyFilteredTitle: t("jobs.list.emptyFiltered.title"),
                emptyFilteredClearFilters: t("jobs.list.emptyFiltered.clearFilters"),
                errorTitle: t("jobs.list.error"),
                retry: t("common.retry"),
            }}
        />
    )
}
