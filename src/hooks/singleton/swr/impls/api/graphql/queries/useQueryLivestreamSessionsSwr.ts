import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR singleton for the livestream sessions query.
 * @returns the SWR query handle from {@link SwrContext}.
 */
export const useQueryLivestreamSessionsSwr = () => {
    const { queryLivestreamSessionsSwr } = use(SwrContext)!
    return queryLivestreamSessionsSwr
}
