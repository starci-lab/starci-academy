import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR singleton for the foundations list query.
 * @returns the SWR query handle from {@link SwrContext}.
 */
export const useQueryFoundationsSwr = () => {
    const { queryFoundationsSwr } = use(SwrContext)!
    return queryFoundationsSwr
}
