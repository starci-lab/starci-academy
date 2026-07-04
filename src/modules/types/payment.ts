/**
 * Discriminated-union context that tells the shared payment modal which
 * purchase action to run when the user picks a payment method.
 *
 * The opener (course enroll card / AI subscription tier card) passes this to
 * `usePaymentOverlayState().open(context)`; the modal reads it to decide which
 * SWR mutation to trigger and what payload to send.
 */
export type PaymentContext =
    | CoursePaymentContext
    | CoursesCheckoutPaymentContext
    | AiSubscriptionPaymentContext
    | MembershipPaymentContext

/** Discriminator for the {@link PaymentContext} union. */
export enum PaymentFlow {
    /** Enrolling in (paying for) a single course. */
    CourseEnroll = "courseEnroll",
    /** Buying SEVERAL cart courses at once (multi-course checkout). */
    CoursesCheckout = "coursesCheckout",
    /** Purchasing an AI subscription tier. */
    AiSubscription = "aiSubscription",
    /** Purchasing community membership. */
    Membership = "membership",
}

/**
 * One line in the multi-course checkout summary. Carries just the display
 * identity (cover + title); the PRICE is fetched fresh by the payment modal via
 * `coursesCheckoutPreview` (keyed on the context's `courseIds`) so the modal and
 * cart always show the identical real charged total.
 */
export interface CartCheckoutLine {
    /** Course id being purchased. */
    courseId: string
    /** Course title shown in the summary. */
    title: string
    /** Cover image URL (or null → branded fallback). */
    coverImageUrl?: string | null
}

/** Payment context for the single course-enroll flow. */
export interface CoursePaymentContext {
    /** Marks this as the course-enroll flow. */
    flow: PaymentFlow.CourseEnroll
}

/** Payment context for the multi-course cart checkout flow. */
export interface CoursesCheckoutPaymentContext {
    /** Marks this as the multi-course checkout flow. */
    flow: PaymentFlow.CoursesCheckout
    /** Ids of the cart courses to buy in one transaction (also key the preview). */
    courseIds: Array<string>
    /** Cart lines for the multi-line summary (cover + title); price comes from the preview. */
    lines: Array<CartCheckoutLine>
}

/** Payment context for the AI subscription flow. */
export interface AiSubscriptionPaymentContext {
    /** Marks this as the AI subscription flow. */
    flow: PaymentFlow.AiSubscription
    /** Slug of the subscription tier the user is purchasing. */
    tier: string
}

/** Payment context for the community membership flow. */
export interface MembershipPaymentContext {
    /** Marks this as the membership flow (single product, no tier). */
    flow: PaymentFlow.Membership
}
