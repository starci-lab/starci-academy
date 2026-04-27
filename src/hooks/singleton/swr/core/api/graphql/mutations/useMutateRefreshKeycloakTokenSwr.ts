import {
    mutateRefreshKeycloakToken,
    type RefreshKeycloakTokenRequest,
} from "@/modules/api"
import useSWRMutation from "swr/mutation"

type MutateRefreshKeycloakTokenResult = Awaited<
    ReturnType<typeof mutateRefreshKeycloakToken>
>

/**
 * SWR mutation wrapper for {@link mutateRefreshKeycloakToken} (refresh token in body; no Bearer).
 */
export const useMutateRefreshKeycloakTokenSwrCore = () => {
    const swr = useSWRMutation<
        MutateRefreshKeycloakTokenResult,
        Error,
        string,
        RefreshKeycloakTokenRequest
    >(
        "MUTATE_REFRESH_KEYCLOAK_TOKEN_SWR",
        async (_key, { arg }) => mutateRefreshKeycloakToken({ request: arg })
    )
    return swr
}
