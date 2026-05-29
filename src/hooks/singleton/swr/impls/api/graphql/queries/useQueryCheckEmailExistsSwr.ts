import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR singleton for checking email existence (Bloom filter).
 * @returns the SWR query handle from {@link SwrContext}.
 */
export const useQueryCheckEmailExistsSwr = () => {
    const { queryCheckEmailExistsSwr } = use(SwrContext)!
    return queryCheckEmailExistsSwr
}
