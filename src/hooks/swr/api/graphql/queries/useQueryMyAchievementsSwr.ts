import { queryMyAchievements } from "@/modules/api"
import type { QueryMyAchievementItemData } from "@/modules/api"
import { useAppSelector } from "@/redux"
import useSWR from "swr"

/**
 * SWR wrapper for {@link queryMyAchievements}. `data` is every achievement with
 * the viewer's earned status + live progress, or `[]`. User-scoped — only runs
 * once authenticated. (The backend awards-on-read, so opening this grants any
 * newly-qualified badge.)
 */
export const useQueryMyAchievementsSwr = () => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    return useSWR<Array<QueryMyAchievementItemData>>(
        authenticated ? ["QUERY_MY_ACHIEVEMENTS_SWR"] : null,
        async () => {
            // unwrap the standard API envelope; empty list when absent
            const result = await queryMyAchievements({})
            return result.data?.myAchievements?.data ?? []
        },
    )
}
