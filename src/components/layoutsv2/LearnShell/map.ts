import { PricingPhase as RealPricingPhase } from "@/modules/types/enums/pricing-phase"
import type { QueryCoursePricePreviewData } from "@/modules/api/graphql/queries/types/course-price-preview"
import { PricingPhase } from "@/components/starci/blocks/commerce/PhaseScarcityNote"
import type { EnrollGatePrice } from "@/components/starci/blocks/learn/EnrollGate"

/** Real `PricingPhase` (camelCase `earlyBird`) → the storybook block's own enum (snake_case `early_bird`). */
const PHASE_MAP: Record<RealPricingPhase, PricingPhase> = {
    [RealPricingPhase.Pioneer]: PricingPhase.Pioneer,
    [RealPricingPhase.EarlyBird]: PricingPhase.EarlyBird,
    [RealPricingPhase.Regular]: PricingPhase.Regular,
}

/**
 * Maps the real `coursePricePreview` SWR payload into `EnrollGate`'s own
 * `EnrollGatePrice` shape (same fields `EnrollGate/index.tsx` feeds its
 * `PriceTag`/`PhaseScarcityNote`: phase-before-loyalty + loyalty percent as the
 * breakdown, current phase + seats + next-phase price as the scarcity facts).
 * `undefined`/`null` → `undefined`, so the connected file can pass the SWR's
 * unresolved `data` straight through and let `EnrollGate`'s own `AsyncContent`
 * shimmer the price region.
 */
export const toEnrollGatePrice = (
    data: QueryCoursePricePreviewData | null | undefined,
): EnrollGatePrice | undefined => {
    if (!data) {
        return undefined
    }
    return {
        discountedVnd: data.discountedPriceVnd,
        originalVnd: data.originalPriceVnd,
        breakdown: {
            phase: data.phasePriceVnd,
            loyaltyPercent: data.discountPercent,
        },
        currentPhase: PHASE_MAP[data.currentPhase],
        seatsRemaining: data.seatsRemainingInCurrentPhase,
        nextPhasePriceVnd: data.nextPhasePriceVnd,
    }
}
