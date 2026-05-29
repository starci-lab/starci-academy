import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR singleton for the paginated courses query.
 * @returns the courses SWR handle from {@link SwrContext}.
 */
export const useQueryCoursesSwr = () => {
    const { queryCoursesSwr } = use(SwrContext)!
    return queryCoursesSwr
}
