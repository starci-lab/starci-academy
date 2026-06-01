import {
    queryAiBalancerHealth,
    AI_BALANCER_HEALTH_REFRESH_MS,
} from "@/modules/api"
import {
    useAppSelector,
} from "@/redux"
import useSWR from "swr"

/**
 * SWR query wrapper for {@link queryAiBalancerHealth}.
 *
 * Polls while the user is authenticated. `data` is the unwrapped health snapshot.
 */
export const useQueryAiBalancerHealthSwrCore = () => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)

    const swr = useSWR(
        authenticated
            ? [
                "QUERY_AI_BALANCER_HEALTH_SWR",
            ]
            : null,
        async () => {
            const response = await queryAiBalancerHealth({
            })

            if (!response?.data) {
                throw new Error("Failed to fetch AI balancer health")
            }

            return response.data.aiBalancerHealth?.data ?? null
        },
        {
            refreshInterval: AI_BALANCER_HEALTH_REFRESH_MS,
        },
    )

    return swr
}
