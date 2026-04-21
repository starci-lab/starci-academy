import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

export const useQueryCvReviewHistorySwr = () => {
    const { queryCvReviewHistorySwr } = use(SwrContext)!
    return queryCvReviewHistorySwr
}
