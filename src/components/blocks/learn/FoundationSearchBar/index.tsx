import { SearchAutocomplete, type SearchAutocompleteItem } from "@/components/atoms/forms/SearchAutocomplete"
import { Typography } from "@/components/atoms/text/Typography"
import { StackH } from "@/components/frames/Stack"

/**
 * BLOCK — `FoundationSearchBar`: the search row — debounced-typeahead field
 * left, a live match count right, one `StackH` seam apart. See the component
 * file header for why this is a SIBLING of `FoundationCategorySearchBar`
 * (not a reach past it) and for the independent-count-loading axis that makes
 * it a distinct block rather than the same one reused.
 *
 * ONE LEAF (§14d.2). `isSkeleton`, `isCountLoading`, an empty vs. populated
 * suggestion list, and every value `resultCount` can take (unknown / zero / N)
 * are all DATA on the same fixed structure — no node appears or disappears —
 * so they are STATES inside the single `Default` leaf, not leaves of their own.
 */

/** One autocomplete suggestion row (id + label only — the generic shape this bar needs). */
export interface FoundationSearchSuggestion {
    /** Stable id — the payload `onSelectSuggestion` fires with. */
    id: string
    /** Display label for the suggestion row. */
    label: string
}

/** Props for {@link FoundationSearchBar}. */
export interface FoundationSearchBarProps {
    /** Current text in the search field (controlled, debounced upstream by the screen). */
    query: string
    /** Fired with the new query on every keystroke. */
    onQueryChange: (query: string) => void
    /** Suggestions for the current query, best match first. */
    suggestions: Array<FoundationSearchSuggestion>
    /** Fired with the chosen suggestion's id. */
    onSelectSuggestion: (id: string) => void
    /** Placeholder for the empty field. Defaults to "Search...". */
    placeholder?: string
    /**
     * How many results the current query matched. `undefined` means the count
     * itself is not known yet (first paint, before the count read has ever
     * answered) — distinct from a real `0`, which renders.
     */
    resultCount?: number
    /**
     * `true` while the count is (re-)fetching on ITS OWN SWR read — independent
     * of `suggestions`/the field, which may already be interactive. Only the
     * count slot shimmers.
     */
    isCountLoading?: boolean
    /** Renders the field's + count's resting skeleton mirrors instead of the real controls. */
    isSkeleton?: boolean
}

/** Count wording — this block's own vocabulary, never handed in by the caller. */
const resultCountLabel = (count: number): string => (count === 0 ? "No documents yet" : `${count} documents`)

/**
 * The search row: typeahead field left, live match count right. See the file
 * header for why this is a sibling of `FoundationCategorySearchBar` rather
 * than a reach past it, and why the count's three data conditions stay one leaf.
 *
 * @param props - {@link FoundationSearchBarProps}
 */
const FoundationSearchBar = ({
    query,
    onQueryChange,
    suggestions,
    onSelectSuggestion,
    placeholder = "Search documents...",
    resultCount,
    isCountLoading = false,
    isSkeleton = false,
}: FoundationSearchBarProps) => {
    // Domain suggestion → the atom's generic item shape (no `description` line:
    // this bar's rows carry only a bare label).
    const items: Array<SearchAutocompleteItem> = suggestions.map((suggestion) => ({
        id: suggestion.id,
        label: suggestion.label,
    }))

    return (
        <StackH
            gap={3}
            justify="between"
            principle="content-row"
            explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
            isSkeleton={isSkeleton}
            identity={{ tier: "block", component: "FoundationSearchBar" }}
            items={[
                () => (
                    <SearchAutocomplete
                        items={items}
                        inputValue={query}
                        onInputChange={onQueryChange}
                        onSelect={onSelectSuggestion}
                        placeholder={placeholder}
                        isSkeleton={isSkeleton}
                    />
                ),
                ...(isSkeleton || isCountLoading
                    ? [
                        () => (
                            <Typography
                                size="sm"
                                color="muted"
                                isSkeleton
                            />
                        ),
                    ]
                    : resultCount !== undefined
                        ? [
                            () => (
                                <Typography
                                    size="sm"
                                    color="muted"
                                    tabularNums
                                    text={resultCountLabel(resultCount)}
                                />
                            ),
                        ]
                        : []),
            ]}
        />
    )
}

export { FoundationSearchBar }
