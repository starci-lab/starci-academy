import type {
    IconProps,
} from "@phosphor-icons/react"
import type React from "react"

/** A Phosphor icon component accepting standard icon props. */
export type ModuleSummaryIcon = React.ComponentType<IconProps>

/**
 * Metadata for a module summary chip (content/video/challenge counters).
 *
 * Quantities are placeholder values until the counts are wired from the API.
 */
export interface ModuleSummaryItem {
    /** Stable id used for list keys. */
    id: string
    /** Phosphor icon component rendered inside the chip. */
    icon: ModuleSummaryIcon
    /** next-intl key for the tooltip body. */
    tooltipKey: string
    /** Temporary hardcoded count shown on the chip. */
    quantity: number
}
