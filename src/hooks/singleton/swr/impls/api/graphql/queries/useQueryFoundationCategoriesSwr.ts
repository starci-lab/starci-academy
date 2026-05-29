import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR singleton for the foundation categories query.
 * @returns the SWR query handle from {@link SwrContext}.
 */
export const useQueryFoundationCategoriesSwr = () => {
    const { queryFoundationCategoriesSwr } = use(SwrContext)!
    return queryFoundationCategoriesSwr
}
