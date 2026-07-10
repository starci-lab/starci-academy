import type { GraphQLResponse } from "../../types"

/** One course this installment plan gates access to. */
export interface InstallmentPlanCourseItem {
    /** Course id. */
    id: string
    /** Course title. */
    title: string
}

/** One of the current user's installment ("trả góp") plans (mirrors backend `InstallmentPlanItem`). */
export interface InstallmentPlanItem {
    /** Plan id — pass to `payNextInstallment`. */
    id: string
    /** `"Fixed"` (new-buyer, N-month schedule) or `"FlexiblePool"` (legacy arrears pool). */
    planType: string
    /** Lifecycle status, e.g. `"Active"` | `"Overdue"` | `"Defaulted"` | `"Completed"`. */
    status: string
    /** ISO timestamp the current cycle is due; empty string when not set. */
    nextDueAt: string
    /** THIS cycle's minimum charge (VND) — always matches what `payNextInstallment` would charge with no override. */
    minPaymentVnd: number
    /** Fixed only: total number of scheduled cycles; null for FlexiblePool. */
    months: number | null
    /** Fixed only: cycles already paid (starts at 1 — the checkout cycle); null for FlexiblePool. */
    installmentsPaid: number | null
    /** Fixed only: fixed per-cycle charge (VND); null for FlexiblePool. */
    monthlyAmountVnd: number | null
    /** Fixed only: whole-schedule total (VND, markup applied); null for FlexiblePool. */
    totalAmountVnd: number | null
    /** Fixed only: markup percent applied for the chosen term; null for FlexiblePool. */
    markupPercent: number | null
    /** FlexiblePool only: outstanding balance (VND); null for Fixed. */
    remainingVnd: number | null
    /** FlexiblePool only: min-payment percent of the balance; null for Fixed. */
    minPaymentPercent: number | null
    /** FlexiblePool only: min-payment floor (VND); null for Fixed. */
    minPaymentFloorVnd: number | null
    /** Courses this plan gates access to. */
    courses: Array<InstallmentPlanCourseItem>
    /** ISO creation timestamp. */
    createdAt: string
}

/** Payload inside `myInstallmentPlans.data`. */
export interface MyInstallmentPlansData {
    /** The viewer's non-completed installment plans (newest first). */
    plans: Array<InstallmentPlanItem>
}

/** Apollo response for the `myInstallmentPlans` query. */
export interface QueryMyInstallmentPlansResponse {
    /** Top-level `myInstallmentPlans` field. */
    myInstallmentPlans: GraphQLResponse<MyInstallmentPlansData>
}
