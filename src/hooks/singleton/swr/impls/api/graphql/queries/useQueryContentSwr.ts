import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

export const useQueryContentSwr = () => {
    const { queryContentSwr } = use(SwrContext)!
    return queryContentSwr
}
