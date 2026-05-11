import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

export const useQueryPublicContentSwr = () => {
    const { queryPublicContentSwr } = use(SwrContext)!
    return queryPublicContentSwr
}
