import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR singleton for the paginated challenges query.
 * @returns the SWR query handle from {@link SwrContext}.
 */
export const useQueryChallengesSwr = () => {
    const { queryChallengesSwr } = use(SwrContext)!
    return queryChallengesSwr
}
