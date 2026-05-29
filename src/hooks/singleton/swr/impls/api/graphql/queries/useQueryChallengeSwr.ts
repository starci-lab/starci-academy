import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR singleton for the single challenge query.
 * @returns the SWR query handle from {@link SwrContext}.
 */
export const useQueryChallengeSwr = () => {
    const { queryChallengeSwr } = use(SwrContext)!
    return queryChallengeSwr
}
