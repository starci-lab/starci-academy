import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

export const useQueryHeadhuntersSwr = () => {
    const { queryHeadhuntersSwr } = use(SwrContext)!
    return queryHeadhuntersSwr
}
