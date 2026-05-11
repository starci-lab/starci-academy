import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

export const useMutateReviewPersonalProjectTaskSwr = () => {
    const { mutateReviewPersonalProjectTaskSwr } = use(SwrContext)!
    return mutateReviewPersonalProjectTaskSwr
}
