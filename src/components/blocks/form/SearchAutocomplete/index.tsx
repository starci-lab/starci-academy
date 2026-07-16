"use client"

import { MagnifyingGlassIcon } from "@phosphor-icons/react"
import React from "react"
import {
    cn,
    ComboBox,
    Input,
    ListBox,
    ListBoxItem,
    Spinner,
    Typography,
} from "@heroui/react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** One suggestion row in a {@link SearchAutocomplete} dropdown. */
export interface SearchAutocompleteItem {
    /** Stable id — the select payload passed to `onSelect` and the React key. */
    id: string
    /** Primary label shown on the suggestion row (e.g. a course or tag name). */
    label: string
    /** Optional secondary line, rendered small and muted below the label. */
    description?: string
}

/**
 * Props for the {@link SearchAutocomplete} block.
 *
 * Tier-3 presentational — controlled, props-only, no store/SWR/fetch. The parent
 * owns both the typed query and the suggestion list (e.g. an Elasticsearch-backed
 * query), so this block stays generic. Every callback is safe as a no-op.
 */
export interface SearchAutocompleteProps extends WithClassNames<undefined> {
    /**
     * The suggestions to render in the dropdown. The parent is responsible for
     * filtering/fetching them from the query — this block does NOT filter locally.
     */
    items: Array<SearchAutocompleteItem>
    /** Current text in the search field (controlled). */
    inputValue: string
    /** Fired with the new query on every keystroke. */
    onInputChange: (value: string) => void
    /** Fired with the chosen suggestion's id when a row is selected. */
    onSelect: (id: string) => void
    /** Placeholder for the empty field. Defaults to "Tìm khoá học, chủ đề...". */
    placeholder?: string
    /**
     * When true, a spinner replaces the suggestion list — use it while the parent
     * is fetching results for the current query.
     */
    isLoading?: boolean
    /** Message shown when there are no suggestions. Defaults to "Không có gợi ý nào". */
    emptyLabel?: string
}

/**
 * SearchAutocomplete is a suggest-as-you-type search field built on the canonical
 * HeroUI {@link ComboBox} (its real free-text anatomy: `ComboBox.InputGroup` with
 * a HeroUI {@link Input}, plus a `ComboBox.Popover` wrapping a {@link ListBox} of
 * {@link ListBoxItem} rows). The ComboBox is driven in controlled mode via
 * `inputValue`/`onInputChange` and reports the picked row through
 * `onSelectionChange`; filtering is delegated to the parent (`items` are rendered
 * as-is), keeping this reusable for any data source.
 *
 * Each row shows the item `label` and, when present, a muted `description` line.
 * The dropdown stays open on an empty collection (`allowsEmptyCollection`) so the
 * loading spinner and the empty message are visible — both rendered through the
 * ListBox `renderEmptyState` slot.
 *
 * Tier-3 presentational block: props-only, controlled, no store, no SWR, no
 * side-effects.
 *
 * @param props - {@link SearchAutocompleteProps}
 *
 * @example
 * <SearchAutocomplete
 *   items={suggestions}
 *   inputValue={query}
 *   onInputChange={setQuery}
 *   onSelect={(id) => router.push(`/courses/${id}`)}
 *   isLoading={isFetching}
 * />
 *
 * @see Story: .storybook/stories/blocks/form/SearchAutocomplete/SearchAutocomplete.stories
 */
export const SearchAutocomplete = ({
    items,
    inputValue,
    onInputChange,
    onSelect,
    placeholder = "Tìm khoá học, chủ đề...",
    isLoading = false,
    emptyLabel = "Không có gợi ý nào",
    className,
}: SearchAutocompleteProps) => {
    // ComboBox reports the picked key; forward its id to the parent (ignore null,
    // which fires when the selection is cleared).
    const onSelectionChange = (key: React.Key | null) => {
        if (key !== null) {
            onSelect(String(key))
        }
    }

    return (
        <ComboBox
            aria-label={placeholder}
            className={cn("w-full sm:max-w-sm", className)}
            variant="secondary"
            allowsEmptyCollection
            items={items}
            inputValue={inputValue}
            onInputChange={onInputChange}
            onSelectionChange={onSelectionChange}
        >
            <ComboBox.InputGroup className="relative">
                <Input
                    type="search"
                    placeholder={placeholder}
                    // leading icon rides in the padding; the RAC Input owns the value
                    className="pl-9"
                />
                <MagnifyingGlassIcon className="text-muted pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2" />
            </ComboBox.InputGroup>
            <ComboBox.Popover>
                <ListBox
                    // empty the collection while loading so `renderEmptyState` shows
                    // the spinner instead of a stale list
                    items={isLoading ? [] : items}
                    className="max-h-72 overflow-auto p-1"
                    renderEmptyState={() =>
                        isLoading ? (
                            <div className="flex items-center justify-center gap-2 px-3 py-6">
                                <Spinner size="sm" />
                                <Typography type="body-sm" color="muted">
                                    Đang tìm...
                                </Typography>
                            </div>
                        ) : (
                            <div className="px-3 py-6 text-center">
                                <Typography type="body-sm" color="muted">
                                    {emptyLabel}
                                </Typography>
                            </div>
                        )
                    }
                >
                    {(item: SearchAutocompleteItem) => (
                        <ListBoxItem
                            id={item.id}
                            textValue={item.label}
                            className="flex flex-col items-start"
                        >
                            <Typography type="body-sm">{item.label}</Typography>
                            {item.description ? (
                                <Typography type="body-xs" color="muted">
                                    {item.description}
                                </Typography>
                            ) : null}
                        </ListBoxItem>
                    )}
                </ListBox>
            </ComboBox.Popover>
        </ComboBox>
    )
}
