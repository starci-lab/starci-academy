import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR singleton for the headhunters list query.
 * @returns the SWR query handle from {@link SwrContext}.
 */
export const useQueryHeadhuntersSwr = () => {
    const { queryHeadhuntersSwr } = use(SwrContext)!
    return queryHeadhuntersSwr
}
