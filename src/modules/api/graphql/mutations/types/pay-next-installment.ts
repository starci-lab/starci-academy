import type { GraphQLResponse } from "../../types"
import type { PaymentType } from "@/modules/types/enums/payment-type"

/** GraphQL `PayNextInstallmentRequest` body. */
export interface PayNextInstallmentRequest {
    /** Id of the installment plan to pay the current cycle of. */
    planId: string
    /** Payment provider (PayOS / Sepay only, MVP). */
    paymentType: PaymentType
    /** Return URL after successful payment (PayOS). */
    returnUrl?: string
    /** Cancel URL if the user aborts checkout (PayOS). */
    cancelUrl?: string
    /**
     * Custom charge amount — FlexiblePool only (must be >= the current cycle's
     * minimum). Omit to charge exactly the minimum. Rejected for Fixed plans.
     */
    amountVnd?: number
}

/** Payload inside `payNextInstallment.data`. */
export interface PayNextInstallmentData {
    /** Id of the installment plan this checkout pays. */
    planId: string
    /** The checkout URL for the payment. */
    checkoutUrl: string
    /** The reference ID (provider order code) of the transaction. */
    referenceId: string
    /** Primary key of the `transactions` row. */
    transactionId: string
    /** Charged amount for this cycle (VND). */
    amount: number
    /** SePay PG only: JSON of signed fields to POST as a form to `checkoutUrl`. */
    checkoutFields?: string | null
}

/** Apollo response shape for `payNextInstallment`. */
export interface MutatePayNextInstallmentResponse {
    /** Top-level `payNextInstallment` field wrapping the standard API response. */
    payNextInstallment: GraphQLResponse<PayNextInstallmentData>
}
