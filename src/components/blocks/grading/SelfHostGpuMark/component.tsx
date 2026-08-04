import React from "react"
import { Tooltip, cn } from "@heroui/react"
import { CpuIcon } from "@phosphor-icons/react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link _SelfHostGpuMark} — presentational; labels already resolved. */
export interface SelfHostGpuMarkProps extends WithClassNames<undefined> {
    /** Already-localized aria-label for the trigger. */
    ariaLabel: string
    /** Already-localized tooltip body text. */
    tooltipLabel: string
}

/**
 * Accent GPU icon with a tooltip — marks models self-hosted on StarCi hardware
 * (e.g. RTX 5060). Icon only on the row; detail lives in the tooltip (no extra chip).
 */
export const _SelfHostGpuMark = ({ ariaLabel, tooltipLabel, className }: SelfHostGpuMarkProps) => (
    <Tooltip>
        <Tooltip.Trigger
            aria-label={ariaLabel}
            className={cn("inline-flex shrink-0 cursor-default", className)}
        >
            <CpuIcon aria-hidden focusable="false" className="size-4 text-accent-soft-foreground" />
        </Tooltip.Trigger>
        <Tooltip.Content>
            <span className="text-sm">{tooltipLabel}</span>
        </Tooltip.Content>
    </Tooltip>
)
