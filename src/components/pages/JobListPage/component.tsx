import React, { useState } from "react"
import type { ReactNode } from "react"
import { BriefcaseIcon, FunnelIcon, TrayIcon } from "@phosphor-icons/react"
import type { ComponentTypeWithSkeleton } from "@/components/composites/_slot"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import { Badge } from "@/components/atoms/display/Badge"
import { Button } from "@/components/atoms/buttons/Button"
import { Popover } from "@/components/atoms/overlay/Popover"
import { Typography } from "@/components/atoms/text/Typography"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { Cluster } from "@/components/frames/Cluster"
import { Container } from "@/components/frames/Container"
import { StackH, StackV } from "@/components/frames/Stack"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { SearchInput } from "@/components/blocks/form/SearchInput"
import { FlexWrapButtonRadio, type FlexWrapButtonRadioItem } from "@/components/blocks/navigation/FlexWrapButtonRadio"
import { Pagination } from "@/components/blocks/navigation/Pagination"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import type { JobPostingEntity } from "@/modules/types/entities/job-posting"
import { JobEmploymentType } from "@/modules/types/enums/job-employment-type"
import { WorkMode } from "@/modules/types/enums/work-mode"
import { JobListRow } from "./JobListRow"

/** Single-select work-mode filter value — `"all"` clears the filter. */
export type WorkModeFilterValue = "all" | WorkMode
/** Single-select employment-type filter value — `"all"` clears the filter. */
export type EmploymentTypeFilterValue = "all" | JobEmploymentType

/** How many placeholder rows the co-located skeleton shows while the first page loads. */
const SKELETON_ROW_COUNT = 6

/** All display text, already localized by the connected {@link import("./index").JobListPage}; a story passes i18n keys. */
export interface JobListLabels {
    pageTitle: string
    pageDescription: string
    postCta: string
    searchPlaceholder: string
    filterButtonAria: string
    workModeHeading: string
    workModeAria: string
    employmentTypeHeading: string
    employmentTypeAria: string
    clearFacets: string
    /** Already interpolated with the total count (e.g. "3 postings"). */
    found: string
    emptyPlatformTitle: string
    emptyPlatformDescription: string
    emptyPlatformCta: string
    emptyFilteredTitle: string
    emptyFilteredClearFilters: string
    errorTitle: string
    retry: string
}

/** Props for {@link _JobListPage} — presentational; all data resolved, no fetch/store/i18n. */
export interface JobListPageProps {
    /** First load, nothing in hand → the row list shimmers in place (co-located). Owned by the connected file. */
    isSkeleton?: boolean
    /** Settled with zero matching postings → the empty branch. */
    isEmpty?: boolean
    /** Truthy → the error message (beats loading + empty). The connected file passes its settled fetch error. */
    error?: unknown
    /** Retries the failed fetch. */
    onRetry?: () => void
    /** The current page of postings, already resolved. */
    items?: Array<JobPostingEntity>
    /** `true` → the board itself has zero postings (no filter applied); `false` → a filtered search matched nothing. */
    isPlatformEmpty?: boolean
    /** Clears search + every facet — the filtered-empty branch's retry action. */
    onClearFilters?: () => void
    /** Opens the "post a job" flow — the header CTA AND the platform-empty branch's action. */
    onPostJob: () => void

    /** Current search query (controlled). */
    search: string
    /** Fired with the new query on every keystroke. */
    onSearchChange: (value: string) => void
    /** Currently selected work-mode facet. */
    workModeFilter: WorkModeFilterValue
    onWorkModeFilterChange: (value: WorkModeFilterValue) => void
    /** Work-mode facet options, already localized. */
    workModeItems: Array<FlexWrapButtonRadioItem<WorkModeFilterValue>>
    /** Currently selected employment-type facet. */
    employmentTypeFilter: EmploymentTypeFilterValue
    onEmploymentTypeFilterChange: (value: EmploymentTypeFilterValue) => void
    /** Employment-type facet options, already localized. */
    employmentTypeItems: Array<FlexWrapButtonRadioItem<EmploymentTypeFilterValue>>
    /** Facets currently applied (0–2) — badges the filter trigger. */
    activeFacetCount: number
    /** Resets both facet rows without touching the search box. */
    onClearFacets: () => void

