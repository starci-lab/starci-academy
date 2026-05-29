import { queryAiSubscriptionTiers } from "@/modules/api"
import useSWR from "swr"

/**
 * SWR query wrapper for {@link queryAiSubscriptionTiers}. `data` is the tier
 * array (empty when none are enabled).
 */
export const useQueryAiSubscriptionTiersSwrCore = () => {
    const swr = useSWR(
        ["QUERY_AI_SUBSCRIPTION_TIERS_SWR"],
        async () => {
            const data = await queryAiSubscriptionTiers({})

            if (!data || !data.data) {
                throw new Error("Failed to fetch AI subscription tiers")
            }

            return data.data.aiSubscriptionTiers?.data?.tiers ?? []
        },
    )

    return swr
}
