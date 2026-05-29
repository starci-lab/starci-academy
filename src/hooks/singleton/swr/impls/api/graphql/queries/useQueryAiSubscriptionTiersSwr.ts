import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR singleton for the AI subscription tiers query.
 * @returns the AI-subscription-tiers SWR handle from {@link SwrContext}.
 */
export const useQueryAiSubscriptionTiersSwr = () => {
    const { queryAiSubscriptionTiersSwr } = use(SwrContext)!
    return queryAiSubscriptionTiersSwr
}
