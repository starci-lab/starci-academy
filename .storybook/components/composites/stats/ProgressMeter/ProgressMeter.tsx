import React from "react"
import { ProgressBar, cn, Skeleton as HeroSkeleton } from "@heroui/react"
import type { ReactNode } from "react"
import { ProgressMeterTargetMark } from "./TargetMark"
import { AnatomyOverlay } from "@sb-utils/AnatomyOverlay/AnatomyOverlay"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV, StackH } from "@sb-components/frames/Stack/Stack"
/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/stats/ProgressMeter`. Authored in Storybook (not `src`);
 * synced to `src` later.
 *
 * A presentational, props-only progress meter that renders an optional
 * label / value row above a HeroUI {@link ProgressBar}.
 */
interface ProgressMeterOwnProps {
    /** Maximum value representing 100% completion. Defaults to `100`. */
    max?: number
    /**
     * Optional descriptive label rendered on the left of the top row. Pass a
     * translated string — the block never calls `useTranslations` itself.
     */
    label?: ReactNode
    /** When `true`, renders the rounded completion percentage on the right of the top row. */
    showValue?: boolean
    /**
     * Fill color. Defaults to `"accent"`; pass a semantic tone (danger / warning /
     * success) when the bar's VALUE carries meaning.
     */
    color?: "accent" | "success" | "warning" | "danger"
    /** Optional TARGET mark on the track — a thin tick at `target/max` (e.g. an "85% goal" line). */
    target?: number
    /** Optional label rendered above the target tick (e.g. `"85%"`). Only shown when {@link ProgressMeterProps.target} is set. */
    targetLabel?: ReactNode
    /** Extra classes on the root element. */
    className?: string
    /** Dev/spec: overlay the anatomy annotation on this meter. */
    showAnatomy?: boolean
    /** Anatomy tag: names this part so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * Props for {@link ProgressMeter}. `value` is REQUIRED unless `isSkeleton`
 * (§12b) — a shimmer track has no real ratio to show yet.
 */
export type ProgressMeterProps = ProgressMeterOwnProps &
    (
        | { isSkeleton: true; value?: number }
        | { isSkeleton?: false; value: number }
    )

/**
 * ProgressMeter renders a labelled, accessible progress bar: an optional top row
 * (label + rounded percentage) above a HeroUI {@link ProgressBar}, with an
 * optional target/goal marker overlaid on the track.
 *
 * @param props - {@link ProgressMeterProps}
 */
export const ProgressMeter = ({
    value,
    max = 100,
    label,
    showValue = false,
    color = "accent",
    target,
    targetLabel,
    isSkeleton = false,
    className,
    showAnatomy = false,
    anatPart,
}: ProgressMeterProps) => {
    if (isSkeleton) {
        return (
            <StackV gap="related" anatPart={anatPart} className={className}>
                <HeroSkeleton className="h-3 w-24 rounded" />
                <HeroSkeleton className="h-1 w-full rounded-full" />
            </StackV>
        )
    }
    const safeMax = max > 0 ? max : 1
    // `value` is REQUIRED whenever `isSkeleton` is false (the discriminated union above) —
    // already guaranteed by the early return at `isSkeleton` — the `?? 0` only satisfies
    // narrowing across the destructure, it never actually fires.
    const percent = Math.round(((value ?? 0) / safeMax) * 100)
    const hasTopRow = label !== undefined || showValue
    // target tick position, clamped into the track (0..100%)
    const targetPercent = target === undefined
        ? null
        : Math.min(Math.max((target / safeMax) * 100, 0), 100)
    return (
        <StackV gap="related" className={cn(showAnatomy && "relative", className)} anatPart={anatPart}>
            {showAnatomy ? <AnatomyOverlay label="ProgressMeter" tier="composite" href="/?path=/docs/primitives-stats-progressmeter--docs" /> : null}
            {hasTopRow ? (
                <StackH gap="related" justify="between">
                    <Typography size="xs" color="muted" className="min-w-0 truncate" text={label} />
                    {showValue ? (
                        <Typography size="xs" color="muted" className="shrink-0" text={<>{percent}%</>} />
                    ) : null}
                </StackH>
            ) : null}
            {/* Two DIFFERENT jobs, so two boxes — a fix landed 2026-07-29 after the target pill
                measured 14px off the track's own midline (44 vs 58 on a 1280px viewport).
                One div was doing both: `pt-6` (24px, room for the floating label) and
                `flex h-5 items-center` (20px, the pill's reference frame) on the SAME element.
                Padding that exceeds the declared height forces the browser to grow the outer
                box to fit it (24px, not 20), and the two children then read TWO DIFFERENT
                origins on that grown box — the track (normal flow) starts AFTER the padding,
                at y=56, while the pill (`absolute top-1/2`) measures against the WHOLE padding
                box, landing at y=44. Nothing here was wrong on its own; stacking both jobs on
                one element is what broke the promise below.
                OUTER box owns the label's clearance only (`pt-6`, still the scale's first
                step that clears a `h-5`/20px obstacle — no exception, teacher 2026-07-27).
                INNER box is `relative flex h-5 items-center` — the pill's containing block
                AND the track's flex-center axis, both measured against the SAME 20px frame,
                so the `h-5` pill sits EXACTLY on the track midline again. */}
            <div className={cn(targetPercent !== null && targetLabel !== undefined && "pt-6")}>
                <div
                    className={cn(
                        "relative",
                        targetPercent !== null && "flex h-5 items-center",
                    )}
                >
                    <div className="w-full">
                        <ProgressBar
                            aria-label={typeof label === "string" ? label : "Progress"}
                            value={value}
                            maxValue={safeMax}
                            color={color}
                            size="sm"
                        >
                            <ProgressBar.Track className="h-1">
                                <ProgressBar.Fill />
                            </ProgressBar.Track>
                        </ProgressBar>
                    </div>
                    {targetPercent === null ? null : (
                        <ProgressMeterTargetMark percent={targetPercent} label={targetLabel} />
                    )}
                </div>
            </div>
        </StackV>
    )
}