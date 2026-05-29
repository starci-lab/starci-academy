import type { AbstractEntity } from "./abstract"
import type { PricingPhase } from "../enums/pricing-phase"

/**
 * One pricing tier row per course (Pioneer / EarlyBird / Regular), unique per (course, phase).
 */
export interface PricingPhaseEntity extends AbstractEntity {
    /** Tier key. */
    phase: PricingPhase
    /** The price of the pricing phase. */
    price: number
    /** The USD price of the pricing phase (international gateways); `null` when no USD price. */
    priceUsd: number | null
    /** null = unlimited slots (FE may show “không giới hạn”). */
    slotAvailable: number | null
    /** Display order (0 = first tier). */
    orderIndex: number
}
