import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

export const useQueryContentStatusSwr = () => {
    const { queryContentStatusSwr } = use(SwrContext)!
    return queryContentStatusSwr
}
