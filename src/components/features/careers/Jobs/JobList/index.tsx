"use client"

import React, { useEffect, useMemo, useState } from "react"
import {
    Button,
    Link,
    Pagination,
    Typography,
    cn,
} from "@heroui/react"
import { BriefcaseIcon, TrayIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { JobListRow } from "./JobListRow"
import { JobListRowSkeleton } from "./JobListRowSkeleton"
import { pathConfig } from "@/resources/path"
import { useQueryJobPostingsSwr } from "@/hooks/swr/api/graphql/queries/useQueryJobPostingsSwr"
import { JobEmploymentType } from "@/modules/types/enums/job-employment-type"
import { WorkMode } from "@/modules/types/enums/work-mode"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { SearchInput } from "@/components/blocks/form/SearchInput"
import { FlexWrapButtonRadio } from "@/components/blocks/navigation/FlexWrapButtonRadio"
import { SurfaceListCard } from "@/components/blocks/cards/SurfaceListCard"

/** Postings shown per page before the pager kicks in. */
const JOBS_PER_PAGE = 20

/** Single-select work-mode filter value — `"all"` clears the filter. */
type WorkModeFilterValue = "all" | WorkMode
/** Single-select employment-type filter value — `"all"` clears the filter. */
type EmploymentTypeFilterValue = "all" | JobEmploymentType

/** Props for {@link JobList}. */
export type JobListProps = WithClassNames<undefined>

/**
 * Job board — `/jobs`. Search + two single-select filter rows (work mode,
 * employment type) drive a paginated ROW LIST (not a card grid — a posting has
 * too many attributes — title, company, location, work mode, salary — to read
 * comfortably in a tile; every real job board renders rows). Public — works for
 * anonymous viewers. Data states go through {@link AsyncContent}.
 *
 * Two distinct empty states (per the brainstorm's cold-start marketplace note):
 * a filtered search with zero matches offers a "clear filters" affordance, while
 * a genuinely empty board (no postings at all, yet) becomes a two-sided funnel —
 * "no listings yet — is your company hiring? post one free" — instead of a dead
 * end.
 *
 * @param props - {@link JobListProps}
 */
export const JobList = ({ className }: JobListProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()

    const [search, setSearch] = useState("")
    const [workModeFilter, setWorkModeFilter] = useState<WorkModeFilterValue>("all")
    const [employmentTypeFilter, setEmploymentTypeFilter] = useState<EmploymentTypeFilterValue>("all")
    const [page, setPage] = useState(1)

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
    const pageNumbers = Array.from({ length: totalPages }, (_unused, index) => index + 1)

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
        <div className={cn("mx-auto flex max-w-4xl flex-col gap-10 p-6", className)}>
            <PageHeader
                title={t("jobs.list.title")}
                description={t("jobs.list.description")}
                actions={(
                    <Button
                        variant="secondary"
                        onPress={() => router.push(pathConfig().locale(locale).jobs().post().build())}
                    >
                        {t("jobs.list.postCta")}
                    </Button>
                )}
            />

            <div className="flex flex-col gap-3">
                {/* search row: filter input (left) + result count (right) */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <SearchInput
                        value={search}
                        onValueChange={setSearch}
                        placeholder={t("jobs.list.searchPlaceholder")}
                    />
                    <Typography type="body-sm" color="muted" className="shrink-0">
                        {t("jobs.list.found", { count: total })}
                    </Typography>
                </div>

                {/* single-select filter rows */}
                <div className="flex flex-col gap-2">
                    <FlexWrapButtonRadio<WorkModeFilterValue>
                        ariaLabel={t("jobs.list.filters.workModeAria")}
                        value={workModeFilter}
                        onChange={setWorkModeFilter}
                        items={workModeItems}
                    />
                    <FlexWrapButtonRadio<EmploymentTypeFilterValue>
                        ariaLabel={t("jobs.list.filters.employmentTypeAria")}
                        value={employmentTypeFilter}
                        onChange={setEmploymentTypeFilter}
                        items={employmentTypeItems}
                    />
                </div>
            </div>

            <AsyncContent
                isLoading={isLoading && items.length === 0}
                skeleton={(
                    <div className="flex flex-col gap-2">
                        {Array.from({ length: 6 }).map((_unused, index) => (
                            <JobListRowSkeleton key={index} />
                        ))}
                    </div>
                )}
                isEmpty={items.length === 0}
                emptyContent={isPlatformEmpty
                    ? {
                        icon: <BriefcaseIcon aria-hidden focusable="false" className="size-8 text-muted" />,
                        title: t("jobs.list.emptyPlatform.title"),
                        description: (
                            <span className="inline-flex flex-wrap items-center justify-center gap-1">
                                {t("jobs.list.emptyPlatform.description")}
                                <Link
                                    href={pathConfig().locale(locale).jobs().post().build()}
                                    className="text-accent-soft-foreground"
                                >
                                    {t("jobs.list.emptyPlatform.cta")}
                                </Link>
                            </span>
                        ),
                    }
                    : {
                        icon: <TrayIcon aria-hidden focusable="false" className="size-8 text-muted" />,
                        title: t("jobs.list.emptyFiltered.title"),
                        onRetry: onClearFilters,
                        retryLabel: t("jobs.list.emptyFiltered.clearFilters"),
                    }}
                error={items.length === 0 ? error : undefined}
                errorContent={{
                    title: t("jobs.list.error"),
                    onRetry: () => { void mutate() },
                    retryLabel: t("common.retry"),
                }}
            >
                <div className="flex flex-col gap-3">
                    <SurfaceListCard>
                        {items.map((job) => (
                            <JobListRow key={job.id} job={job} />
                        ))}
                    </SurfaceListCard>

                    {/* pager: left-aligned with the rows, hidden on a single page */}
                    {totalPages > 1 ? (
                        <Pagination
                            aria-label={t("common.pagination.navAria")}
                            className="justify-start"
                            size="sm"
                        >
                            <Pagination.Content className="flex flex-wrap justify-start gap-2">
                                <Pagination.Item>
                                    <Pagination.Previous
                                        aria-label={t("common.pagination.previous")}
                                        isDisabled={page <= 1}
                                        className="cursor-pointer rounded-medium transition-colors hover:bg-default"
                                        onPress={() => setPage((current) => Math.max(1, current - 1))}
                                    >
                                        <Pagination.PreviousIcon />
                                    </Pagination.Previous>
                                </Pagination.Item>
                                {pageNumbers.map((pageNumber) => (
                                    <Pagination.Item key={pageNumber}>
                                        <Pagination.Link
                                            isActive={pageNumber === page}
                                            className="cursor-pointer rounded-medium transition-colors hover:bg-default data-[active=true]:hover:bg-accent"
                                            onPress={() => setPage(pageNumber)}
                                        >
                                            {pageNumber}
                                        </Pagination.Link>
                                    </Pagination.Item>
                                ))}
                                <Pagination.Item>
                                    <Pagination.Next
                                        aria-label={t("common.pagination.next")}
                                        isDisabled={page >= totalPages}
                                        className="cursor-pointer rounded-medium transition-colors hover:bg-default"
                                        onPress={() => setPage((current) => Math.min(totalPages, current + 1))}
                                    >
                                        <Pagination.NextIcon />
                                    </Pagination.Next>
                                </Pagination.Item>
                            </Pagination.Content>
                        </Pagination>
                    ) : null}
                </div>
            </AsyncContent>
        </div>
    )
}
