import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

export const useQueryMilestonesSwr = () => {
    const { queryMilestonesSwr } = use(SwrContext)!
    return queryMilestonesSwr
}
