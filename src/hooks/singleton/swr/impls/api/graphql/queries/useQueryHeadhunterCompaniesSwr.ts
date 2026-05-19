import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

export const useQueryHeadhunterCompaniesSwr = () => {
    const { queryHeadhunterCompaniesSwr } = use(SwrContext)!
    return queryHeadhunterCompaniesSwr
}
