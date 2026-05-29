import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR singleton for the milestone task progress query.
 * @returns the SWR query handle from {@link SwrContext}.
 */
export const useQueryMilestoneTaskProgressSwr = () => {
    const { queryMilestoneTaskProgressSwr } = use(SwrContext)!
    return queryMilestoneTaskProgressSwr
}
