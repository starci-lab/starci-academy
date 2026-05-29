import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR singleton for the content status query.
 * @returns the SWR query handle from {@link SwrContext}.
 */
export const useQueryContentStatusSwr = () => {
    const { queryContentStatusSwr } = use(SwrContext)!
    return queryContentStatusSwr
}
