import { queryActiveAdvertisement } from "@/modules/api"
import useSWR from "swr"

/**
 * SWR query wrapper for {@link queryActiveAdvertisement}. `data` is the active
 * banner for the dashboard right rail, or `null` when none is active. Global
 * content (same for everyone) — runs unconditionally.
 */
export const useQueryActiveAdvertisementSwr = () => {
    return useSWR(
        ["QUERY_ACTIVE_ADVERTISEMENT_SWR"],
        async () => {
            const data = await queryActiveAdvertisement({})
            return data.data?.activeAdvertisement?.data ?? null
        },
    )
}
