import React from "react"
import { FoundationCategoryHeader, type FoundationCategoryHeaderCrumb } from "@sb-components/starci/blocks/learn/FoundationCategoryHeader/FoundationCategoryHeader"
import { FoundationCategoryList, type FoundationCategoryListItem, type FoundationCategoryListPagination } from "@sb-components/starci/blocks/learn/FoundationCategoryList/FoundationCategoryList"
import { FoundationCategorySearchBar, type FoundationCategorySuggestion } from "@sb-components/starci/blocks/learn/FoundationCategorySearchBar/FoundationCategorySearchBar"
import { TrialEnrollBanner } from "@sb-components/starci/blocks/learn/TrialEnrollBanner/TrialEnrollBanner"
import { Container } from "@sb-components/frames/Container/Container"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SCREEN — `FoundationsGridPage`: browse the Foundations content library and
 * drill into a category.
 *
 * A screen owns a LIST OF FUNCTIONS and nothing else: it calls blocks, places
 * them in frames, and hands each one typed data. It draws no shape of its own —
 * every `div` here would be a shape it had no right to decide.
 *
 * SIX FUNCTIONS, in the order the reader meets them:
 *   1. Orient — the breadcrumb trail + hub title/description.        → `FoundationCategoryHeader`
 *   2. Get nudged to unlock the course while still on trial.         → `TrialEnrollBanner`
 *   3. See how many categories exist / match, live.                  → `FoundationCategorySearchBar`
 *   4. Search by name with autocomplete suggestions.                 → `FoundationCategorySearchBar`
 *   5. Browse the category list and open one.                        → `FoundationCategoryList`
 *   6. Page through categories when there's more than one page.      → `FoundationCategoryList` (pager)
 *
 * CUT PER §B1 (state, not function): "see a clear empty message" is a STATE of
 * function 5 (`FoundationCategoryList`'s own empty-state branch), not its own
 * function — it never appears independent of browsing, so it is not a seventh
 * block here.
 *
 * TWO SEAMS, TWO OWNERS (§10a). The outer `StackV gap={6}` separates the
 * three REGIONS of the page — identity, the trial nudge, and the browse
 * cluster. The inner `StackV gap={6}` is its own separate owner for the
 * "browse cluster" — search row above list — mirroring the real
 * `FoundationsCategoryGrid` layout's own inner `gap-6` cluster between its
 * search row and its grid/pager (the `gap-3` inside that layout is a
 * DIFFERENT seam, internal to the search row itself, already handled by
 * `FoundationCategorySearchBar`'s own `StackH gap={4}`).
 *
 * ⚠️ `isSkeleton` flows to every block uniformly, INCLUDING the trial banner:
 * `TrialEnrollBanner` treats `isSkeleton` as a state that WINS over
 * `isVisible` (see that block's own file header) — the screen does not need to
 * pick one or the other, it hands both down and the block resolves the rest.
 * ─────────────────────────────────────────────────────────────────────────────
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
    /** When on, each block emits `data-anat-part` for a BlockAnatomy panel. */
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
            <StackV gap={6} body={categoriesSection} />
        </>
    )

    const gridBody = <StackV gap={6} body={gridSections} />

    return <Container size="md" padding={6} body={gridBody} />
}

export { FoundationsGridPage }
