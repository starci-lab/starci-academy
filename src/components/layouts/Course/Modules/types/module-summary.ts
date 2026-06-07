import type { IconComponent } from "@/types"

/** An icon component accepting standard SVG props. */
export type ModuleSummaryIcon = IconComponent

/**
 * Metadata for a module summary chip (content/video/challenge counters).
 *
 * Quantities are placeholder values until the counts are wired from the API.
 */
export interface ModuleSummaryItem {
    /** Stable id used for list keys. */
    id: string
    /** Icon component rendered inside the chip. */
    icon: ModuleSummaryIcon
    /** next-intl key for the tooltip body. */
    tooltipKey: string
    /** Temporary hardcoded count shown on the chip. */
    quantity: number
}
