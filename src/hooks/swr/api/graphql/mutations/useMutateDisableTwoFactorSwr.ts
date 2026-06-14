import {
    mutateDisableTwoFactor,
    type DisableTwoFactorRequest,
} from "@/modules/api"
import useSWRMutation from "swr/mutation"

type MutateDisableTwoFactorResult = Awaited<ReturnType<typeof mutateDisableTwoFactor>>

/**
 * SWR mutation wrapper for {@link mutateDisableTwoFactor} (Bearer from Keycloak).
 */
export const useMutateDisableTwoFactorSwr = () => {
    /** The SWR mutation. */
    const swr = useSWRMutation<
        MutateDisableTwoFactorResult,
        Error,
        string,
        DisableTwoFactorRequest
    >(
        "MUTATE_DISABLE_TWO_FACTOR_SWR",
        async (_key, { arg }) => {
            return mutateDisableTwoFactor({
                request: arg,
            })
        }
    )
    /** Return the SWR mutation. */
    return swr
}
