import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

export const useQueryCheckEmailExistsSwr = () => {
    const { queryCheckEmailExistsSwr } = use(SwrContext)!
    return queryCheckEmailExistsSwr
}
