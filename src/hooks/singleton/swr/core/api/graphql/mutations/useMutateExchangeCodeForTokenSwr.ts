import {
    AbortableRequest,
    mutateExchangeCodeForToken,
    type ExchangeCodeForTokenRequest,
} from "@/modules/api"
import useSWRMutation from "swr/mutation"

type MutateExchangeCodeForTokenResult = Awaited<
    ReturnType<typeof mutateExchangeCodeForToken>
>

/**
 * SWR mutation wrapper for {@link mutateExchangeCodeForToken} (OIDC code → Keycloak tokens; no Bearer).
 */
export const useMutateExchangeCodeForTokenSwrCore = () => {
    const swr = useSWRMutation<
        MutateExchangeCodeForTokenResult,
        Error,
        string,
        AbortableRequest<ExchangeCodeForTokenRequest>
    >(
        "MUTATE_EXCHANGE_CODE_FOR_TOKEN_SWR",
        async (_key, { arg }) => {
            if (!arg.request) {
                throw new Error("Request is required")
            }
            return mutateExchangeCodeForToken(
                { 
                    request: arg.request,
                    signal: arg.signal,
                })
        }
    )
    return swr
}