import { queryRewards } from "@/modules/api"
import type { QueryRewardData } from "@/modules/api"
import useSWR from "swr"

/**
 * SWR wrapper for {@link queryRewards}. `data` is the catalog of redeemable
 * rewards (gifts store), or `null`.
 */
export const useQueryRewardsSwr = () => {
    return useSWR<QueryRewardData[] | null>(
        ["QUERY_REWARDS_SWR"],
        async () => {
            // unwrap the standard API envelope; null when absent
            const result = await queryRewards({})
            return result.data?.rewards?.data ?? null
        },
    )
}