    /** 1-based current page. */
    page: number
    totalPages: number
    onPageChange: (page: number) => void

    labels: JobListLabels
}

/**
 * Loading placeholder for one job-posting row — mirrors {@link JobListRow}'s
 * IconTile + title/company/meta + salary/time shape so the list does not
 * collapse or jump when data resolves. Co-located right here (not a separate
 * hand-kept file) since `JobListRow` takes no `isSkeleton` prop of its own to
 * thread through (`loading-and-skeleton.md`).
 */
const JobListRowSkeleton = () => (
    <SurfaceListCardItem>
        <StackH
            gap={3}
            align="center"
            items={[
                () => <Skeleton className="size-12 shrink-0 rounded-xl" />,
                () => (
                    <StackV
                        gap={1}
                        classNames={["min-w-0", "flex-1"]}
                        items={[
                            () => <Skeleton.Typography type="body-sm" width="1/2" />,
                            () => <Skeleton.Typography type="body-xs" width="1/3" />,
                            () => (
                                <Cluster
                                    gap={2}
                                    items={[
                                        () => <Skeleton.Typography type="body-xs" width="1/4" />,
                                        () => <Skeleton.Chip />,
                                    ]}
                                />
                            ),
                        ]}
                    />
                ),
                () => (
                    <StackV
                        gap={1}
                        align="end"
                        classNames={["shrink-0"]}
                        items={[
                            () => <Skeleton.Typography type="body-sm" width="full" className="w-16" />,
                            () => <Skeleton.Typography type="body-xs" width="full" className="w-12" />,
                        ]}
                    />
                ),
            ]}
        />
    </SurfaceListCardItem>
)

/**
 * The job board (`/jobs`) — the presentational half of {@link import("./index").JobListPage}. Search +
 * two single-select filter rows (work mode, employment type) behind a funnel popover drive a
 * paginated ROW LIST (not a card grid — a posting has too many attributes — title, company,
 * location, work mode, salary — to read comfortably in a tile; every real job board renders rows).
 * Public — works for anonymous viewers.
 *
 * The header + search/filter toolbar always render; only the row-list region below switches
 * error → (settled) empty → content, with `isSkeleton` threaded to every leaf that can mirror
 * itself (`loading-and-skeleton.md`). `JobListRow` (a sibling component owned outside this pass)
 * takes no `isSkeleton` prop, so the loading branch mirrors it minimally with the co-located
 * `JobListRowSkeleton` at the SAME position and the SAME row count — not a parallel tree.
 *
 * Two distinct empty states (per the brainstorm's cold-start marketplace note): a filtered search
 * with zero matches offers a "clear filters" affordance, while a genuinely empty board (no postings
 * at all, yet) becomes a two-sided funnel — "no listings yet — is your company hiring? post one
 * free" — instead of a dead end.
 *
 * @param props - {@link JobListPageProps}
 */
