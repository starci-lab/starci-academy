import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR singleton for global search autocomplete.
 * @returns the SWR query handle from {@link SwrContext}.
 */
export const useAutocompleteGlobalSearchSwr = () => {
    const { autocompleteGlobalSearchSwr } = use(SwrContext)!
    return autocompleteGlobalSearchSwr
}
