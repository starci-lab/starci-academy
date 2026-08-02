import React from "react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { ProgressBar, type ProgressColor } from "@sb-components/atoms/display/Progress/Progress"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `QuotaBar`: one labelled used/limit AI-credit row — "Next 5 hours"
 * over "12 / 50" — whose fill colour steps through a 3-tier ramp as the window
 * fills up, with an optional reset-time caption underneath.
 *
 * PORTED from `src`'s `components/modals/AiQuotaModal/QuotaBar` (used by
 * `QuotaLane`, two bars per lane: a 5-hour window and a 7-day window).
 *
 * WHY A BLOCK: it knows what a QUOTA WINDOW is — that consumption crossing 75%
 * means "getting close" and crossing 90% means "about to run out", and that
 * those two thresholds are DOMAIN knowledge (an AI-credit policy), not a
 * generic progress-bar concern. The generic composite `ProgressMeter`
 * (`composites/stats/ProgressMeter`) does not know this ramp — it only shows
 * whatever tone the caller hands it — so this block owns the ramp itself
 * (`resolveQuotaBarFillTone`) instead of leaning on that composite.
 *
 * NEW GROUP `ai`: none of the five existing groups (commerce / consultant /
 * learn / navigation / profile) fit — this isn't a course/content concern
 * (`learn`), a sale (`commerce`), or a directory/nav concern. It is the first
 * block about AI-credit consumption, opened from `AiQuotaModal` (an overlay
 * flagged elsewhere in the canon, not built in this pass) and likely joined
 * later by more AI-quota pieces (`QuotaLane`, the modal itself).
 *
 * ⭐ JUDGEMENT CALL — `resolveQuotaBarFillTone` is INLINED as a local pure
 * function rather than a sibling `utils/` file: the task scope for this pass
 * is exactly two files (this component + its story), so the ported util lives
 * right next to its only caller instead of spawning a third file. The ratio
 * math is also MERGED — `src` computed the fill tone and the 0–100 bar value
 * as two separate `useMemo`s from `used`/`limit`; here both derive from one
 * `ratio` (still `used/limit` clamped to `[0, 1]`, still `used > 0 ? 1 : 0`
 * when `limit <= 0`), so the two never drift apart. Same thresholds, same
 * edge case, one fewer place to keep in sync.
 *
 * ⭐ JUDGEMENT CALL — SKELETON ALWAYS RESERVES THE CAPTION LINE. `src`'s own
 * skeleton (hand-drawn in `QuotaLane`, not on `QuotaBar` itself) unconditionally
 * shows a reset-caption shimmer line, because every real lane this block is
 * used in always ends up with a reset time once data lands. This block folds
 * that skeleton into itself via `isSkeleton` (§12c: the flag flows down into
 * the same atoms instead of a parallel tree) and keeps that same assumption —
 * the caption row renders while `isSkeleton`, even if the eventual `resetLabel`
 * turns out to be `null` — so the box the caption will land in doesn't pop in
 * once the reset time resolves (§8).
 * ─────────────────────────────────────────────────────────────────────────────
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
    className?: string
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
    className,
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

            body={(
                <>
                    <Typography
                        size="sm"
                        color="muted"
                        isSkeleton={isSkeleton}
                        classNames={isSkeleton ? ["w-1/4"] : undefined}

                        text={label}
                    />
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
                </>
            )}
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
            className={className}

            body={(
                <>
                    {labelRow}
                    {bar}
                    {showCaption ? (
                        <Typography
                            size="xs"
                            color="muted"
                            isSkeleton={isSkeleton}
                            classNames={isSkeleton ? ["w-1/2"] : undefined}

                            text={resetLabel ?? undefined}
                        />
                    ) : null}
                </>
            )}
        />
    )
}

export { QuotaBar }
