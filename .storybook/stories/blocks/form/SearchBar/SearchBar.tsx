import { SlidersHorizontalIcon } from "@phosphor-icons/react"
import React, { useMemo } from "react"
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

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — full port of `@/components/blocks/form/SearchBar`.
 * Authored in Storybook (not `src`); synced to `src` later. Faithful port of the
 * whole composition + class names; no `@/components` import. The src pulls its
 * copy from next-intl `search.*` — here those strings are inlined literally so
 * the block renders without an i18n provider.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** One selectable row in the autocomplete list (demo data until search is API-driven). */
interface SearchSuggestionItem {
    /** Stable key forwarded to `ListBox.Item` `id`. */
    id: string
    /** Display label (inlined from the `search.suggestions.*` i18n keys). */
    label: string
}

/**
 * Props for the search bar.
 */
export interface SearchBarProps {
    /** Optional class names on the root `TextField` wrapper. */
    className?: string
}

/**
 * Search field using HeroUI `TextField` + `InputGroup` with an `Autocomplete` on the left
 * and a filters icon button in the suffix (same composition pattern as InputGroup + suffix).
 *
 * @param props.className — Merged onto the root `TextField`.
 */
export const SearchBar = ({ className }: SearchBarProps) => {
    const suggestionItems = useMemo<Array<SearchSuggestionItem>>(
        () => [
            { id: "courses", label: "Khoá học" },
            { id: "modules", label: "Học phần" },
            { id: "videos", label: "Video" },
        ],
        []
    )

    return (
        <TextField className={cn("w-full", className)} fullWidth variant="secondary">
            <Label className="sr-only">Tìm kiếm</Label>
            <InputGroup className="w-full" variant="secondary">
                <div className="min-w-0 flex-1">
                    <Autocomplete
                        allowsEmptyCollection
                        className="w-full"
                        fullWidth
                        placeholder="Tìm khoá học, học phần, video..."
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
                                        <SearchField.Input placeholder="Tìm khoá học, học phần, video..." />
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
                        aria-label="Bộ lọc"
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
}
