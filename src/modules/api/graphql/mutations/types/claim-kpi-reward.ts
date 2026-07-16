import type { GraphQLResponse } from "../../types"
import type { KpiKey } from "../../queries/types/my-kpis"

/** GraphQL `ClaimKpiRewardRequest` body. */
export interface ClaimKpiRewardRequest {
    /** Which KPI to claim the reward for. */
    key: KpiKey
}

/** Payload of a successful `claimKpiReward` mutation. */
export interface ClaimKpiRewardData {
    /** Coin amount granted by this claim. */
    coinReward: number
    /** The user's Coin balance after the grant. */
    balance: number
}

/** Apollo response shape for `claimKpiReward`. */
export interface MutateClaimKpiRewardResponse {
    /** Top-level `claimKpiReward` field wrapping the standard API response. */
    claimKpiReward: GraphQLResponse<ClaimKpiRewardData>
}
