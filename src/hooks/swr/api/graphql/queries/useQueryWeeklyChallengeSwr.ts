import { queryWeeklyChallenge } from "@/modules/api"
import type { QueryWeeklyChallengeData } from "@/modules/api"
import { useAppSelector } from "@/redux"
import useSWR from "swr"

/**
 * SWR wrapper for {@link queryWeeklyChallenge}. `data` is the featured weekly
 * challenge event, or `null` when none is active. User-scoped — only runs once
 * the viewer is authenticated.
 */
export const useQueryWeeklyChallengeSwr = () => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    return useSWR<QueryWeeklyChallengeData | null>(
        authenticated ? ["QUERY_WEEKLY_CHALLENGE_SWR"] : null,
        async () => {
            // unwrap the standard API envelope; null when absent
            const result = await queryWeeklyChallenge({})
            return result.data?.weeklyChallenge?.data ?? null
        },
    )
}
