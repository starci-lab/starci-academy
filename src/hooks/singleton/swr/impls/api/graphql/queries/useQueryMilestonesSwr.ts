import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR singleton for the milestones list query.
 * @returns the SWR query handle from {@link SwrContext}.
 */
export const useQueryMilestonesSwr = () => {
    const { queryMilestonesSwr } = use(SwrContext)!
    return queryMilestonesSwr
}
