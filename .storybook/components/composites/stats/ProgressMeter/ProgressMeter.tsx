import React from "react"
import { ProgressBar, cn } from "@heroui/react"
import { ProgressMeterTargetMark } from "./TargetMark"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV, StackH } from "@sb-components/frames/Stack/Stack"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"
import type { ComponentTypeWithSkeleton } from "@sb-components/composites/_slot"
/** Fill still far from the 85% target — the accent notch pill overshoots the thin bar; `mt-5` reserves room for the floating "85%" label. */
interface ProgressMeterOwnProps {
    /** Maximum value representing 100% completion. Defaults to `100`. */
    max?: number
    /**
     * Optional descriptive label rendered on the left of the top row. Pass a
     * translated string — the block never calls `useTranslations` itself. `string`,
     * not `ReactNode`: the composite wraps it in `Typography` itself, and a
     * pre-built node could not be told it is loading.
     */
    label?: string
    /** When `true`, renders the rounded completion percentage on the right of the top row. */
    showValue?: boolean
    /**
     * Fill color. Defaults to `"accent"`; pass a semantic tone (danger / warning /
     * success) when the bar's VALUE carries meaning.
     */
    color?: "accent" | "success" | "warning" | "danger"
    /** Optional TARGET mark on the track — a thin tick at `target/max` (e.g. an "85% goal" line). */
    target?: number
    /** Optional label rendered above the target tick (e.g. `"85%"`). Only shown when {@link ProgressMeterProps.target} is set. `string` — see {@link ProgressMeterOwnProps.label}. */
    targetLabel?: string
    /**
     * Optional left-aligned COMPONENT slot for a custom row above the track,
     * additive to (and independent of) the `label`/`showValue` row: pass this
     * when the row needs more than plain text (e.g. an icon plus a custom-
     * formatted unit). A COMPONENT reference, not a built node (COMPOSITE-8) —
     * the meter calls it itself and forwards `isSkeleton`, so it can shimmer in
     * place. Omitted (default), no such row renders and existing callers —
     * including ones already using `label`/`showValue` — are unaffected.
     */
    leading?: ComponentTypeWithSkeleton
    /**
     * Right-aligned partner to {@link ProgressMeterOwnProps.leading}. Either
     * may be passed alone; the row renders whichever side(s) are set.
     */
    trailing?: ComponentTypeWithSkeleton
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     * Prefer this over `className`; the string form is going away.
     */
    classNames?: Array<AllowedClassName>
    /** Dev/spec: overlay the anatomy annotation on this meter. */
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
 * optional target/goal marker overlaid on the track. A second, independent row
 * — {@link ProgressMeterOwnProps.leading}/{@link ProgressMeterOwnProps.trailing} —
 * can render just above the track for callers that need components instead of
 * plain text.
 *
 * @param props - {@link ProgressMeterProps}
 */
/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "ProgressMeter" } as const

export const ProgressMeter = ({
    value,
    max = 100,
    label,
    showValue = false,
    color = "accent",
    target,
    targetLabel,
    leading: Leading,
    trailing: Trailing,
    isSkeleton = false,
    classNames,
}: ProgressMeterProps) => {
    const safeMax = max > 0 ? max : 1
    // `value` is REQUIRED whenever `isSkeleton` is false (the discriminated union above) —
    // guaranteed by the type at every real call site — the `?? 0` only satisfies narrowing
    // across the destructure, and is never seen while `isSkeleton` (the row it feeds stays
    // unshown or goes through `Typography`'s own shimmer instead).
    const percent = Math.round(((value ?? 0) / safeMax) * 100)
    const hasTopRow = label !== undefined || showValue
    // target tick position, clamped into the track (0..100%)
    const targetPercent = target === undefined
        ? null
        : Math.min(Math.max((target / safeMax) * 100, 0), 100)
    const topRow = hasTopRow ? (
        <StackH
            gap={3}
            principles={["content-row"]}
            justify="between"
            isSkeleton={isSkeleton}
            items={[
                () => <Typography size="xs" color="muted" truncate classNames={["min-w-0"]} isSkeleton={isSkeleton} text={label} />,
                ...(showValue ? [() => (
                    <Typography size="xs" color="muted" classNames={["shrink-0"]} isSkeleton={isSkeleton} text={<>{percent}%</>} />
                )] : []),
            ]}
        />
    ) : null
    // Additive row, independent of `topRow` above: a component-based
    // leading/trailing pair for callers that need more than plain text (an
    // icon, a chip, a custom-formatted unit). Either side may be passed alone;
    // omitted entirely, `slotRow` is `null` and nothing changes for existing
    // callers.
    const hasSlotRow = Leading !== undefined || Trailing !== undefined
    const slotRow = hasSlotRow ? (
        <StackH
            gap={3}
            principles={["content-row"]}
            justify="between"
            isSkeleton={isSkeleton}
            items={[
                () => Leading ? (
                    <div className="min-w-0">
                        <Leading isSkeleton={isSkeleton} />
                    </div>
                ) : <span />,
                ...(Trailing ? [() => (
                    <div className="shrink-0">
                        <Trailing isSkeleton={isSkeleton} />
                    </div>
                )] : []),
            ]}
        />
    ) : null
    // Two DIFFERENT jobs, so two boxes. A single div doing both — `pt-6` (24px,
    // room for the floating label) and `flex h-5 items-center` (20px, the pill's
    // reference frame) on the SAME element — breaks: padding that exceeds the
    // declared height forces the browser to grow the outer box to fit it (24px,
    // not 20), and the two children then read TWO DIFFERENT origins on that grown
    // box — the track (normal flow) starts AFTER the padding, at y=56, while the
    // pill (`absolute top-1/2`) measures against the WHOLE padding box, landing at
    // y=44.
    // OUTER box owns the label's clearance only (`pt-6`, the scale's first step
    // that clears a `h-5`/20px obstacle).
    // INNER box is `relative flex h-5 items-center` — the pill's containing block
    // AND the track's flex-center axis, both measured against the SAME 20px frame,
    // so the `h-5` pill sits EXACTLY on the track midline.
    const trackSection = (
        <div className={cn(targetPercent !== null && targetLabel !== undefined && "pt-6")}>
            <div
                className={cn(
                    "relative",
                    targetPercent !== null && "flex h-5 items-center",
                )}
            >
                <div className="w-full">
                    {/* ATOM GAP: the `Progress.ProgressBar` atom does not expose its Track's
                        height for override, and this meter's compact `h-1` track (vs the
                        atom's own preset sizes) can only be reproduced with the vendor
                        `ProgressBar` directly. Kept as the REAL element in both states — the
                        skeleton no longer imports a vendor `Skeleton`, it swaps the same
                        track slot for a neutral flat fill instead (no hand-drawn
                        `animate-pulse` shimmer, COMPOSITE-10). */}
                    {isSkeleton ? (
                        <div className="h-1 w-full rounded-full bg-default" />
                    ) : (
                        <ProgressBar
                            aria-label={label ?? "Progress"}
                            value={value}
                            maxValue={safeMax}
                            color={color}
                            size="sm"
                        >
                            <ProgressBar.Track className="h-1">
                                <ProgressBar.Fill />
                            </ProgressBar.Track>
                        </ProgressBar>
                    )}
                </div>
                {targetPercent === null ? null : (
                    <ProgressMeterTargetMark percent={targetPercent} label={targetLabel} />
                )}
            </div>
        </div>
    )
    return (
        <StackV
            gap={3}
            classNames={classNames}
            isSkeleton={isSkeleton}
            items={[
                () => topRow,
                () => slotRow,
                () => trackSection,
            ]}
        />
    )
}