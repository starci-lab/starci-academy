import { SlidersHorizontalIcon } from "@phosphor-icons/react"
import React from "react"
import {
    Autocomplete,
    Button,
    cn,
    InputGroup,
    Label,
    ListBox,
    SearchField,
    TextField,
} from "@heroui/react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** One selectable row in the autocomplete list, already localized. */
export interface SearchBarSuggestion {
    /** Stable key forwarded to `ListBox.Item` `id`. */
    id: string
    /** Already-localized suggestion label. */
    label: string
}

/** Props for {@link _SearchBar} — presentational; labels already resolved. */
export interface SearchBarProps extends WithClassNames<undefined> {
    /** Already-localized field label (screen-reader only). */
    fieldLabel: string
    /** Already-localized placeholder text. */
    placeholder: string
    /** Already-localized filters-button aria-label. */
    filtersAriaLabel: string
    /** Demo suggestions shown in the autocomplete dropdown, already localized. */
    suggestionItems: Array<SearchBarSuggestion>
    /** Optional class names on the root `TextField` wrapper. */
    className?: string
}

/**
 * Search field using HeroUI `TextField` + `InputGroup` with an `Autocomplete` on the left
 * and a filters icon button in the suffix (same composition pattern as InputGroup + suffix).
 *
 * @param props - {@link SearchBarProps}
 */
export const _SearchBar = ({ fieldLabel, placeholder, filtersAriaLabel, suggestionItems, className }: SearchBarProps) => (
    <TextField className={cn("w-full", className)} fullWidth variant="secondary">
        <Label className="sr-only">{fieldLabel}</Label>
        <InputGroup className="w-full" variant="secondary">
            <div className="min-w-0 flex-1">
                <Autocomplete
                    allowsEmptyCollection
                    className="w-full"
                    fullWidth
                    placeholder={placeholder}
                    variant="secondary"
                >
                    <Autocomplete.Trigger className="flex h-10 w-full min-w-0 items-center gap-2 rounded-r-none border-0 bg-transparent px-3 shadow-none ring-0">
                        <Autocomplete.Value />
                        <Autocomplete.ClearButton />
                        <Autocomplete.Indicator />
                    </Autocomplete.Trigger>
                    <Autocomplete.Popover>
                        <Autocomplete.Filter>
                            <SearchField className="px-2 pt-2">
                                <SearchField.Group>
                                    <SearchField.SearchIcon />
                                    <SearchField.Input placeholder={placeholder} />
                                </SearchField.Group>
                            </SearchField>
                            <ListBox className="max-h-60 overflow-auto p-1">
                                {suggestionItems.map((item) => (
                                    <ListBox.Item
                                        key={item.id}
                                        id={item.id}
                                        textValue={item.label}
                                    >
                                        {item.label}
                                    </ListBox.Item>
                                ))}
                            </ListBox>
                        </Autocomplete.Filter>
                    </Autocomplete.Popover>
                </Autocomplete>
            </div>
            <InputGroup.Suffix className="pr-0">
                <Button
                    aria-label={filtersAriaLabel}
                    isIconOnly
                    size="sm"
                    variant="ghost"
                >
                    <SlidersHorizontalIcon className="size-5" />
                </Button>
            </InputGroup.Suffix>
        </InputGroup>
    </TextField>
)
