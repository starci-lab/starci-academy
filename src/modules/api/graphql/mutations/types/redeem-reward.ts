import type { GraphQLResponse } from "../../types"

/** GraphQL `RedeemRewardRequest` body. */
export interface RedeemRewardRequest {
    /** Key of the reward to redeem (e.g. `streakFreeze`). */
    rewardKey: string
    /** Recipient name — physical rewards only (shipping). */
    recipientName?: string
    /** Contact phone — physical rewards only (shipping). */
    phone?: string
    /** Shipping address — physical rewards only. */
    address?: string
}

/** The bonus AI credit granted by redeeming an `aiCredit`-kind reward. */
export interface RedeemRewardAiCreditGrant {
    /** Bonus credit added to the current 5h window. */
    amount5h: number
    /** Bonus credit added to the current weekly window. */
    amountWeek: number
}

/** Payload inside `redeemReward.data` after the standard API wrapper. */
export interface RedeemRewardData {
    /** The viewer's remaining Coin balance after the redemption. */
    balance: number
    /** The viewer's owned streak-freeze count after the redemption. */
    streakFreezes: number
    /** The freshly-minted voucher code, when redeeming a `voucher`-kind reward. */
    voucherCode?: string | null
    /** The bonus credit granted, when redeeming an `aiCredit`-kind reward. */
    aiCreditGranted?: RedeemRewardAiCreditGrant | null
}

/** Apollo response shape for `redeemReward`. */
export interface MutateRedeemRewardResponse {
    /** Top-level `redeemReward` field wrapping the standard API response. */
    redeemReward: GraphQLResponse<RedeemRewardData>
}
