import React from "react"
import {
    SearchAutocomplete,
    type SearchAutocompleteItem,
} from "@/components/atoms/forms/SearchAutocomplete"

/**
 * `ConsultantDirectoryCompanySearch` — a typed, debounced deep-link to one
 * recruiting company's page, sitting above the consultant grid on the directory
 * screen. It is not a grid filter: there is no server-side search over
 * consultants, only a company suggester, so it jumps straight to a known
 * company page. `isLoadingSuggestions` swaps the popover's content.
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

    // Sole root is SearchAutocomplete — inert host wrappers removed. Identity
    // stays held until the atom accepts CallerIdentity (CourseTrialChip pattern).
    return (
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
    )
}

export { ConsultantDirectoryCompanySearch }
