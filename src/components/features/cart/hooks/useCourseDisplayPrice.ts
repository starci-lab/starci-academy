"use client"

import { useMemo } from "react"
import type { CourseEntity } from "@/modules/types/entities/course"
import { publicEnv } from "@/resources/env/public"

/** A course's display prices (VND), transformed the same way the course pages do. */
export interface CourseDisplayPrice {
    /** Active-phase price the buyer pays (test-divided in non-prod). */
    priceVnd: number
    /** List/original price (struck when discounted), or null when none. */
    originalVnd: number | null
}

/**
 * Derives a course's DISPLAY VND price from its entity — the active-phase price
 * (falling back to the list price) ÷ the non-prod test divisor, plus the list
 * price struck through. Mirrors `CourseCard` / `usePricingRows` so every surface
 * (catalog, cart, payment modal) shows the identical amount.
 *
 * @param course - the course to price.
 * @returns {@link CourseDisplayPrice}.
 */
export const useCourseDisplayPrice = (course: CourseEntity): CourseDisplayPrice => {
    return useMemo(() => {
        const divisor = publicEnv().pricing.testDivisor
        const toVnd = (amount: number): number =>
            divisor === 1 ? amount : Math.max(1, Math.round(amount / divisor))

        const phasePrice = course.pricingPhases?.find(
            (phase) => phase.phase === course.currentPhase,
        )?.price
        const rawPrice = phasePrice ?? course.originalPrice ?? 0
        const priceVnd = toVnd(rawPrice)
        const originalVnd = course.originalPrice != null ? toVnd(course.originalPrice) : null
        return { priceVnd, originalVnd }
    }, [course.pricingPhases, course.currentPhase, course.originalPrice])
}
