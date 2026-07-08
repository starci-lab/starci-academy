import useSWR from "swr"
import { queryMyVouchers } from "@/modules/api/graphql/queries/query-my-vouchers"
import type { QueryMyVoucherData } from "@/modules/api/graphql/queries/types/my-vouchers"
import { useAppSelector } from "@/redux/hooks"

/**
 * SWR wrapper for {@link queryMyVouchers}. `data` is the viewer's Coin-shop
 * vouchers (newest first), or `null`. User-scoped — only runs once the viewer
 * is authenticated. Shares its key with nothing else — mutate directly after a
 * `voucher`-kind redemption to refresh the "Ví của tôi" list.
 */
export const useQueryMyVouchersSwr = () => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    return useSWR<QueryMyVoucherData[] | null>(
        authenticated ? ["QUERY_MY_VOUCHERS_SWR"] : null,
        async () => {
            // unwrap the standard API envelope; null when absent
            const result = await queryMyVouchers({})
            return result.data?.myVouchers?.data ?? null
        },
    )
}
