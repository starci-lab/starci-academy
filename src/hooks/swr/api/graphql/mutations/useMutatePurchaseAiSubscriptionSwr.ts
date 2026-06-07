import {
    mutatePurchaseAiSubscription,
    type PurchaseAiSubscriptionRequest,
} from "@/modules/api"
import useSWRMutation from "swr/mutation"

type MutatePurchaseAiSubscriptionResult = Awaited<ReturnType<typeof mutatePurchaseAiSubscription>>

/**
 * SWR mutation wrapper for {@link mutatePurchaseAiSubscription} (Bearer from Keycloak).
 */
export const useMutatePurchaseAiSubscriptionSwr = () => {
    /** The SWR mutation. */
    const swr = useSWRMutation<
        MutatePurchaseAiSubscriptionResult,
        Error,
        string,
        PurchaseAiSubscriptionRequest
    >(
        "MUTATE_PURCHASE_AI_SUBSCRIPTION_SWR",
        async (_key, { arg }) => {
            return mutatePurchaseAiSubscription({
                request: arg,
            })
        }
    )
    /** Return the SWR mutation. */
    return swr
}
