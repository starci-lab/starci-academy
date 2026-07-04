import useSWR from "swr"
import { queryMyJobReadiness } from "@/modules/api/graphql/queries/query-my-job-readiness"
import type { QueryUserJobReadinessData } from "@/modules/api/graphql/queries/types/user-job-readiness"
import { useAppSelector } from "@/redux/hooks"

/**
 * SWR hook for the authenticated viewer's own job-readiness snapshot (global
 * foundation + one depth-card per purchased course track) — the self-scoped
 * sibling of {@link useQueryUserJobReadinessSwr}, with no `userId` argument.
 * User-scoped — only runs once the viewer is authenticated. Returns null when
 * the viewer has nothing to show yet.
 *
 * @returns the SWR handle (data = `{ foundation, tracks }`, or null)
 */
export const useQueryMyJobReadinessSwr = () => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const swr = useSWR(
        authenticated ? ["QUERY_MY_JOB_READINESS_SWR"] : null,
        async (): Promise<QueryUserJobReadinessData | null> => {
            const data = await queryMyJobReadiness({})
            if (!data || !data.data) {
                throw new Error("Failed to fetch my job readiness")
            }
            return data.data.myJobReadiness?.data ?? null
        },
    )
    return swr
}
