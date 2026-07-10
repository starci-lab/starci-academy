import type { GraphQLResponse } from "../../types"
import type { DiscountReason } from "./recommended-courses"
import type { PricingPhase } from "@/modules/types/enums/pricing-phase"

/**
 * One offered installment ("trả góp") term for a course's discounted price
 * (mirrors backend `InstallmentOptionItem`). The payment modal renders these as
 * the 3/6/12-month choices, each with its per-month + total (markup applied).
 */
export interface InstallmentOption {
    /** Number of monthly cycles (3, 6, or 12). */
    months: number
    /** Markup percent this term adds over the discounted price. */
    markupPercent: number
    /** Whole amount owed across the schedule (discounted price + markup). */
    totalAmountVnd: number
    /** Amount charged each cycle (incl. the first at checkout) = total / months. */
    monthlyAmountVnd: number
}

/** Pre-checkout price preview for a course (mirrors backend `CoursePricePreviewData`). */
export interface QueryCoursePricePreviewData {
    /** Original (pre-discount) VND price (= list / MSRP, struck "before"). */
    originalPriceVnd: number
    /** Active-phase VND price BEFORE loyalty (middle step list → phase → charge). */
    phasePriceVnd: number
    /** Loyalty-discounted VND price (PayOS / Sepay charge this). */
    discountedPriceVnd: number
    /** Loyalty discount percent applied (0–30). */
    discountPercent: number
    /** Original (pre-discount) USD price; null when the active phase has no USD price. */
    originalPriceUsd: number | null
    /** Active-phase USD price BEFORE loyalty; null when no USD price. */
    phasePriceUsd: number | null
    /** Loyalty-discounted USD price; null when the active phase has no USD price. */
    discountedPriceUsd: number | null
    /** Why the loyalty discount applies (drives FE copy). */
    discountReason: DiscountReason
    /** Courses the viewer already owns (fed the discount). */
    enrolledCount: number
    /** Current pricing phase (drives scarcity copy, e.g. "Pioneer"). */
    currentPhase: PricingPhase
    /** Phase the course advances to when the current sells out; null at the final (Regular) phase. */
    nextPhase: PricingPhase | null
    /** Seats left at the CURRENT phase price; null when the phase has no seat cap (unlimited). */
    seatsRemainingInCurrentPhase: number | null
    /** VND price after the current phase sells out (next tier, before loyalty); null at final phase. */
    nextPhasePriceVnd: number | null
    /** USD price after the current phase sells out; null when no next-phase USD price. */
    nextPhasePriceUsd: number | null
    /** Offered installment (trả góp) terms for the discounted VND price; empty for a free/USD-only course. */
    installmentOptions: Array<InstallmentOption>
}

/** Apollo response for the `coursePricePreview` query. */
export interface QueryCoursePricePreviewResponse {
    /** Top-level `coursePricePreview` field. */
    coursePricePreview: GraphQLResponse<QueryCoursePricePreviewData>
}
