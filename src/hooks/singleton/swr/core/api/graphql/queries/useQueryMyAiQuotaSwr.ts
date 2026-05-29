import { queryMyAiQuota } from "@/modules/api"
import useSWR from "swr"

/**
 * SWR query wrapper for {@link queryMyAiQuota}. `data` is the unwrapped quota
 * snapshot payload (or `null` when absent).
 */
export const useQueryMyAiQuotaSwrCore = () => {
    const swr = useSWR(
        ["QUERY_MY_AI_QUOTA_SWR"],
        async () => {
            const data = await queryMyAiQuota({})

            if (!data || !data.data) {
                throw new Error("Failed to fetch AI quota")
            }

            return data.data.myAiQuota?.data ?? null
        },
    )

    return swr
}
