import React from "react"
import { cn } from "@heroui/react"
import { Typography } from "@/components/atoms/text/Typography"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"

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
 * The target / goal marker on a {@link ProgressMeter} track — a thin gray tick
 * (`w-0.5 h-3`) standing just proud of the `h-1` track, with an optional short
 * label floating above it. Centered on the bar via `top-1/2 -translate-y-1/2`, on
 * `percent` via `-translate-x-1/2`. Pure/props-only.
 *
 * ⭐ AUDIT 2026-07-30 (feedback ChallengePage/Graded round-14, teacher: "the anchor
 * looks a bit too long, and the colour doesn't quite make sense"). Was `h-5 w-1 bg-accent` —
 * 20px tall on a 4px track (5× the thing it marks) in the SAME brand tone the
 * fill uses. Two faults, one visual: the height made it read as part of the bar
 * rather than a mark on it, and sharing `accent` with the fill meant one colour
 * carried two different meanings ("what you scored" vs "what you need"), so the
 * eye could not separate them.
 *
 * Now `bg-muted` — a NEUTRAL, deliberately outside the fill's semantic set
 * (danger/warning/success), which is what lets the fill alone answer "did I
 * pass". Height is FLUSH with the track (`h-1`, 4px): the tick marks a position
 * ON the bar, so standing proud of it was the source of the "reads as part of
 * the bar" problem. Flush still separates cleanly because the remaining
 * difference is contrast, not size — `--muted` sits at ~55% lightness against a
 * ~94% track. `rounded-none` — a rounded 4px-tall sliver reads as a dot, not a
 * tick (teacher, 2026-07-30: "rounded-none, please").
 *
 * The label sits DIRECTLY on the tick, no gap (teacher, 2026-07-30: "why offset it?
 * no offset") — label and tick are ONE mark, so nothing should separate them.
 *
 * ⭐ 2026-07-31 — the "tick + floating label above it" shape is ONE composite
 * mark, so the composite owns the pinning of the label to the tick. The
 * pinning (`absolute bottom-full left-1/2 -translate-x-1/2`) now lives on a
 * plain wrapper `div` this composite controls, not on `Typography` — an atom
 * owns how it looks, never where it sits. `Typography` renders with no
 * positioning classes at all.
 *
 * @param props - {@link ProgressMeterTargetMarkProps}
 */
/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "ProgressMeterTargetMark" } as const

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
