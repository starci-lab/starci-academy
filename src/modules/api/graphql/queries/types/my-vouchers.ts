import type { GraphQLResponse } from "../../types"

/** A Coin-shop voucher owned by the viewer. */
export interface QueryMyVoucherData {
    /** The voucher row id. */
    id: string
    /** The redeemable code (submit this at checkout). */
    code: string
    /** Percent-off or flat-VND-off. */
    discountType: string
    /** Percent (0-100) or flat VND amount, per discountType. */
    value: number
    /** Course this voucher discounts; null = redeemable against any course. */
    courseId: string | null
    /** Title of the scoped course; null = any course. */
    courseTitle: string | null
    /** Display id (slug) of the scoped course, for deep-linking; null = any course. */
    courseDisplayId: string | null
    /** Lifecycle status — unused / reserved / used / expired. */
    status: string
    /** ISO timestamp the voucher stops being redeemable. */
    expiresAt: string
    /** ISO timestamp the voucher was spent; null until used. */
    usedAt: string | null
    /** ISO timestamp the voucher was minted. */
    createdAt: string
}

/** Apollo response shape for the `myVouchers` query. */
export interface QueryMyVouchersResponse {
    /** Top-level `myVouchers` field wrapping the standard API response. */
    myVouchers: GraphQLResponse<QueryMyVoucherData[]>
}
