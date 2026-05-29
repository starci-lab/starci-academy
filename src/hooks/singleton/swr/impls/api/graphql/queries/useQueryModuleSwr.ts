import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR singleton for the single module query.
 * @returns the SWR query handle from {@link SwrContext}.
 */
export const useQueryModuleSwr = () => {
    const { queryModuleSwr } = use(SwrContext)!
    return queryModuleSwr
}
