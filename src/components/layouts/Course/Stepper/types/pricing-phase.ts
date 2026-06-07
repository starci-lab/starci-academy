/** Display metadata (name + description) for a single pricing phase. */
export interface PricingPhaseData {
    /** The name of the pricing phase. */
    name: string
    /** The description of the pricing phase. */
    description: string
}

/** A computed price row rendered under one phase dot. */
export interface PricingPhasePriceRow {
    /** Stable React key (the phase entity id). */
    id: string
    /** Formatted VND display price for the phase (primary, charged by domestic gateways). */
    formattedPrice: string
    /** Formatted USD display price for the phase (international gateways), or `null` when no USD price. */
    formattedPriceUsd: string | null
    /** Save-percentage label (already formatted), or `null` when no discount chip. */
    savePercent: number | null
    /** True when this phase is before the active phase (its slots are sold out). */
    soldOut: boolean
}
