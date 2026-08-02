import React from "react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { ProgressBar, type ProgressColor } from "@sb-components/atoms/display/Progress/Progress"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * BLOCK — `QuotaBar`: one labelled used/limit AI-credit row whose fill colour
 * steps through a 3-tier ramp (accent ≤75% · warning >75% · danger >90%) as the
 * window fills up, with an optional reset-time caption underneath.
 *
 * Two of these stack inside `QuotaLane` (a 5-hour window, a 7-day window), which
 * itself sits inside the `AiQuotaModal` overlay.
 *
 * LEAF by STRUCTURE: the fill tone, the unit suffix, and the reset caption are all
 * DATA ⇒ states of one leaf. The caller flipping `isSkeleton` is its own leaf, same
 * convention as `RatingBar`/`PriceTag`.
 */

/** Usage ratio above which the bar shows warning colour (>75%). */
const WARNING_USAGE_RATIO = 0.75

/** Usage ratio above which the bar shows danger colour (>90%). */
const DANGER_USAGE_RATIO = 0.9

/**
 * Map consumed share to a progress-bar colour tier. Ported verbatim (same
 * thresholds, same `limit <= 0` edge case) from
 * `src`'s `resolveQuotaBarFillTone`.
 * @param ratio - Consumed share, already clamped to `[0, 1]`.
 * @returns `"accent"` (≤75%), `"warning"` (>75%), or `"danger"` (>90%).
 */
const resolveQuotaBarFillTone = (ratio: number): ProgressColor => {
    if (ratio > DANGER_USAGE_RATIO) {
        return "danger"
    }
    if (ratio > WARNING_USAGE_RATIO) {
        return "warning"
    }
    return "accent"
}

/** Props for {@link QuotaBar}. */
export interface QuotaBarProps {
    /** Window label (e.g. "Next 5 hours"). Block carries no i18n — caller localises. */
    label: string
    /** Amount consumed in the window. */
    used: number
    /** Cap for the window (`0` means "no allowance"). */
    limit: number
    /** Unit suffix appended after the counts when {@link QuotaBarProps.showUnit} is true. */
    unit?: string
    /** `true` → append {@link QuotaBarProps.unit} after the used/limit counts. */
    showUnit?: boolean
    /** Reset time shown under the bar (e.g. "Resets at 18:50 01/06"). `null`/omitted hides the row. */
    resetLabel?: string | null
    /** `true` → the block draws its own row mirror (label, bar, caption all shimmer). */
    isSkeleton?: boolean
    /** Where this sits inside its parent. Appearance is not passable — it is already a prop. */
    classNames?: Array<AllowedClassName>
}

/**
 * The quota usage row. See the file header for the full contract.
 * @param props - {@link QuotaBarProps}
 */
const QuotaBar = ({
    label,
    used,
    limit,
    unit,
    showUnit = false,
    resetLabel,
    isSkeleton = false,
    classNames,
}: QuotaBarProps) => {
    const ratio = limit > 0
        ? Math.min(1, Math.max(0, used / limit))
        : (used > 0 ? 1 : 0)
    const fillTone = resolveQuotaBarFillTone(ratio)
    const value = ratio * 100

    // Whether the caption row has a box to occupy: a resting bar always reserves
    // it (§8, see file header); a live bar only reserves it when there IS a
    // reset time to show.
    const showCaption = isSkeleton || resetLabel != null

    // LabelRow — the window label on the left, the "used / limit" count on the
    // right. Peers on one baseline row (§13b), same shape as `RatingBar`'s own
    // label+key row: `StackH` with `justify="between"`, not `Cluster` — there
    // are exactly two fixed slots here, not a repeating same-kind list.
    const labelRow = (
        <StackH
            gap={3}
            align="center"
            justify="between"
            isSkeleton={isSkeleton}
            items={[
                () => (
                    <Typography
                        size="sm"
                        color="muted"
                        isSkeleton={isSkeleton}
                        classNames={isSkeleton ? ["w-1/4"] : undefined}

                        text={label}
                    />
                ),
                () => (
                    <Typography
                        size="sm"
                        weight="medium"
                        tabularNums
                        isSkeleton={isSkeleton}
                        classNames={isSkeleton ? ["w-1/3"] : undefined}

                        text={(
                            <>
                                {used}
                                {" / "}
                                {limit}
                                {showUnit && unit ? (
                                    <>
                                        {" "}
                                        <Typography size="sm" color="muted" isInline text={unit} />
                                    </>
                                ) : null}
                            </>
                        )}
                    />
                ),
            ]}
        />
    )

    const bar = (
        <div>
            <ProgressBar
                value={value}
                max={100}
                color={fillTone}
                size="sm"
                ariaLabel={label}
                isSkeleton={isSkeleton}

            />
        </div>
    )

    return (
        <StackV
            gap={4}
            classNames={classNames}
            isSkeleton={isSkeleton}
            items={[
                () => labelRow,
                () => bar,
                ...(showCaption ? [() => (
                    <Typography
                        size="xs"
                        color="muted"
                        isSkeleton={isSkeleton}
                        classNames={isSkeleton ? ["w-1/2"] : undefined}

                        text={resetLabel ?? undefined}
                    />
                )] : []),
            ]}
        />
    )
}

export { QuotaBar }
