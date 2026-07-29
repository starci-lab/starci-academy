import React from "react"
import { FoundationsHeader, type FoundationsHeaderCrumb } from "@sb-components/starci/blocks/learn/FoundationsHeader/FoundationsHeader"
import { TrialEnrollNudge } from "@sb-components/starci/blocks/commerce/TrialEnrollNudge/TrialEnrollNudge"
import { FoundationSearchBar, type FoundationSearchSuggestion } from "@sb-components/starci/blocks/learn/FoundationSearchBar/FoundationSearchBar"
import { FoundationResourceList, type FoundationResourceItem } from "@sb-components/starci/blocks/learn/FoundationResourceList/FoundationResourceList"
import { Container } from "@sb-components/frames/Container/Container"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SCREEN — `FoundationsCategoryPage`: browse ONE foundations category's
 * resources (articles, videos, exercises, reference docs), reached from the
 * Foundations hub grid.
 *
 * A screen owns a LIST OF FUNCTIONS and nothing else: it calls blocks, places
 * them in frames, and hands each one typed data. It draws no shape of its own —
 * every `div` here would be a shape it had no right to decide.
 *
 * FIVE FUNCTIONS, in the order the reader meets them:
 *   1. Orient — breadcrumb trail + category title/description.  → `FoundationsHeader`
 *   2. Get nudged to unlock the course while still on trial.     → `TrialEnrollNudge`
 *   3. See a live match count for the current search.            → `FoundationSearchBar`
 *   4. Search resources by name with autocomplete suggestions.   → `FoundationSearchBar`
 *   5. Browse the resource list, open one, page through it.      → `FoundationResourceList`
 *
 * REUSE, NOT A NEW SCREEN SHAPE. All five functions are already owned by the
 * four blocks built this run — this screen composes them, it invents nothing.
 * The tree mirrors `FoundationsGridPage` (its closest sibling: identity card,
 * a self-hiding trial nudge, then a "browse cluster" of search-row-above-list)
 * one level down the nav — that screen browses CATEGORIES, this one browses one
 * category's RESOURCES.
 *
 * TWO SEAMS, TWO OWNERS (§10a):
 *   • The outer `StackV gap="page"` separates the screen's three REGIONS —
 *     identity, the trial nudge, and the browse cluster — each a distinct
 *     feature of the page, not rows of one surface.
 *   • The inner `StackV gap="section"` is its own separate owner for the
 *     "browse cluster" (search row above the resource list), matching the
 *     source layout's own `gap-6` between that row and the list it filters.
 *
 * ⭐ `TrialEnrollNudge` HAS NO `isSkeleton` OF ITS OWN (see that block's file
 * header — "never skeletonised, on purpose": it only ever mounts once
 * enrolled/trial status is already known). So while THIS screen's own
 * `isSkeleton` is on, the trial status is by definition not yet resolved —
 * the screen forces `isVisible={false}` for the nudge during skeleton,
 * regardless of what `isTrialNudgeVisible` says, rather than asking a block
 * with no loading shape to draw one.
 *
 * ⭐ `FoundationResourceList` HAS NO `isSkeleton` PROP EITHER — its OWN loading
 * leaf is `isLoading` (see that block's file header, R0: the caller-flipped
 * boolean that swaps the whole region for `AsyncContent`'s skeleton branch).
 * This screen's `isSkeleton` therefore folds into that same switch:
 * `isLoading={isSkeleton || isResourcesLoading}`, so a caller who sets the
 * screen's `isSkeleton` does not also have to remember to set
 * `isResourcesLoading` for the list to mirror itself.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link FoundationsCategoryPage}. */
export interface FoundationsCategoryPageProps {
    /** Breadcrumb trail: home → courses → course → foundations hub → this category. */
    breadcrumbItems?: Array<FoundationsHeaderCrumb>
    /** Category title. */
    title: string
    /** One-sentence summary of the category. */
    description?: string

    /** `true` → the caller has resolved the learner as a known, still-on-trial learner. */
    isTrialNudgeVisible: boolean
    /** Nudge headline, localized by the caller — `TrialEnrollNudge` does not own its own wording. */
    trialNudgeTitle: string
    /** Nudge supporting sentence. */
    trialNudgeDescription: string
    /** Nudge CTA label. */
    trialNudgeCtaLabel: string
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
     * `FoundationsHeader` and `FoundationSearchBar` directly; folds into
     * `FoundationResourceList`'s own `isLoading` leaf and forces
     * `TrialEnrollNudge`'s `isVisible` to `false` (see file header for both).
     */
    isSkeleton?: boolean
    /** When on, each block emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
}

/**
 * The foundations-category browse screen. See the file header for the
 * function list, the two seams' separate owners, and the two blocks whose
 * loading axis is not a plain `isSkeleton` prop.
 *
 * @param props - {@link FoundationsCategoryPageProps}
 */
const FoundationsCategoryPage = ({
    breadcrumbItems,
    title,
    description,
    isTrialNudgeVisible,
    trialNudgeTitle,
    trialNudgeDescription,
    trialNudgeCtaLabel,
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
    showAnatomy = false,
}: FoundationsCategoryPageProps) => (
    <Container size="md" padding="roomy">
        <StackV gap="page" anatPart={showAnatomy ? "StackV" : undefined}>
            <FoundationsHeader
                anatPart="FoundationsHeader"
                breadcrumbItems={breadcrumbItems}
                title={title}
                description={description}
                isSkeleton={isSkeleton}
                showAnatomy={showAnatomy}
            />
            <TrialEnrollNudge
                anatPart="TrialEnrollNudge"
                title={trialNudgeTitle}
                description={trialNudgeDescription}
                ctaLabel={trialNudgeCtaLabel}
                onEnroll={onEnrollTrial}
                isVisible={isSkeleton ? false : isTrialNudgeVisible}
                showAnatomy={showAnatomy}
            />
            <StackV gap="section" anatPart={showAnatomy ? "StackV" : undefined}>
                <FoundationSearchBar
                    anatPart="FoundationSearchBar"
                    query={searchQuery}
                    onQueryChange={onSearchQueryChange}
                    suggestions={suggestions}
                    onSelectSuggestion={onSelectSuggestion}
                    resultCount={resultCount}
                    isCountLoading={isResultCountLoading}
                    isSkeleton={isSkeleton}
                    showAnatomy={showAnatomy}
                />
                <FoundationResourceList
                    anatPart="FoundationResourceList"
                    resources={resources}
                    isLoading={isSkeleton || isResourcesLoading}
                    error={resourcesError}
                    searchQuery={searchQuery}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                    ariaLabel={resourceListAriaLabel}
                    showAnatomy={showAnatomy}
                />
            </StackV>
        </StackV>
    </Container>
)

export { FoundationsCategoryPage }
