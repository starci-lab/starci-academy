import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR singleton for the paginated modules query.
 * @returns the SWR query handle from {@link SwrContext}.
 */
export const useQueryModulesSwr = () => {
    const { queryModulesSwr } = use(SwrContext)!
    return queryModulesSwr
}
