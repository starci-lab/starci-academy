import React from "react"
import { cn } from "@heroui/react"
import { Typography } from "@/components/atoms/text/Typography"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"

/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "ProgressMeterTargetMark" } as const

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/stats/ProgressMeter/TargetMark`. Authored in Storybook
 * (not `src`); synced to `src` later.
 */

/** Props for the {@link ProgressMeterTargetMark} block. */
export interface ProgressMeterTargetMarkProps {
    /** Horizontal position on the track, `0..100` (already clamped by the caller). */
    percent: number
    /**
     * Optional short label floating just above the pill (e.g. `"85%"`). Keep it
     * short — it floats over the bar. `string`, not `ReactNode` — the composite
     * wraps it in `Typography` itself.
     */
    label?: string
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     * Prefer this over `className`; the string form is going away.
     */
    classNames?: Array<AllowedClassName>
}

/**
 * The target / goal marker on a {@link ProgressMeter} track — a thin tick
 * standing on the `h-1` track, with an optional short label floating above it.
 * Centered on the bar via `top-1/2 -translate-y-1/2`, on `percent` via
 * `-translate-x-1/2`. Pure/props-only.
 *
 * `bg-muted` — a NEUTRAL, deliberately outside the fill's semantic set
 * (danger/warning/success), which is what lets the fill alone answer "did I
 * pass". Height is FLUSH with the track (`h-1`, 4px): the tick marks a position
 * ON the bar. Flush still separates cleanly because the difference is contrast,
 * not size — `--muted` sits at ~55% lightness against a ~94% track.
 * `rounded-none` — a rounded 4px-tall sliver reads as a dot, not a tick.
 *
 * The label sits DIRECTLY on the tick, no gap — label and tick are ONE mark, so
 * nothing should separate them.
 *
 * The "tick + floating label above it" shape is ONE composite mark, so the
 * composite owns the pinning of the label to the tick. The pinning
 * (`absolute bottom-full left-1/2 -translate-x-1/2`) lives on a plain wrapper
 * `div` this composite controls, not on `Typography` — an atom owns how it
 * looks, never where it sits. `Typography` renders with no positioning classes
 * at all.
 *
 * @param props - {@link ProgressMeterTargetMarkProps}
 */
export const ProgressMeterTargetMark = ({ percent, label, classNames }: ProgressMeterTargetMarkProps) => (
    <div
        className={cn("pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2", classNames)}
        style={{ left: `${percent}%` }}
        data-tier="composite"
        data-component="ProgressMeterTargetMark"
    >
        <div className="h-1 w-0.5 rounded-none bg-muted" />
        {label === undefined ? null : (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2">
                <Typography size="xs"
                    color="muted"
                    noWrap
                    text={label}
                />
            </div>
        )}
    </div>
)
