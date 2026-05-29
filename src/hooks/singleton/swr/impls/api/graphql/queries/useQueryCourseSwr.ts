import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR singleton for the single course query.
 * @returns the SWR query handle from {@link SwrContext}.
 */
export const useQueryCourseSwr = () => {
    const { queryCourseSwr } = use(SwrContext)!
    return queryCourseSwr
}
