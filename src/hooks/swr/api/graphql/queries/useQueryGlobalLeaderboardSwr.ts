import { queryGlobalLeaderboard } from "@/modules/api"
import type { QueryGlobalLeaderboardData } from "@/modules/api"
import { useAppSelector } from "@/redux"
import useSWR from "swr"

/**
 * SWR wrapper for {@link queryGlobalLeaderboard}. `data` is the global points
 * leaderboard (top users + the viewer's own rank), or `null`. User-scoped —
 * only runs once authenticated.
 */
export const useQueryGlobalLeaderboardSwr = () => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    return useSWR<QueryGlobalLeaderboardData | null>(
        authenticated ? ["QUERY_GLOBAL_LEADERBOARD_SWR"] : null,
        async () => {
            // unwrap the standard API envelope; null when absent
            const result = await queryGlobalLeaderboard({})
            return result.data?.globalLeaderboard?.data ?? null
        },
    )
}
