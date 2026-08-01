import { SearchAutocomplete, type SearchAutocompleteItem } from "@sb-components/atoms/forms/SearchAutocomplete/SearchAutocomplete"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackH } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `FoundationSearchBar`: the search row — debounced-typeahead field on
 * the left, a live match count on the right, `justify-between` — matching
 * `src`'s `flex items-center justify-between` row for this list's toolbar.
 *
 * SIBLING OF `FoundationCategorySearchBar`, NOT A COPY. Both draw a
 * `SearchAutocomplete` beside a count `Typography` in one `StackH`, because
 * that IS the shape of "search field + live count" — reusing the shape is not
 * reusing the block, the two sit on different screens with different counted
 * things. The real difference is the count's LOADING axis: the category bar's
 * count answers off the SAME query as its suggestions, so one `isSkeleton`
 * covers both; this bar's `resultCount` comes from a SEPARATE `SWR` read than
 * `suggestions` in `src` (the field can already show typeahead rows while the
 * count for the full result set is still in flight, or vice versa), so
 * `isCountLoading` is its own prop and the count can shimmer independently of
 * the field.
 *
 * OWNS THE COUNT'S WORDING (§14d.1) — the caller hands over a bare
 * `resultCount` number, never a formatted string like "12 resources"; this
 * block is the one place that turns that number into copy, including the
 * newsworthy-zero case ("no matches" is real information, unlike a nav
 * badge's zero, which is why it is not hidden here).
 *
 * ONE LEAF. Neither `isCountLoading` nor `resultCount` add or remove a
 * composed node — the count slot always occupies the same place in the row,
 * it only swaps between a text skeleton, a formatted number, and (before any
 * count has ever arrived) nothing. That is three DATA conditions on one
 * structure, so they are STATES, not separate leaves. `isSkeleton` also stays
 * inside the same leaf for the same reason: it swaps both composed atoms to
 * their own resting mirrors without changing which nodes exist (unlike
 * `ContentHeader`, where `isSkeleton` there needed its own leaf only because
 * this block has no second card that could disappear).
 * ─────────────────────────────────────────────────────────────────────────────
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
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
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
    showAnatomy = false,
    anatPart,
}: FoundationSearchBarProps) => {
    // Domain suggestion → the atom's generic item shape (no `description` line:
    // this bar's rows carry only a bare label).
    const items: Array<SearchAutocompleteItem> = suggestions.map((suggestion) => ({
        id: suggestion.id,
        label: suggestion.label,
    }))

    return (
        <div data-anat-part={anatPart}>
            <StackH
                gap={3}
                justify="between"
                showAnatomy={showAnatomy}
                anatPart={showAnatomy ? "StackH" : undefined}
                body={
                    <>
                        <SearchAutocomplete
                            items={items}
                            inputValue={query}
                            onInputChange={onQueryChange}
                            onSelect={onSelectSuggestion}
                            placeholder={placeholder}
                            isSkeleton={isSkeleton}
                            showAnatomy={showAnatomy}
                        />
                        {isSkeleton || isCountLoading ? (
                            <Typography
                                size="sm"
                                color="muted"
                                isSkeleton
                                classNames={["shrink-0"]}
                                showAnatomy={showAnatomy}
                            />
                        ) : resultCount !== undefined ? (
                            <Typography
                                size="sm"
                                color="muted"
                                tabularNums
                                text={resultCountLabel(resultCount)}
                                classNames={["shrink-0"]}
                                showAnatomy={showAnatomy}
                            />
                        ) : null}
                    </>
                }
            />
        </div>
    )
}

export { FoundationSearchBar }
