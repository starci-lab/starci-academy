import React from "react"
import {
    SearchAutocomplete,
    type SearchAutocompleteItem,
} from "@sb-components/atoms/forms/SearchAutocomplete/SearchAutocomplete"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `ConsultantDirectoryCompanySearch`: a typed, debounced DEEP-LINK to one
 * recruiting company's page, not a filter on the consultant grid below it.
 *
 * WHY THIS EXISTS: the real query has no server-side search over consultants —
 * only an ES company-suggester. So this row cannot narrow "which consultants are
 * shown"; it can only help the visitor jump straight to a company they already
 * have in mind. Naming it a "search" without saying what it searches would repeat
 * the `ContentTabBar` mistake this run exists to correct — see
 * `ContentModeNav.tsx`'s file header for the exact shape of that bug.
 *
 * WHAT IT OWNS: the placeholder wording (§14d.1 — a block owns its own copy, it
 * never accepts a pre-formatted string from the caller) and the mapping from a
 * named domain suggestion (`ConsultantCompanySuggestion`) onto the atom's generic
 * `SearchAutocompleteItem` shape. Nothing else — no debouncing, no fetch, no
 * `router.push`. Those stay the SCREEN's job, matching `SearchAutocomplete`'s own
 * controlled, no-fetch contract (it is a tier-3 presentational atom: the parent
 * always owns the query and the results).
 *
 * ⭐ NEVER SKELETONISED, on purpose (ContentModeNav precedent). This row is static
 * chrome — its shape is known before any company data loads — so there is no
 * `isSkeleton` prop at all rather than one quietly unused.
 *
 * ⚖️ JUDGEMENT CALL — one leaf, no state split. `Default` is the only leaf: there
 * is exactly one structural shape (field + suggestion popover), and the loading
 * flag only swaps which content sits inside the SAME popover shell — that is a
 * DATA condition, not a structural one, so it is a `why` inside the one state
 * rather than a second leaf.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** One company the ES suggester matched against the typed query. */
export interface ConsultantCompanySuggestion {
    /** Stable company id — the payload handed back through `onSelectCompany`. */
    id: string
    /** Company display name, already localized/formatted by the caller. */
    label: string
}

/** Props for {@link ConsultantDirectoryCompanySearch}. */
export interface ConsultantDirectoryCompanySearchProps {
    /** Current text in the search field (controlled). */
    query: string
    /** Fired with the new query on every keystroke; the screen owns debouncing. */
    onQueryChange: (value: string) => void
    /** Company matches for the current query, already fetched by the screen. */
    suggestions: Array<ConsultantCompanySuggestion>
    /** `true` while the screen is waiting on the ES company-suggester. */
    isLoadingSuggestions?: boolean
    /** Fired with the picked company's id; the screen owns the route push. */
    onSelectCompany: (companyId: string) => void
    /** When on, emit `data-anat-part` on this block's parts for a BlockAnatomy panel. */
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
}

/**
 * The company deep-link search row atop the consultant directory. See the file
 * header for why this is a jump-to-company control and not a grid filter.
 *
 * @param props - {@link ConsultantDirectoryCompanySearchProps}
 */
const ConsultantDirectoryCompanySearch = ({
    query,
    onQueryChange,
    suggestions,
    isLoadingSuggestions = false,
    onSelectCompany,
}: ConsultantDirectoryCompanySearchProps) => {
    const items: Array<SearchAutocompleteItem> = suggestions.map((company) => ({
        id: company.id,
        label: company.label,
    }))

    return (
        <div>
            <div>
                <SearchAutocomplete
                    items={items}
                    inputValue={query}
                    onInputChange={onQueryChange}
                    onSelect={onSelectCompany}
                    isLoading={isLoadingSuggestions}
                    // Owned wording: this field jumps to ONE company, it does not filter
                    // the grid below it — the placeholder has to say so or a visitor will
                    // type a role/skill and get nothing back.
                    placeholder="Search for a hiring company by name…"
                    emptyLabel="No companies found"

                />
            </div>
        </div>
    )
}

export { ConsultantDirectoryCompanySearch }
