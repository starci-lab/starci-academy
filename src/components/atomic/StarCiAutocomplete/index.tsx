import {
    Autocomplete,
    ListBoxItem,
    ListBoxSection,
} from "@heroui/react"
import type { AutocompleteRootProps } from "@heroui/react"
import React from "react"

export const StarCiAutocomplete = <T extends object = object>(props: AutocompleteRootProps<T>) => {
    return <Autocomplete {...props} />
}

export const StarCiAutocompleteItem = ListBoxItem
export const StarCiAutocompleteSection = ListBoxSection
