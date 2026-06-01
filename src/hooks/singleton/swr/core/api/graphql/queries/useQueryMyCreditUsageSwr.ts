import { queryMyCreditUsage } from "@/modules/api"
import { useAppSelector } from "@/redux"
import useSWR from "swr"

/**
 * SWR query wrapper for {@link queryMyCreditUsage}. `data` is the unwrapped
 * credit usage snapshot (used / quota / remaining / overQuota), or `null`.
 * Runs only once the user is authenticated.
 */
export const useQueryMyCreditUsageSwrCore = () => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const swr = useSWR(
        authenticated ? ["QUERY_MY_CREDIT_USAGE_SWR"] : null,
        async () => {
            const data = await queryMyCreditUsage({})

            if (!data || !data.data) {
                throw new Error("Failed to fetch credit usage")
            }

            return data.data.myCreditUsage?.data ?? null
        },
    )

    return swr
}
