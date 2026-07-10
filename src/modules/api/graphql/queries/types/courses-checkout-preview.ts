import type { GraphQLResponse } from "../../types"
import type { InstallmentOption } from "./course-price-preview"

/**
 * One line of a multi-course checkout preview (mirrors backend
 * `CoursesCheckoutPreviewLine`). Every amount is ALREADY display-ready (the
 * backend applied the non-prod test divisor to VND and charm-rounded USD) — pass
 * straight into `PriceTag`, do NOT re-apply the test divisor.
 */
export interface CoursesCheckoutPreviewLine {
    /** Course id this line prices. */
    courseId: string
    /** LIST/struck VND price (display-ready). */
    listVnd: number
    /** CHARGED VND price after loyalty + bundle (display-ready). */
    chargedVnd: number
    /** LIST USD price; null when the course has no USD price. */
    listUsd: number | null
    /** CHARGED USD price; null when the course has no USD price. */
    chargedUsd: number | null
    /** Combined loyalty + bundle discount percent for this line. */
    discountPercent: number
}

/**
 * A multi-course checkout preview (mirrors backend `CoursesCheckoutPreviewData`):
 * one `line` per PURCHASABLE course (already-owned + missing courses are dropped
 * server-side), the summed list/charged totals, the saving, and the multi-course
 * bundle bonus. All amounts are display-ready — feed them straight into `PriceTag`.
 */
export interface CoursesCheckoutPreviewData {
    /** One line per purchasable course. */
    lines: Array<CoursesCheckoutPreviewLine>
    /** Summed LIST VND across all lines. */
    totalListVnd: number
    /** Summed CHARGED VND across all lines. */
    totalChargedVnd: number
    /** Total VND saved (`totalListVnd - totalChargedVnd`). */
    savingsVnd: number
    /** Summed LIST USD; null when any line lacks USD. */
    totalListUsd: number | null
    /** Summed CHARGED USD; null when any line lacks USD. */
    totalChargedUsd: number | null
    /** Multi-course bundle bonus percent (0 / 5 / 10 by course count). */
    bundleBonusPercent: number
    /** Number of purchasable lines. */
    itemCount: number
    /** Offered installment (trả góp) terms for the order's charged VND total; empty for a free/USD-only order. */
    installmentOptions: Array<InstallmentOption>
}

/** Request for the `coursesCheckoutPreview` query. */
export interface CoursesCheckoutPreviewRequest {
    /** Ids of the cart courses to price together. */
    courseIds: Array<string>
}

/** Apollo response for the `coursesCheckoutPreview` query. */
export interface QueryCoursesCheckoutPreviewResponse {
    /** Top-level `coursesCheckoutPreview` field. */
    coursesCheckoutPreview: GraphQLResponse<CoursesCheckoutPreviewData>
}
