import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

export const useQueryLivestreamSessionsSwr = () => {
    const { queryLivestreamSessionsSwr } = use(SwrContext)!
    return queryLivestreamSessionsSwr
}
