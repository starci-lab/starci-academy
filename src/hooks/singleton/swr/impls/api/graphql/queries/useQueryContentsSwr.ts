import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

export const useQueryContentsSwr = () => {
    const { queryContentsSwr } = use(SwrContext)!
    return queryContentsSwr
}
