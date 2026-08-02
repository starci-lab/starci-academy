import React from "react"
import { FoundationCategoryHeader, type FoundationCategoryHeaderCrumb } from "@sb-components/starci/blocks/learn/FoundationCategoryHeader/FoundationCategoryHeader"
import { FoundationCategoryList, type FoundationCategoryListItem, type FoundationCategoryListPagination } from "@sb-components/starci/blocks/learn/FoundationCategoryList/FoundationCategoryList"
import { FoundationCategorySearchBar, type FoundationCategorySuggestion } from "@sb-components/starci/blocks/learn/FoundationCategorySearchBar/FoundationCategorySearchBar"
import { TrialEnrollBanner } from "@sb-components/starci/blocks/learn/TrialEnrollBanner/TrialEnrollBanner"
import { Container } from "@sb-components/frames/Container/Container"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `FoundationsGridPage` — the screen for browsing the Foundations content library and
 * drilling into a category. It composes blocks in frames and hands each typed data,
 * drawing no shape of its own.
 *
 * Six functions: header (breadcrumb + hub title/description), a self-hiding
 * trial-enroll banner, a live category count, name search with autocomplete, the
 * category list, and its pager. An empty result is a state of the list, not its own
 * block. `isSkeleton` flows to every block, including the trial banner (which treats
 * it as a state that wins over `isVisible`).
 */

/** Props for {@link FoundationsGridPage}. */
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
const FoundationsGridPage = ({
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

    return <Container size="md" padding={6} body={gridBody} />
}

export { FoundationsGridPage }
