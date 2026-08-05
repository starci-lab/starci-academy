import React from "react"
import {
    FoundationCategoryHeader,
    type FoundationCategoryHeaderCrumb,
} from "@/components/starci/blocks/learn/FoundationCategoryHeader"
import {
    FoundationCategoryList,
    type FoundationCategoryListItem,
    type FoundationCategoryListPagination,
} from "@/components/starci/blocks/learn/FoundationCategoryList"
import {
    FoundationCategorySearchBar,
    type FoundationCategorySuggestion,
} from "@/components/starci/blocks/learn/FoundationCategorySearchBar"
import { TrialEnrollBanner } from "@/components/starci/blocks/learn/TrialEnrollBanner"
import { Container } from "@/components/frames/Container"
import { StackV } from "@/components/frames/Stack"

/**
 * `_FoundationsGridPage` — the SRC TWIN of `.storybook/components/starci/pages/
 * FoundationsGridPage/FoundationsGridPage.tsx`. Presentational: typed props,
 * already resolved; no fetch/store/i18n (that's the connected half, `./index.tsx`).
 *
 * Same six functions, same reading order as the blueprint: orient · get nudged
 * to unlock while on trial · see a live match count · search by name · browse
 * and open a category · page through when there's more than one page. Only
 * `isSkeleton` forks into its own leaf; the trial banner's visibility, an empty
 * search result, and pager presence are data states of the one `Default` leaf.
 */

// re-exported so the connected file (and anything downstream) can build data
// against the SAME types the blueprint's blocks define, rather than
// redeclaring shape that already exists.
export type {
    FoundationCategoryHeaderCrumb,
    FoundationCategoryListItem,
    FoundationCategoryListPagination,
    FoundationCategorySuggestion,
}

/** Props for {@link _FoundationsGridPage}. */
export interface FoundationsGridPageProps {
    /** Breadcrumb trail above the hub title. */
    breadcrumbItems?: Array<FoundationCategoryHeaderCrumb>
    /** Hub title. */
    title: string
    /** One-sentence summary of the hub. */
    description?: string

    /** `true` → the caller has resolved the learner as a known trial learner. */
    isTrialBannerVisible: boolean
    /** Fired when the learner taps the trial banner's CTA. */
    onEnrollTrial: () => void

    /** Current text in the search field (controlled, debounced upstream). */
    searchQuery: string
    /** Fired with the new query on every keystroke. */
    onSearchQueryChange: (query: string) => void
    /** Autocomplete suggestions for the current query. */
    suggestions: Array<FoundationCategorySuggestion>
    /** Fired with the chosen suggestion's id. */
    onSelectSuggestion: (id: string) => void
    /** Matching category count. `undefined` while not known yet. */
    categoryCount?: number

    /** The current page's categories, in display order. */
    categories: Array<FoundationCategoryListItem>
    /** Fired with a category's id on any row press. */
    onSelectCategory: (id: string) => void
    /** Page nav state. Omit → no pager, even with a full page of rows. */
    pagination?: FoundationCategoryListPagination

    /**
     * `true` → every block that can mirror itself does, including the trial
     * banner (see file header on why it wins over `isTrialBannerVisible`).
     */
    isSkeleton?: boolean
}

/**
 * The Foundations-hub browse screen. See the file header for the function list
 * and the two seams' separate owners.
 *
 * @param props - {@link FoundationsGridPageProps}
 */
const _FoundationsGridPage = ({
    breadcrumbItems,
    title,
    description,
    isTrialBannerVisible,
    onEnrollTrial,
    searchQuery,
    onSearchQueryChange,
    suggestions,
    onSelectSuggestion,
    categoryCount,
    categories,
    onSelectCategory,
    pagination,
    isSkeleton = false,
}: FoundationsGridPageProps) => {
    const categoriesSection = (
        <>
            <FoundationCategorySearchBar

                query={searchQuery}
                onQueryChange={onSearchQueryChange}
                suggestions={suggestions}
                onSelectSuggestion={onSelectSuggestion}
                count={categoryCount}
                isSkeleton={isSkeleton}

            />
            <FoundationCategoryList

                categories={categories}
                searchQuery={searchQuery}
                onSelectCategory={onSelectCategory}
                pagination={pagination}
                isSkeleton={isSkeleton}

            />
        </>
    )

    const gridSections = (
        <>
            <FoundationCategoryHeader

                breadcrumbItems={breadcrumbItems}
                title={title}
                description={description}
                isSkeleton={isSkeleton}

            />
            <TrialEnrollBanner

                isVisible={isTrialBannerVisible}
                onEnroll={onEnrollTrial}
                isSkeleton={isSkeleton}

            />
            <StackV gap={6} isSkeleton={isSkeleton} items={[() => categoriesSection]} />
        </>
    )

    const gridBody = <StackV gap={6} isSkeleton={isSkeleton} items={[() => gridSections]} />

    return (
        <Container
            size="md"
            padding={6}
            body={() => gridBody}
            identity={{ tier: "page", component: "FoundationsGridPage" }}
        />
    )
}

export { _FoundationsGridPage }
