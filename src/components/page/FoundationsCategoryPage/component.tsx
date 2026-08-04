import React from "react"
import { FoundationsHeader, type FoundationsHeaderCrumb } from "@/components/starci/blocks/learn/FoundationsHeader"
import { TrialEnrollBanner } from "@/components/starci/blocks/learn/TrialEnrollBanner"
import { FoundationSearchBar, type FoundationSearchSuggestion } from "@/components/starci/blocks/learn/FoundationSearchBar"
import { FoundationResourceList, type FoundationResourceItem } from "@/components/starci/blocks/learn/FoundationResourceList"
import { Container } from "@/components/frames/Container"
import { StackV } from "@/components/frames/Stack"

/**
 * `_FoundationsCategoryPage` — the SRC TWIN of `.storybook/components/starci/
 * pages/FoundationsCategoryPage/FoundationsCategoryPage.tsx`. Presentational:
 * typed props, already resolved; no fetch/store/i18n (that's the connected
 * half, `./index.tsx`).
 *
 * Same five functions, same reading order as the blueprint: orient · get
 * nudged to unlock while on trial · see a live match count · search resources
 * by name · browse the list, open one, and page through. Only `isSkeleton`
 * forks into its own leaf; the trial nudge's visibility, an empty search
 * result, and pager presence are data states of the one `Default` leaf.
 */

// re-exported so the connected file (and anything downstream) can build data
// against the SAME types the blueprint's blocks define, rather than
// redeclaring shape that already exists.
export type {
    FoundationsHeaderCrumb,
    FoundationSearchSuggestion,
    FoundationResourceItem,
}

/** Props for {@link _FoundationsCategoryPage}. */
export interface FoundationsCategoryPageProps {
    /** Breadcrumb trail: home → courses → course → foundations hub → this category. */
    breadcrumbItems?: Array<FoundationsHeaderCrumb>
    /** Category title. */
    title: string
    /** One-sentence summary of the category. */
    description?: string

    /** `true` → the caller has resolved the learner as a known, still-on-trial learner. */
    isTrialNudgeVisible: boolean
    /** Fired when the learner takes the trial → enroll nudge. */
    onEnrollTrial: () => void

    /** Current text in the search field (controlled, debounced upstream). */
    searchQuery: string
    /** Fired with the new query on every keystroke. */
    onSearchQueryChange: (query: string) => void
    /** Autocomplete suggestions for the current query. */
    suggestions: Array<FoundationSearchSuggestion>
    /** Fired with the chosen suggestion's id. */
    onSelectSuggestion: (id: string) => void
    /** Matching resource count. `undefined` while not known yet. */
    resultCount?: number
    /** `true` while the count is (re-)fetching on its own read, independent of the field. */
    isResultCountLoading?: boolean

    /** The current page's resources, in display order. */
    resources: Array<FoundationResourceItem>
    /** `true` → the list's own fetch is in flight. */
    isResourcesLoading: boolean
    /** Truthy → the list falls to its error message. */
    resourcesError?: unknown
    /** 1-based current page. */
    currentPage: number
    /** Total page count. */
    totalPages: number
    /** Fired with the 1-based page the reader picked. */
    onPageChange: (pageNumber: number) => void
    /** Accessible name for the resource list region. */
    resourceListAriaLabel?: string

    /**
     * `true` → every block that can mirror itself does. Flows to
     * `FoundationsHeader`, `FoundationSearchBar`, and `TrialEnrollBanner`
     * directly; folds into `FoundationResourceList`'s own `isLoading` leaf
     * (see file header for both non-direct cases).
     */
    isSkeleton?: boolean
}

/**
 * The foundations-category browse screen. See the file header for the
 * function list, the two seams' separate owners, and the two blocks whose
 * loading axis is not a plain `isSkeleton` prop.
 *
 * @param props - {@link FoundationsCategoryPageProps}
 */
const _FoundationsCategoryPage = ({
    breadcrumbItems,
    title,
    description,
    isTrialNudgeVisible,
    onEnrollTrial,
    searchQuery,
    onSearchQueryChange,
    suggestions,
    onSelectSuggestion,
    resultCount,
    isResultCountLoading,
    resources,
    isResourcesLoading,
    resourcesError,
    currentPage,
    totalPages,
    onPageChange,
    resourceListAriaLabel,
    isSkeleton = false,
}: FoundationsCategoryPageProps) => {
    const resourcesSection = (
        <>
            <FoundationSearchBar

                query={searchQuery}
                onQueryChange={onSearchQueryChange}
                suggestions={suggestions}
                onSelectSuggestion={onSelectSuggestion}
                resultCount={resultCount}
                isCountLoading={isResultCountLoading}
                isSkeleton={isSkeleton}

            />
            <FoundationResourceList

                resources={resources}
                isLoading={isSkeleton || isResourcesLoading}
                error={resourcesError}
                searchQuery={searchQuery}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                ariaLabel={resourceListAriaLabel}

            />
        </>
    )

    const categorySections = (
        <>
            <FoundationsHeader

                breadcrumbItems={breadcrumbItems}
                title={title}
                description={description}
                isSkeleton={isSkeleton}

            />
            <TrialEnrollBanner

                isVisible={isTrialNudgeVisible}
                onEnroll={onEnrollTrial}
                isSkeleton={isSkeleton}

            />
            <StackV gap={6} isSkeleton={isSkeleton} items={[() => resourcesSection]} />
        </>
    )

    const categoryBody = <StackV gap={7} isSkeleton={isSkeleton} items={[() => categorySections]} />

    return (
        <div data-tier="page" data-component="FoundationsCategoryPage">
            <Container size="md" padding={6} body={() => categoryBody} />
        </div>
    )
}

export { _FoundationsCategoryPage }
