import {
    Autocomplete,
    AutocompleteProps,
    AutocompleteSection,
    AutocompleteItem
} from "@heroui/react"
import React from "react"

/**
 * StarCiAutocomplete is a component that allows the user to search for content.
 */
export const StarCiAutocomplete = (props: AutocompleteProps) => {
    return <Autocomplete {...props} />
}

/**
 * StarCiAutocompleteSection is a component that allows the user to search for content.
 */
export const StarCiAutocompleteSection = AutocompleteSection

/**
 * StarCiAutocompleteItem is a component that allows the user to search for content.
 */
export const StarCiAutocompleteItem = AutocompleteItem