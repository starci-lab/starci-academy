"use client"

import React, {
    useCallback,
    useMemo,
} from "react"
import {
    PricingPhase,
    type PricingPhaseEntity,
} from "@/modules/types"
import numeral from "numeral"
import Decimal from "decimal.js"
import { Spacer } from "@/components/reuseable"
import { computePercentage } from "@/modules/utils"
import { useAppSelector } from "@/redux"
import _ from "lodash"
import type {
    PricingPhasePriceRow,
} from "./types"
import {
    PhaseTrack,
} from "./PhaseTrack"
import {
    PhaseLabels,
} from "./PhaseLabels"
import {
    PhasePrices,
} from "./PhasePrices"

/**
 * Pricing phases stepper container.
 *
 * Owns the course-derived phase ordering and price/discount computations, then
 * renders the presentational track, labels and price rows. `"use client"` for
 * redux selectors and Framer Motion children.
 */
export const Stepper = () => {
    /** The course entity. */
    const course = useAppSelector((state) => state.course.entity)

    /**
     * Display price for a tier: `regular` when set; Regular tier falls back to course list price.
     */
    const pricingPhaseDisplayPrice = useCallback(
        (pricingPhase: PricingPhaseEntity): number => {
            if (pricingPhase.price != null) {
                return pricingPhase.price
            }
            if (pricingPhase.phase === PricingPhase.Regular) {
                return course?.originalPrice ?? 0
            }
            return course?.originalPrice ?? 0
        },
        [course],
    )

    /**
     * USD display price for a tier, mirroring {@link pricingPhaseDisplayPrice}:
     * phase USD price when set, else the course list USD price. Returns `null`
     * when neither is present so the secondary USD line stays hidden.
     */
    const pricingPhaseDisplayPriceUsd = useCallback(
        (pricingPhase: PricingPhaseEntity): number | null => {
            // phase carries its own USD price → use it directly
            if (pricingPhase.priceUsd != null) {
                return pricingPhase.priceUsd
            }
            // otherwise fall back to the course list USD price (may be null)
            return course?.originalPriceUsd ?? null
        },
        [course],
    )

    /** The pricing phases, sorted by display order. */
    const pricingPhases = useMemo(() => {
        return _.cloneDeep(course?.pricingPhases ?? []).sort(
            (prev, next) => prev.orderIndex - next.orderIndex)
    }, [course])

    /** Course list price used as the discount reference. */
    const listPrice = course?.originalPrice ?? 0

    /** The currently active pricing phase, defaults to Pioneer. */
    const currentPhase = course?.currentPhase ?? PricingPhase.Pioneer

    /**
     * Calculate the discount for a pricing phase.
     */
    const calculateDiscount = useCallback(
        (tierPrice: number, refPrice: number): number => {
            if (refPrice <= 0 || tierPrice >= refPrice) return 0
            const discount = new Decimal(refPrice)
                .minus(tierPrice)
                .dividedBy(refPrice)
                .times(100)
            return discount.toNumber()
        },
        [],
    )

    /** The segment count (at least 1). */
    const segmentCount = useMemo(() => {
        return Math.max(1, pricingPhases.length - 1)
    }, [pricingPhases])

    /** The current phase entity (for its order index). */
    const currentPhaseData = useMemo(() => {
        return course?.pricingPhases?.find(phase => phase.phase === currentPhase)
    }, [course, currentPhase])

    /** Order index of the active phase (0 when unknown). */
    const currentOrderIndex = currentPhaseData?.orderIndex ?? 0

    /**
     * Progress-bar width as a CSS percentage. Mirrors the original expression
     * (`?? 0 / segmentCount` binds the division to the fallback only).
     */
    const progressWidth = useMemo(
        () => `${(currentPhaseData?.orderIndex ?? 0 / segmentCount) * 100}%`,
        [currentPhaseData?.orderIndex, segmentCount],
    )

    /** Pre-computed price rows (formatted price + optional save percentage). */
    const priceRows = useMemo<Array<PricingPhasePriceRow>>(
        () => pricingPhases.map((pricingPhase) => {
            const displayPrice = pricingPhaseDisplayPrice(pricingPhase)
            // USD price is optional — only format when the backend supplies one
            const displayPriceUsd = pricingPhaseDisplayPriceUsd(pricingPhase)
            return {
                id: pricingPhase.id,
                formattedPrice: numeral(displayPrice).format("0,0"),
                // guard null so courses without a USD price render no USD line
                formattedPriceUsd: displayPriceUsd != null
                    ? numeral(displayPriceUsd).format("$0,0.00")
                    : null,
                savePercent: pricingPhase.price != null
                    ? computePercentage({
                        numerator: new Decimal(calculateDiscount(displayPrice, listPrice)),
                        denominator: new Decimal(100),
                        fractionDigits: 2,
                    }).toNumber()
                    : null,
                // phases before the active one have already filled their slots → sold out
                soldOut: pricingPhase.orderIndex < currentOrderIndex,
            }
        }),
        [
            pricingPhases,
            pricingPhaseDisplayPrice,
            pricingPhaseDisplayPriceUsd,
            calculateDiscount,
            listPrice,
            currentOrderIndex,
        ],
    )

    return (
        <div>
            <PhaseTrack
                pricingPhases={pricingPhases}
                progressWidth={progressWidth}
                currentOrderIndex={currentOrderIndex}
            />
            <Spacer y={2} />
            <PhaseLabels pricingPhases={pricingPhases} currentOrderIndex={currentOrderIndex} />
            <Spacer y={2} />
            <PhasePrices rows={priceRows} />
        </div>
    )
}
