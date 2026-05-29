import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR singleton for the saved/favorited contents query.
 * @returns the SWR query handle from {@link SwrContext}.
 */
export const useQuerySavedContentsSwr = () => {
    const { querySavedContentsSwr } = use(SwrContext)!
    return querySavedContentsSwr
}
