import type { GraphQLResponse, QueryVariables } from "../../types"
import type { PaymentType } from "@/modules/types/enums/payment-type"
import type { CartItemEntity } from "../../queries/types/my-cart"

/** GraphQL `AddToCartRequest` body — add one course to the cart. */
export interface AddToCartRequest {
    /** Course id to add. */
    courseId: string
}

/** Apollo variables bag for the `addToCart` mutation. */
export type MutateAddToCartVariables = QueryVariables<AddToCartRequest>

/** Apollo response shape for `addToCart` (returns the created cart row). */
export interface MutateAddToCartResponse {
    /** Top-level `addToCart` field wrapping the standard API response. */
    addToCart: GraphQLResponse<CartItemEntity>
}

/** GraphQL `RemoveFromCartRequest` body — remove one course from the cart. */
export interface RemoveFromCartRequest {
    /** Course id to remove. */
    courseId: string
}

/** Payload inside `removeFromCart.data`. */
export interface RemoveFromCartData {
    /** True when a row was removed. */
    removed: boolean
}

/** Apollo variables bag for the `removeFromCart` mutation. */
export type MutateRemoveFromCartVariables = QueryVariables<RemoveFromCartRequest>

/** Apollo response shape for `removeFromCart`. */
export interface MutateRemoveFromCartResponse {
    /** Top-level `removeFromCart` field wrapping the standard API response. */
    removeFromCart: GraphQLResponse<RemoveFromCartData>
}

/** Payload inside `clearCart.data`. */
export interface ClearCartData {
    /** How many rows were removed. */
    removedCount: number
}

/** Apollo response shape for `clearCart` (no arguments). */
export interface MutateClearCartResponse {
    /** Top-level `clearCart` field wrapping the standard API response. */
    clearCart: GraphQLResponse<ClearCartData>
}

/** GraphQL `CoursesCheckoutRequest` body — checkout several cart courses at once. */
export interface CoursesCheckoutRequest {
    /** Ids of the courses to buy in one transaction. */
    courseIds: Array<string>
    /** Payment gateway to use. */
    paymentType: PaymentType
    /** Return URL after successful payment (PayOS). */
    returnUrl?: string
    /** Cancel URL if the user aborts checkout (PayOS). */
    cancelUrl?: string
}

/** Payload inside `coursesCheckout.data` after the standard API wrapper. */
export interface CoursesCheckoutData {
    /** URL the user should be redirected to complete checkout. */
    checkoutUrl: string
    /** Payment-gateway reference id for reconciliation. */
    referenceId: string
    /** Internal transaction row id. */
    transactionId: string
    /** Total checkout amount. */
    amount: number
    /** Number of courses in this checkout. */
    itemCount: number
    /** SePay PG only: JSON of signed fields to POST as a form to `checkoutUrl`. */
    checkoutFields?: string | null
}

/** Apollo variables bag for the `coursesCheckout` mutation. */
export type MutateCoursesCheckoutVariables = QueryVariables<CoursesCheckoutRequest>

/** Apollo response shape for `coursesCheckout`. */
export interface MutateCoursesCheckoutResponse {
    /** Top-level `coursesCheckout` field wrapping the standard API response. */
    coursesCheckout: GraphQLResponse<CoursesCheckoutData>
}
