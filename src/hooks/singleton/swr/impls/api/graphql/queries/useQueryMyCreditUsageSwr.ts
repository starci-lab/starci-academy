import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR singleton for the my-credit-usage query.
 * @returns the my-credit-usage SWR handle from {@link SwrContext}.
 */
export const useQueryMyCreditUsageSwr = () => {
    const { queryMyCreditUsageSwr } = use(SwrContext)!
    return queryMyCreditUsageSwr
}
