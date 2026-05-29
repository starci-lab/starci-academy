import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR singleton for the paginated lesson-videos query.
 * @returns the SWR query handle from {@link SwrContext}.
 */
export const useQueryLessonVideosSwr = () => {
    const { queryLessonVideosSwr } = use(SwrContext)!
    return queryLessonVideosSwr
}
