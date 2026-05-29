import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR singleton for the headhunter companies query.
 * @returns the SWR query handle from {@link SwrContext}.
 */
export const useQueryHeadhunterCompaniesSwr = () => {
    const { queryHeadhunterCompaniesSwr } = use(SwrContext)!
    return queryHeadhunterCompaniesSwr
}
