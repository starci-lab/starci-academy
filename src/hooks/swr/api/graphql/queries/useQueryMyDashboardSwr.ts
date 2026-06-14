import { queryMyDashboard } from "@/modules/api"
import { useAppSelector } from "@/redux"
import useSWR from "swr"

/**
 * SWR query wrapper for {@link queryMyDashboard}. `data` is the unwrapped
 * dashboard payload (enrolled courses + AI headline), or `null` when absent.
 * User-scoped — only runs once the viewer is authenticated.
 */
export const useQueryMyDashboardSwr = () => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const swr = useSWR(
        authenticated ? ["QUERY_MY_DASHBOARD_SWR"] : null,
        async () => {
            const data = await queryMyDashboard({})

            if (!data || !data.data) {
                throw new Error("Failed to fetch dashboard")
            }

            return data.data.myDashboard?.data ?? null
        },
    )

    return swr
}
