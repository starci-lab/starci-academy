import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR mutation singleton for purchasing an AI subscription.
 * @returns the purchase-AI-subscription SWR mutation handle from {@link SwrContext}.
 */
export const useMutatePurchaseAiSubscriptionSwr = () => {
    const { mutatePurchaseAiSubscriptionSwr } = use(SwrContext)!
    return mutatePurchaseAiSubscriptionSwr
}
