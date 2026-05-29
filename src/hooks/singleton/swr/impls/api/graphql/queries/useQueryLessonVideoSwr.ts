import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR singleton for the single lesson-video query.
 * @returns the SWR query handle from {@link SwrContext}.
 */
export const useQueryLessonVideoSwr = () => {
    const { queryLessonVideo } = use(SwrContext)!
    return queryLessonVideo
}
