import { PricingPhase } from "@/modules/types/enums/pricing-phase"
import type { QueryCoursePricePreviewData } from "@/modules/api/graphql/queries/types/course-price-preview"
import { PricingPhase as SbPricingPhase, type PremiumGateModalPrice } from "./component"

/**
 * Real backend {@link PricingPhase} → the sb-components `PhaseScarcityNote`'s own local
 * enum — the two are declared separately (different string values, e.g. `earlyBird` vs
 * `early_bird`), so a plain pass-through would silently break the phase label. Same
 * adapter seam `TrialConversionStrip`'s `component.tsx` (`SB_PHASE`) uses.
 */
const SB_PHASE: Record<PricingPhase, SbPricingPhase> = {
    [PricingPhase.Pioneer]: SbPricingPhase.Pioneer,
    [PricingPhase.EarlyBird]: SbPricingPhase.EarlyBird,
    [PricingPhase.Regular]: SbPricingPhase.Regular,
}

/**
 * Real `coursePricePreview` SWR data → the minimal {@link PremiumGateModalPrice}
 * shape `_PremiumGateModal` reads (field name + phase-enum adapter only; no
 * value is invented).
 *
 * @param data - Resolved price-preview data from {@link useQueryCoursePricePreviewSwr}.
 * @returns The gate-modal price shape.
 */
export const toPremiumGateModalPrice = (data: QueryCoursePricePreviewData): PremiumGateModalPrice => ({
    discountedPriceVnd: data.discountedPriceVnd,
    originalPriceVnd: data.originalPriceVnd,
    phasePriceVnd: data.phasePriceVnd,
    discountPercent: data.discountPercent,
    currentPhase: SB_PHASE[data.currentPhase],
    seatsRemaining: data.seatsRemainingInCurrentPhase,
    nextPhasePriceVnd: data.nextPhasePriceVnd,
})
