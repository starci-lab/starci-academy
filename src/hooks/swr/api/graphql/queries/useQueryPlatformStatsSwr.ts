import { queryPlatformStats } from "@/modules/api"
import type { PlatformStatsData } from "@/modules/api"
import useSWR from "swr"

/**
 * Loads public platform-wide counters (learners / lessons / courses / badges)
 * for the landing stat strip. Public — works for anonymous viewers. The caller
 * hides the strip on error/empty rather than rendering zeros.
 */
export const useQueryPlatformStatsSwr = () => {
    const swr = useSWR<PlatformStatsData>(
        ["QUERY_PLATFORM_STATS_SWR"],
        async () => {
            const { data } = await queryPlatformStats({})
            const envelope = data?.platformStats
            const inner = envelope?.data
            if (!envelope?.success || !inner) {
                throw new Error(
                    envelope?.error ?? envelope?.message ?? "Platform stats not found",
                )
            }
            return inner
        },
    )
    return swr
}
