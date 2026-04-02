import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

export const useQueryLessonVideoSwr = () => {
    const { queryLessonVideo } = use(SwrContext)!
    return queryLessonVideo
}
