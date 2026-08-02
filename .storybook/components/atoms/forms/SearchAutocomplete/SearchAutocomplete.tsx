import { MagnifyingGlassIcon } from "@phosphor-icons/react"
import React, { useId, type ReactNode } from "react"
import {
    cn,
    ComboBox,
    Input,
    ListBox,
    ListBoxItem,
    Skeleton as HeroSkeleton,
    Spinner,
    Typography,
} from "@heroui/react"
import { FieldFrame, fieldName } from "@sb-components/atoms/forms/_field/FieldFrame"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * `SearchAutocomplete` — suggest-as-you-type search field on HeroUI `ComboBox`.
 */

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
export interface SearchAutocompleteProps {
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
    /** Placeholder for the empty field. Defaults to "Search courses, topics…". */
    placeholder?: string
    /**
     * When true, a spinner replaces the suggestion list — use it while the parent
     * is fetching results for the current query.
     */
    isLoading?: boolean
    /** Message shown when there are no suggestions. Defaults to "No suggestions". */
    emptyLabel?: string
    /**
     * Renders the loading mirror — a field-box skeleton matching the search
     * field's resting shape. The dropdown has no resting shape, so only the
     * field is mirrored.
     */
    isSkeleton?: boolean
    /** Label above the field. Leave it unset and the field renders bare. */
    label?: ReactNode
    /** Description below the label (always visible, distinct from `errorMessage`). */
    hint?: ReactNode
    /** Error line below the field — set it to show an error border and the error line. */
    errorMessage?: ReactNode
    /** Adds a required `*` mark after the label. */
    isRequired?: boolean
    /** Where this sits inside its parent. Everything about appearance is a prop of its own. */
    classNames?: Array<AllowedClassName>
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
 * @param props - {@link SearchAutocompleteProps}
 */
const SearchAutocompleteBase = ({
    items,
    inputValue,
    onInputChange,
    onSelect,
    placeholder = "Search courses, topics…",
    isLoading = false,
    emptyLabel = "No suggestions",
    isSkeleton = false,
    label,
    hint,
    errorMessage,
    isRequired,
    classNames,
}: SearchAutocompleteProps) => {
    const controlId = useId()
    const invalid = errorMessage != null

    // ComboBox reports the picked key; forward its id to the parent (ignore null,
    // which fires when the selection is cleared).
    const onSelectionChange = (key: React.Key | null) => {
        if (key !== null) {
            onSelect(String(key))
        }
    }

    return (
        <FieldFrame
            label={label}
            hint={hint}
            errorMessage={errorMessage}
            isRequired={isRequired}
            isSkeleton={isSkeleton}

            id={controlId}
            // Field-box skeleton owned by this atom — mirrors only the search
            // field's resting shape; the popover has no resting shape.
            skeletonControl={
                <HeroSkeleton
                    className={cn("h-9 w-full rounded-xl @app-sm:max-w-sm", classNames)}

                />
            }
        >
            <ComboBox
                data-tier="atom"
                data-component="SearchAutocomplete"
                aria-label={fieldName(label, placeholder)}
                isInvalid={invalid}
                className={cn("w-full @app-sm:max-w-sm", classNames)}
                variant="secondary"
                allowsEmptyCollection
                items={items}
                inputValue={inputValue}
                onInputChange={onInputChange}
                onSelectionChange={onSelectionChange}
            >
                <ComboBox.InputGroup className="relative">
                    <Input
                        id={controlId}
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
                                        Searching…
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
        </FieldFrame>
    )
}

/** `SearchAutocomplete.*` — suggest-as-you-type search field on HeroUI `ComboBox`. */
export { SearchAutocompleteBase as SearchAutocomplete }

export const meta = { tier: "atom", name: "SearchAutocomplete" } as const