export const _JobListPage = ({
    isSkeleton = false,
    isEmpty = false,
    error,
    onRetry,
    items = [],
    isPlatformEmpty = false,
    onClearFilters,
    onPostJob,
    search,
    onSearchChange,
    workModeFilter,
    onWorkModeFilterChange,
    workModeItems,
    employmentTypeFilter,
    onEmploymentTypeFilterChange,
    employmentTypeItems,
    activeFacetCount,
    onClearFacets,
    page,
    totalPages,
    onPageChange,
    labels,
}: JobListPageProps) => {
    // funnel popover open state — purely visual, needs no server/store/session (split.md's own test)
    const [filterOpen, setFilterOpen] = useState(false)

    const emptyPlatformAction: ComponentTypeWithSkeleton = () => (
        <Button variant="tertiary" size="sm" label={labels.emptyPlatformCta} onPress={onPostJob} />
    )

    const filterPopoverContent = (
        <StackV gap={3} items={[
            () => (
                <StackV gap={2} items={[
                    () => <Typography size="xs" color="muted" text={labels.workModeHeading} />,
                    () => (
                        <FlexWrapButtonRadio<WorkModeFilterValue>
                            ariaLabel={labels.workModeAria}
                            value={workModeFilter}
                            onChange={onWorkModeFilterChange}
                            items={workModeItems}
                        />
                    ),
                ]} />
            ),
            () => (
                <StackV gap={2} items={[
                    () => <Typography size="xs" color="muted" text={labels.employmentTypeHeading} />,
                    () => (
                        <FlexWrapButtonRadio<EmploymentTypeFilterValue>
                            ariaLabel={labels.employmentTypeAria}
                            value={employmentTypeFilter}
                            onChange={onEmploymentTypeFilterChange}
                            items={employmentTypeItems}
                        />
                    ),
                ]} />
            ),
            ...(activeFacetCount > 0 ? [() => (
                <Button variant="danger-soft" size="sm" label={labels.clearFacets} onPress={onClearFacets} classNames={["self-start"]} />
            )] : []),
        ]} />
    )

    // toolbar: search + funnel popover on the left, the resolved count on the right —
    // always rendered, unaffected by the row-list region's own error/empty/content switch
    const toolbar = (
        <StackH gap={3} justify="between" align="center" at="sm" items={[
            () => (
                <StackH gap={3} align="center" classNames={["min-w-0", "flex-1"]} items={[
                    () => (
                        <SearchInput
                            className="min-w-0 flex-1"
                            value={search}
                            onValueChange={onSearchChange}
                            placeholder={labels.searchPlaceholder}
                        />
                    ),
                    () => (
                        <Badge count={activeFacetCount} color="accent" size="sm" placement="top-left">
                            <Popover
                                triggerLabel={<span className="sr-only">{labels.filterButtonAria}</span>}
                                triggerIcon={FunnelIcon}
                                triggerVariant="ghost"
                                isOpen={filterOpen}
                                onOpenChange={setFilterOpen}
                                classNames={["shrink-0"]}
                                content={filterPopoverContent}
                            />
                        </Badge>
                    ),
                ]} />
            ),
            () => <Typography size="sm" color="muted" classNames={["shrink-0"]} text={labels.found} />,
        ]} />
    )

    // row-list region — the ONLY part of this block that switches state; the header +
    // toolbar above always render regardless of error/loading/empty/content.
    let listRegion: ReactNode
    if (error) {
        listRegion = <AsyncContentError title={labels.errorTitle} onRetry={onRetry} retryLabel={labels.retry} />
    } else if (!isSkeleton && isEmpty) {
        listRegion = isPlatformEmpty ? (
            <AsyncContentEmpty
                icon={BriefcaseIcon}
                title={labels.emptyPlatformTitle}
                description={labels.emptyPlatformDescription}
                action={emptyPlatformAction}
            />
        ) : (
            <AsyncContentEmpty
                icon={TrayIcon}
                title={labels.emptyFilteredTitle}
                onRetry={onClearFilters}
                retryLabel={labels.emptyFilteredClearFilters}
            />
        )
    } else {
        // rows — while shimmering, the SAME position holds SKELETON_ROW_COUNT placeholder
        // rows (JobListRow takes no isSkeleton prop, so the mirror is JobListRowSkeleton,
        // co-located here rather than a separate branch — see missingSkeletonSupport).
        listRegion = (
            <StackV gap={3} items={[
                () => (
                    <SurfaceListCard>
                        {isSkeleton
                            ? Array.from({ length: SKELETON_ROW_COUNT }, (_unused, index) => (
                                <JobListRowSkeleton key={index} />
                            ))
                            : items.map((job) => <JobListRow key={job.id} job={job} />)}
                    </SurfaceListCard>
                ),
                // pager: left-aligned with the rows, hidden on a single page
                ...(totalPages > 1 ? [() => (
                    <Pagination
                        className="mt-0 justify-start"
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                    />
                )] : []),
            ]} />
        )
    }

    const jobListBody = (
        <StackV gap={8} items={[
            () => (
                <PageHeader
                    title={labels.pageTitle}
                    description={labels.pageDescription}
                    actions={<Button variant="secondary" label={labels.postCta} onPress={onPostJob} />}
                />
            ),
            () => toolbar,
            () => listRegion,
        ]} />
    )

    return (
        <Container
            size="md"
            padding={6}
            body={() => jobListBody}
            identity={{ tier: "block", component: "JobListPage" }}
        />
    )
}
