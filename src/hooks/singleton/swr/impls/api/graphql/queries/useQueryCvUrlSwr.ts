import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR singleton for the CV URL query.
 * @returns the SWR query handle from {@link SwrContext}.
 */
export const useQueryCvUrlSwr = () => {
    const { queryCvUrlSwr } = use(SwrContext)!
    return queryCvUrlSwr
}
