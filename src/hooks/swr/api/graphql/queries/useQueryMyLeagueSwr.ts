import { queryMyLeague } from "@/modules/api"
import type { QueryMyLeagueData } from "@/modules/api"
import { useAppSelector } from "@/redux"
import useSWR from "swr"

/**
 * SWR wrapper for {@link queryMyLeague}. `data` is the viewer's weekly-league
 * standing (tier + ranked cohort), or `null`. User-scoped — only runs once
 * authenticated. The backend lazily places never-seen users into Bronze.
 */
export const useQueryMyLeagueSwr = () => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    return useSWR<QueryMyLeagueData | null>(
        authenticated ? ["QUERY_MY_LEAGUE_SWR"] : null,
        async () => {
            // unwrap the standard API envelope; null when absent
            const result = await queryMyLeague({})
            return result.data?.myLeague?.data ?? null
        },
    )
}
