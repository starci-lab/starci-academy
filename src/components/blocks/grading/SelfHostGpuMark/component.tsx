import React from "react"
import { CpuIcon } from "@phosphor-icons/react"
import { Tooltip } from "@/components/atoms/overlay/Tooltip"
import { StackH } from "@/components/frames/Stack"

/** Props for {@link _SelfHostGpuMark} — presentational; labels already resolved. */
export interface SelfHostGpuMarkProps {
    /** Already-localized aria-label for the trigger. */
    ariaLabel: string
    /** Already-localized tooltip body text. */
    tooltipLabel: string
}

/**
 * Accent GPU icon with a tooltip — marks models self-hosted on StarCi hardware
 * (e.g. RTX 5060). Icon only on the row; detail lives in the tooltip (no extra chip).
 */
export const _SelfHostGpuMark = ({ ariaLabel, tooltipLabel }: SelfHostGpuMarkProps) => (
    <StackH
        identity={{ tier: "block", component: "SelfHostGpuMark" }}
        principle="icon-text"
        explain="GPU glyph hugging its accessible name — not title-subtitle (no title/subtitle voice), not label-field (no form control), not name-handle (not an identity pair)."
        items={[
            () => (
                <Tooltip label={tooltipLabel}>
                    <CpuIcon
                        aria-label={ariaLabel}
                        focusable="false"
                        className="size-4 text-accent-soft-foreground"
                    />
                </Tooltip>
            ),
        ]}
    />
)
