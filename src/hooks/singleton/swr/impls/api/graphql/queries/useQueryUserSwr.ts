import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR singleton for the current user query.
 * @returns the SWR query handle from {@link SwrContext}.
 */
export const useQueryUserSwr = () => {
    const { queryUserSwr } = use(SwrContext)!
    return queryUserSwr
}
