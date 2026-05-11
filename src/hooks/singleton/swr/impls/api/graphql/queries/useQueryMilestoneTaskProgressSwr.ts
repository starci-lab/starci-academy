import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

export const useQueryMilestoneTaskProgressSwr = () => {
    const { queryMilestoneTaskProgressSwr } = use(SwrContext)!
    return queryMilestoneTaskProgressSwr
}
