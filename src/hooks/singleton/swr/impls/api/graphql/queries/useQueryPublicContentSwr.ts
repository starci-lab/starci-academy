import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR singleton for the public content query.
 * @returns the SWR query handle from {@link SwrContext}.
 */
export const useQueryPublicContentSwr = () => {
    const { queryPublicContentSwr } = use(SwrContext)!
    return queryPublicContentSwr
}
