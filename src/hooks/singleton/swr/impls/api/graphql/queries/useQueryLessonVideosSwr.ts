import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

export const useQueryLessonVideosSwr = () => {
    const { queryLessonVideosSwr } = use(SwrContext)!
    return queryLessonVideosSwr
}
