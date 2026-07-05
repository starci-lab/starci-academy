import type { GraphQLResponse } from "../../types"

/** The discount a `voucher`-kind reward mints. */
export interface QueryRewardVoucherData {
    /** Percent-off or flat-VND-off. */
    discountType: string
    /** Percent (0-100) or flat VND amount. */
    value: number
    /** Days the minted code stays redeemable after granting. */
    validityDays: number
}

/** The bonus AI credit an `aiCredit`-kind reward grants. */
export interface QueryRewardAiCreditData {
    /** Bonus credit added to the current 5h window. */
    amount5h: number
    /** Bonus credit added to the current weekly window. */
    amountWeek: number
}

/** A single redeemable reward in the Coin shop. */
export interface QueryRewardData {
    /** Stable reward key (e.g. `streakFreeze`), used as the redeem identifier. */
    key: string
    /** Display title. */
    title: string
    /** Short description of what the reward gives. */
    description: string
    /** Cost in Coin. */
    cost: number
    /** Reward kind — `digital` | `physical` | `voucher` | `aiCredit`. */
    kind: string
    /** Present only when `kind === "voucher"`. */
    voucher?: QueryRewardVoucherData | null
    /** Present only when `kind === "aiCredit"`. */
    aiCredit?: QueryRewardAiCreditData | null
}

/** Apollo response shape for the `rewards` query. */
export interface QueryRewardsResponse {
    /** Top-level `rewards` field wrapping the standard API response. */
    rewards: GraphQLResponse<QueryRewardData[]>
}
