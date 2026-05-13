import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

export const useQueryCvUrlSwr = () => {
    const { queryCvUrlSwr } = use(SwrContext)!
    return queryCvUrlSwr
}
