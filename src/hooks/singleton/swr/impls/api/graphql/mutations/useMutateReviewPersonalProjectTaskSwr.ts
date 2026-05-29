import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR mutation singleton for reviewing a personal project task.
 * @returns the SWR mutation handle from {@link SwrContext}.
 */
export const useMutateReviewPersonalProjectTaskSwr = () => {
    const { mutateReviewPersonalProjectTaskSwr } = use(SwrContext)!
    return mutateReviewPersonalProjectTaskSwr
}
