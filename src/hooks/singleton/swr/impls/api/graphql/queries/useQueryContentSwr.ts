import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR singleton for the single content query.
 * @returns the SWR query handle from {@link SwrContext}.
 */
export const useQueryContentSwr = () => {
    const { queryContentSwr } = use(SwrContext)!
    return queryContentSwr
}
