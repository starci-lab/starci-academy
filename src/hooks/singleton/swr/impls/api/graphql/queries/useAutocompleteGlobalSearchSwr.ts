import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

export const useAutocompleteGlobalSearchSwr = () => {
    const { autocompleteGlobalSearchSwr } = use(SwrContext)!
    return autocompleteGlobalSearchSwr
}
