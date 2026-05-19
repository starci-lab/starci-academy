import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

export const useQueryFoundationsSwr = () => {
    const { queryFoundationsSwr } = use(SwrContext)!
    return queryFoundationsSwr
}
