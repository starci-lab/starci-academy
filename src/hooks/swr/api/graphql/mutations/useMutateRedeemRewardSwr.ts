import {
    mutateRedeemReward,
    type RedeemRewardRequest,
} from "@/modules/api"
import useSWRMutation from "swr/mutation"

type MutateRedeemRewardResult = Awaited<ReturnType<typeof mutateRedeemReward>>

/**
 * SWR mutation wrapper for {@link mutateRedeemReward} (Bearer from Keycloak).
 * Takes the reward key to redeem.
 */
export const useMutateRedeemRewardSwr = () => {
    /** The SWR mutation. */
    const swr = useSWRMutation<
        MutateRedeemRewardResult,
        Error,
        string,
        RedeemRewardRequest
    >(
        "MUTATE_REDEEM_REWARD_SWR",
        async (_key, { arg }) => {
            return mutateRedeemReward({
                request: arg,
            })
        }
    )
    /** Return the SWR mutation. */
    return swr
}
