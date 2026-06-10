"use client"

import { Magnifier as MagnifyingGlassIcon } from "@gravity-ui/icons"
import React, { useCallback, useMemo, useState } from "react"
import { Input, TextField, cn } from "@heroui/react"
import { useTranslations } from "next-intl"

/** One autocomplete suggestion shown in the dropdown. */
export interface SearchInputSuggestion {
    /** Stable id (used as the list key + select payload). */
    id: string
    /** Human-readable label shown in the dropdown row. */
    label: string
}

/** Props for {@link SearchInput}. */
export interface SearchInputProps {
    /** Current search query (controlled). */
    value: string
    /** Fired with the new query on every keystroke. */
    onValueChange: (value: string) => void
    /** Placeholder text; defaults to the generic search placeholder. */
    placeholder?: string
    /** Extra classes for the outer wrapper (width, spacing, …). */
    className?: string
    /**
     * Optional typeahead suggestions. When provided together with
     * {@link SearchInputProps.onSelectSuggestion}, a Google/TikTok-style dropdown
     * renders under the field while it is focused and the query is non-empty. The
     * parent owns the data source (e.g. an Elasticsearch-backed query), so this
     * component stays generic and reusable for any case.
     */
    suggestions?: Array<SearchInputSuggestion>
    /** Fired with the chosen suggestion; enables the dropdown when set. */
    onSelectSuggestion?: (suggestion: SearchInputSuggestion) => void
}

/**
 * Generic, reusable search input with an optional autocomplete dropdown.
 *
 * Presentational + controlled: the parent owns the value and (optionally) the
 * suggestion list. With suggestions + {@link SearchInputProps.onSelectSuggestion}
 * it behaves as a typeahead; without them it is a plain search field. Debouncing
 * is the caller's concern, keeping this reusable across any feature.
 */
export const SearchInput = ({
    value,
    onValueChange,
    placeholder,
    className,
    suggestions,
    onSelectSuggestion,
}: SearchInputProps) => {
    const t = useTranslations()
    // fall back to the generic search placeholder when the caller does not pass one
    const resolvedPlaceholder = placeholder ?? t("search.placeholder")
    // track focus so the dropdown only shows while the field is active
    const [focused, setFocused] = useState(false)

    // the dropdown is only available when the caller opted into suggestions
    const hasSuggestions = typeof onSelectSuggestion === "function"
    const open = hasSuggestions
        && focused
        && value.trim().length > 0
        && (suggestions?.length ?? 0) > 0

    return (
        <div className={cn("relative w-full sm:max-w-sm", className)}>
            <TextField aria-label={resolvedPlaceholder} className="w-full">
                <div className="relative">
                    <MagnifyingGlassIcon className="text-muted pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                    <Input
                        type="search"
                        placeholder={resolvedPlaceholder}
                        className="pl-9"
                        value={value}
                        onChange={(event) => onValueChange(event.target.value)}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                    />
                </div>
            </TextField>
            {open ? (
                <ul className="bg-content1 border-divider/60 absolute z-30 mt-1 max-h-72 w-full overflow-y-auto rounded-xl border py-1 shadow-lg">
                    {suggestions!.map((suggestion) => (
                        <SearchInputSuggestionRow
                            key={suggestion.id}
                            suggestion={suggestion}
                            query={value}
                            onSelect={onSelectSuggestion!}
                        />
                    ))}
                </ul>
            ) : null}
        </div>
    )
}

/** Props for {@link SearchInputSuggestionRow}. */
interface SearchInputSuggestionRowProps {
    /** The suggestion this row represents. */
    suggestion: SearchInputSuggestion
    /** The current query, used to bold the matching part. */
    query: string
    /** Fired with this suggestion when the row is chosen. */
    onSelect: (suggestion: SearchInputSuggestion) => void
}

/**
 * One dropdown row. Uses `onMouseDown` (which fires before the input's `blur`)
 * so the selection is registered before the dropdown closes.
 *
 * @param props - {@link SearchInputSuggestionRowProps}
 */
const SearchInputSuggestionRow = ({
    suggestion,
    query,
    onSelect,
}: SearchInputSuggestionRowProps) => {
    // split the label around the (case-insensitive) typed text to bold the match
    const segments = useMemo(() => {
        const normalized = query.trim().toLowerCase()
        const index = normalized.length > 0
            ? suggestion.label.toLowerCase().indexOf(normalized)
            : -1
        if (index < 0) {
            return {
                before: suggestion.label,
                match: "",
                after: "",
            }
        }
        return {
            before: suggestion.label.slice(0, index),
            match: suggestion.label.slice(index, index + normalized.length),
            after: suggestion.label.slice(index + normalized.length),
        }
    }, [suggestion.label, query])

    // mousedown (not click) so it runs before the input blur closes the dropdown
    const onMouseDown = useCallback(
        (event: React.MouseEvent) => {
            event.preventDefault()
            onSelect(suggestion)
        },
        [onSelect, suggestion],
    )

    return (
        <li>
            <button
                type="button"
                className="hover:bg-accent/10 flex w-full items-center gap-2 px-3 py-2 text-left text-sm"
                onMouseDown={onMouseDown}
            >
                <MagnifyingGlassIcon className="text-muted h-4 w-4 shrink-0" />
                {/* Google-style: the typed part stays light, the completion is bold */}
                <span className="truncate">
                    <span className="font-semibold">{segments.before}</span>
                    <span className="text-muted font-normal">{segments.match}</span>
                    <span className="font-semibold">{segments.after}</span>
                </span>
            </button>
        </li>
    )
}
