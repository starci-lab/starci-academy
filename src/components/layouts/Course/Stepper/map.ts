import {
    PricingPhase,
} from "@/modules/types"
import type {
    PricingPhaseData,
} from "./types"

/** Display name + description for each pricing phase, keyed by the phase enum. */
export const PRICING_PHASE_DATA_MAP: Record<PricingPhase, PricingPhaseData> = {
    /** Earliest tier. */
    [PricingPhase.Pioneer]: { name: "Pioneer", description: "Pioneer" },
    /** Mid tier. */
    [PricingPhase.EarlyBird]: { name: "Early Bird", description: "Early Bird" },
    /** Standard list-price tier. */
    [PricingPhase.Regular]: { name: "Regular", description: "Regular" },
}
