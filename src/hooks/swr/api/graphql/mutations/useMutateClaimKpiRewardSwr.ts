import useSWRMutation from "swr/mutation"
import { mutateClaimKpiReward } from "@/modules/api/graphql/mutations/mutation-claim-kpi-reward"
import { type ClaimKpiRewardRequest } from "@/modules/api/graphql/mutations/types/claim-kpi-reward"

type MutateClaimKpiRewardResult = Awaited<ReturnType<typeof mutateClaimKpiReward>>

/**
 * SWR mutation wrapper for {@link mutateClaimKpiReward} (Bearer from Keycloak).
 */
export const useMutateClaimKpiRewardSwr = () => {
    /** The SWR mutation. */
    const swr = useSWRMutation<
        MutateClaimKpiRewardResult,
        Error,
        string,
        ClaimKpiRewardRequest
    >(
        "MUTATE_CLAIM_KPI_REWARD_SWR",
        async (_key, { arg }) => {
            return mutateClaimKpiReward({
                request: arg,
            })
        }
    )
    /** Return the SWR mutation. */
    return swr
}
