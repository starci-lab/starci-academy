import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * SWR status for the milestone-task-by-id query (loading, error, revalidation).
 * Task body is kept in Redux as `milestone.selectedTaskDetail` (hydrated by the core hook).
 */
export const useQueryMilestoneTaskSwr = () => {
    const { queryMilestoneTaskSwr } = use(SwrContext)!
    return {
        isLoading: queryMilestoneTaskSwr.isLoading,
        isValidating: queryMilestoneTaskSwr.isValidating,
        error: queryMilestoneTaskSwr.error,
        mutate: queryMilestoneTaskSwr.mutate,
    }
}
