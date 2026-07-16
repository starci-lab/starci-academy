import useSWRMutation from "swr/mutation"
import { mutateClaimWeeklyChallengeReward } from "@/modules/api/graphql/mutations/mutation-claim-weekly-challenge-reward"

type MutateClaimWeeklyChallengeRewardResult = Awaited<ReturnType<typeof mutateClaimWeeklyChallengeReward>>

/**
 * SWR mutation wrapper for {@link mutateClaimWeeklyChallengeReward} (Bearer
 * from Keycloak). No request body — claims the current week's passed challenge.
 */
export const useMutateClaimWeeklyChallengeRewardSwr = () => {
    /** The SWR mutation. */
    const swr = useSWRMutation<
        MutateClaimWeeklyChallengeRewardResult,
        Error,
        string
    >(
        "MUTATE_CLAIM_WEEKLY_CHALLENGE_REWARD_SWR",
        async () => {
            return mutateClaimWeeklyChallengeReward({})
        },
    )
    /** Return the SWR mutation. */
    return swr
}
