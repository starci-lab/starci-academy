import React from "react"
import { SearchAutocomplete, type SearchAutocompleteItem } from "@sb-components/atoms/forms/SearchAutocomplete/SearchAutocomplete"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackH } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `FoundationCategorySearchBar`: the search row on the Foundations hub,
 * exactly as `FoundationsCategoryGridLayout` draws it in `src` — a debounced
 * autocomplete field on the left, a live "N chủ đề" count riding beside it on
 * the right, one `StackH` seam apart.
 *
 * NEW, not a rebuild — `SearchAutocomplete` is an ATOM the screen cannot call
 * bare (§decompose rule 1: nothing above atom tier reaches past a composite it
 * already has, and there is no existing composite/block that draws this row).
 * This block earns its layer two ways:
 *   1. It maps the DOMAIN suggestion entity (`FoundationCategorySuggestion`,
 *      `{ id, label }` off the `foundationCategorySuggestions` GraphQL query)
 *      into the atom's generic `SearchAutocompleteItem` shape. The atom stays
 *      reusable for any suggestion source; this block is the one place that
 *      knows a foundation category suggestion looks like that.
 *   2. It OWNS the count's wording, the same way `ContentModeNav` owns its
 *      mode-label table (§14d.1) — the caller hands over a bare `count`
 *      number, never a pre-formatted string. Ported straight from the real
 *      copy (`vi.json` foundations.categoryCount`):
 *        - 0            → "Chưa có chủ đề" (a real, newsworthy zero — the
 *                          search genuinely turned up nothing — unlike
 *                          `ContentModeNav`'s badge count, where 0 is not
 *                          news and is hidden instead)
 *        - N ≥ 1        → "N chủ đề"
 *      `count` itself stays OPTIONAL and undefined ⇒ nothing is rendered:
 *      that is the "count not known yet" case (first paint, before the
 *      category list has answered), distinct from the real zero above.
 *
 * ONE LEAF. `isSkeleton` only swaps which state each composed atom renders
 * (field → field skeleton, count text → text skeleton bar) — no node
 * appears/disappears, so it is a STATE inside the one leaf, not its own leaf
 * (§14d.2).
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** One foundation-category autocomplete suggestion (from `foundationCategorySuggestions`). */
export interface FoundationCategorySuggestion {
    /** Category id — the payload `onSelectSuggestion` fires with. */
    id: string
    /** Clean display label (bare tech name, e.g. "Docker"). */
    label: string
}

/** Props for {@link FoundationCategorySearchBar}. */
export interface FoundationCategorySearchBarProps {
    /** Current text in the search field (controlled, debounced upstream by the screen). */
    query: string
    /** Fired with the new query on every keystroke. */
    onQueryChange: (query: string) => void
    /** Suggestions for the current query, best match first. */
    suggestions: Array<FoundationCategorySuggestion>
    /** Fired with the chosen suggestion's id. */
    onSelectSuggestion: (id: string) => void
    /** Matching category count. `undefined` while the count itself is not known yet. */
    count?: number
    /** Renders the field's + count's skeleton mirrors instead of the real controls. */
    isSkeleton?: boolean
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/** Vietnamese count wording, ported verbatim from `foundations.categoryCount`. */
const countLabel = (count: number): string => (count === 0 ? "Chưa có chủ đề" : `${count} chủ đề`)

/**
 * The Foundations hub's search row. See the file header for why the count's
 * zero case renders (unlike a nav badge) and why this stays one leaf.
 *
 * @param props - {@link FoundationCategorySearchBarProps}
 */
const FoundationCategorySearchBar = ({
    query,
    onQueryChange,
    suggestions,
    onSelectSuggestion,
    count,
    isSkeleton = false,
    showAnatomy = false,
    anatPart,
}: FoundationCategorySearchBarProps) => {
    // domain entity → the atom's generic item shape (no `description` line: a
    // category suggestion carries only a bare name).
    const items: Array<SearchAutocompleteItem> = suggestions.map((suggestion) => ({
        id: suggestion.id,
        label: suggestion.label,
    }))

    return (
        <div data-anat-part={anatPart}>
            <StackH gap="grouped" justify="between" showAnatomy={showAnatomy} anatPart={showAnatomy ? "StackH" : undefined}>
                <div className="min-w-0 flex-1" data-anat-part={showAnatomy ? "SearchAutocomplete" : undefined}>
                    <SearchAutocomplete
                        items={items}
                        inputValue={query}
                        onInputChange={onQueryChange}
                        onSelect={onSelectSuggestion}
                        placeholder="Tìm chủ đề..."
                        isSkeleton={isSkeleton}
                        showAnatomy={showAnatomy}
                    />
                </div>
                {isSkeleton ? (
                    <Typography size="sm" color="muted" isSkeleton classNames={["shrink-0"]} showAnatomy={showAnatomy} />
                ) : count !== undefined ? (
                    <Typography
                        size="sm"
                        color="muted"
                        text={countLabel(count)}
                        classNames={["shrink-0"]}
                        showAnatomy={showAnatomy}
                    />
                ) : null}
            </StackH>
        </div>
    )
}

export { FoundationCategorySearchBar }
