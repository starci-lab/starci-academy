import type { MutateParams } from "../types"
import { createAuthApolloClient } from "../clients"
import { DocumentNode, gql } from "@apollo/client"
import type { ClaimKpiRewardRequest, MutateClaimKpiRewardResponse } from "./types/claim-kpi-reward"

const mutation1 = gql`
  mutation ClaimKpiReward($request: ClaimKpiRewardRequest!) {
    claimKpiReward(request: $request) {
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

export enum MutationClaimKpiReward {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationClaimKpiReward, DocumentNode> = {
    [MutationClaimKpiReward.Mutation1]: mutation1,
}

/** Apollo params for {@link mutateClaimKpiReward}. */
export type MutateClaimKpiRewardParams = MutateParams<
    MutationClaimKpiReward,
    ClaimKpiRewardRequest
>

/**
 * Claims the viewer's coin reward for one weekly KPI whose floor target has
 * been met this week.
 *
 * Mirrors `claimKpiReward` (mutations/profile/claim-kpi-reward).
 */
export const mutateClaimKpiReward = async ({
    mutation = MutationClaimKpiReward.Mutation1,
    request,
    debug,
    signal,
}: MutateClaimKpiRewardParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        signal,
    })

    return apollo.mutate<MutateClaimKpiRewardResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
