import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR singleton for the paginated contents query.
 * @returns the SWR query handle from {@link SwrContext}.
 */
export const useQueryContentsSwr = () => {
    const { queryContentsSwr } = use(SwrContext)!
    return queryContentsSwr
}
