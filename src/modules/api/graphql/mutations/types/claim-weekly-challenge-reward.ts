import type { GraphQLResponse } from "../../types"

/** Payload of a successful `claimWeeklyChallengeReward` mutation. */
export interface ClaimWeeklyChallengeRewardData {
    /** Coin amount granted by this claim. */
    coinReward: number
    /** The user's Coin balance after the grant. */
    balance: number
}

/** Apollo response shape for `claimWeeklyChallengeReward`. */
export interface MutateClaimWeeklyChallengeRewardResponse {
    /** Top-level `claimWeeklyChallengeReward` field wrapping the standard API response. */
    claimWeeklyChallengeReward: GraphQLResponse<ClaimWeeklyChallengeRewardData>
}
