import type { MutateParams } from "../types"
import { createAuthApolloClient } from "../clients"
import { DocumentNode, gql } from "@apollo/client"
import type { MutateClaimWeeklyChallengeRewardResponse } from "./types/claim-weekly-challenge-reward"

const mutation1 = gql`
  mutation ClaimWeeklyChallengeReward {
    claimWeeklyChallengeReward {
      success
      message
      error
      data {
        coinReward
        balance
      }
    }
  }
`

export enum MutationClaimWeeklyChallengeReward {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationClaimWeeklyChallengeReward, DocumentNode> = {
    [MutationClaimWeeklyChallengeReward.Mutation1]: mutation1,
}

/** Apollo params for {@link mutateClaimWeeklyChallengeReward}. */
export type MutateClaimWeeklyChallengeRewardParams = Omit<
    MutateParams<MutationClaimWeeklyChallengeReward, never>,
    "request"
> & { request?: never }

/**
 * Claims the viewer's coin reward for passing the current week's featured
 * challenge. Mirrors `claimWeeklyChallengeReward`
 * (mutations/profile/claim-weekly-challenge-reward).
 */
export const mutateClaimWeeklyChallengeReward = async ({
    mutation = MutationClaimWeeklyChallengeReward.Mutation1,
    debug,
    signal,
}: MutateClaimWeeklyChallengeRewardParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        signal,
    })

    return apollo.mutate<MutateClaimWeeklyChallengeRewardResponse>({
        mutation: mutationMap[mutation],
    })
}
