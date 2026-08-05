import React from "react"
import { type SkeletonProps } from "@/components/frames/_slot"
import { SearchAutocomplete, type SearchAutocompleteItem } from "@/components/atoms/forms/SearchAutocomplete"
import { Typography } from "@/components/atoms/text/Typography"
import { StackH } from "@/components/frames/Stack"

/**
 * BLOCK — `FoundationCategorySearchBar`: the Foundations hub's search row —
 * a debounced autocomplete field plus a live "N topics" count riding beside
 * it, one `StackH` seam apart. See the component file header for why this
 * earns its own layer over the bare `SearchAutocomplete` atom (domain
 * mapping + count wording, §14d.1).
 *
 * 📐 ONE LEAF (§14d.2). `isSkeleton`, an empty vs. populated suggestion list,
 * and every value `count` can take (unknown / zero / N) are all DATA — no
 * node appears or disappears across them — so they are STATES inside the
 * single `Default` leaf, not leaves of their own.
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
}

/** Vietnamese count wording, ported verbatim from `foundations.categoryCount`. */
const countLabel = (count: number): string => (count === 0 ? "No topics yet" : `${count} topics`)

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
}: FoundationCategorySearchBarProps) => {
    // domain entity → the atom's generic item shape (no `description` line: a
    // category suggestion carries only a bare name).
    const items: Array<SearchAutocompleteItem> = suggestions.map((suggestion) => ({
        id: suggestion.id,
        label: suggestion.label,
    }))

    return (
        <div>
            <StackH
                gap={4}
                principles={["content-row"]}
                justify="between"
                isSkeleton={isSkeleton}
                items={[
                    () => (
                        <div className="min-w-0 flex-1">
                            <SearchAutocomplete
                                items={items}
                                inputValue={query}
                                onInputChange={onQueryChange}
                                onSelect={onSelectSuggestion}
                                placeholder="Search topics..."
                                isSkeleton={isSkeleton}

                            />
                        </div>
                    ),
                    ...(isSkeleton
                        ? [() => <Typography size="sm" color="muted" isSkeleton classNames={["shrink-0"]} />]
                        : count !== undefined
                            ? [
                                ({ isSkeleton }: SkeletonProps) => (
                                    <Typography
                                        isSkeleton={isSkeleton}
                                        size="sm"
                                        color="muted"
                                        text={countLabel(count)}
                                        classNames={["shrink-0"]}

                                    />
                                ),
                            ]
                            : []),
                ]}
            />
        </div>
    )
}

export { FoundationCategorySearchBar }
