"use client"

import {
    useMemo,
} from "react"
import numeral from "numeral"
import Decimal from "decimal.js"
import _ from "lodash"
import {
    PricingPhase,
    type PricingPhaseEntity,
} from "@/modules/types"
import {
    computePercentage,
} from "@/modules/utils"
import {
    useAppSelector,
} from "@/redux"
import type {
    CoursePriceRow,
} from "../types"

/** Result of {@link usePricingRows}. */
export interface UsePricingRowsResult {
    /** All pricing phases, ordered, formatted for the rail. */
    rows: Array<CoursePriceRow>
    /** The currently active phase row (drives the big headline price), or null. */
    active: CoursePriceRow | null
}

/**
 * Derives the pricing-rail rows from the active course: display price per phase
 * (phase price, else course list price), USD line when present, whole-percent
 * discount vs list, sold-out flag (phases before the active one), and the active
 * phase. Reuses the legacy Stepper computation so prices stay identical.
 *
 * @returns the formatted rows + the active row.
 */
export const usePricingRows = (): UsePricingRowsResult => {
    const course = useAppSelector((state) => state.course.entity)

    return useMemo<UsePricingRowsResult>(() => {
        const listPrice = course?.originalPrice ?? 0
        const currentPhase = course?.currentPhase ?? PricingPhase.Pioneer
        const phases = _.cloneDeep(course?.pricingPhases ?? []).sort(
            (a, b) => a.sortIndex - b.sortIndex,
        )
        const currentOrderIndex = phases.find((p) => p.phase === currentPhase)?.sortIndex ?? 0

        /** Display price for a tier (phase price, else course list price). */
        const priceOf = (phase: PricingPhaseEntity): number =>
            phase.price ?? course?.originalPrice ?? 0
        /** USD display price for a tier, or null when neither phase nor course has one. */
        const usdOf = (phase: PricingPhaseEntity): number | null =>
            phase.priceUsd ?? course?.originalPriceUsd ?? null
        /** Discount percent of a tier price against the list price. */
        const discountOf = (tierPrice: number, refPrice: number): number => {
            if (refPrice <= 0 || tierPrice >= refPrice) {
                return 0
            }
            return new Decimal(refPrice).minus(tierPrice).dividedBy(refPrice).times(100).toNumber()
        }

        const rows: Array<CoursePriceRow> = phases.map((phase) => {
            const price = priceOf(phase)
            const usd = usdOf(phase)
            return {
                id: phase.id,
                phase: phase.phase,
                formattedPrice: `${numeral(price).format("0,0")}₫`,
                formattedPriceUsd: usd != null ? numeral(usd).format("$0,0.00") : null,
                savePercent: phase.price != null
                    ? computePercentage({
                        numerator: new Decimal(discountOf(price, listPrice)),
                        denominator: new Decimal(100),
                        fractionDigits: 0,
                    }).toNumber()
                    : null,
                slotAvailable: phase.slotAvailable ?? null,
                soldOut: phase.sortIndex < currentOrderIndex,
                isActive: phase.phase === currentPhase,
            }
        })

        return {
            rows,
            active: rows.find((row) => row.isActive) ?? null,
        }
    }, [course])
}
