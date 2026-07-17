import React from "react"
import type { ReactNode } from "react"
import { Typography, cn } from "@heroui/react"
import { ProgressMeter } from "@/components/blocks/stats/ProgressMeter"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Semantic verdict tone — drives the left accent border, the big value's color, and the meter fill. */
export type VerdictHeroBand = "danger" | "warning" | "success"

/** The meter row inside a {@link VerdictHeroCard} — current progress toward an optional target mark. */
export interface VerdictHeroMeter {
    /** Current value, same unit as {@link VerdictHeroCardProps.value}. */
    value: number
    /** Denominator for the bar. @default 100 */
    max?: number
    /** Optional healthy-mark position on the bar (e.g. the "85% retention" line) — omit when there is no known target yet. */
    target?: number
}

/** One mini stat in a {@link VerdictHeroCard}'s optional split row (e.g. "mature vs young" retention). */
export interface VerdictHeroSplit {
    /** Muted caption above the value (e.g. "Thẻ đã học kỹ"). */
    label: ReactNode
    /** The split's own value — pass the unit inline if it needs one (this row has no separate `unit` prop). */
    value: ReactNode
    /** Colors this split's value by band; omit to keep it neutral foreground (e.g. a split that isn't itself good/bad). */
    band?: VerdictHeroBand
}

/** Props for the {@link VerdictHeroCard} block. */
export interface VerdictHeroCardProps extends WithClassNames<undefined> {
    /** The headline number, rendered large and colored by {@link VerdictHeroCardProps.band}. */
    value: number
    /** Suffix rendered muted right after the value (e.g. "%", "/100"). */
    unit?: string
    /** Verdict tone — see {@link VerdictHeroBand}. Drives the left accent border + value color + (when {@link VerdictHeroCardProps.meter} is set) the bar fill. */
    band: VerdictHeroBand
    /** The one-line judgment sentence (e.g. "Bạn đang quá tải — nạp thẻ mới nhanh hơn tốc độ ghi nhớ."). This is the "phán xử" — always render a real verdict, never a bare restatement of the number. */
    verdict: ReactNode
    /** Optional muted line under the verdict, giving the evidence behind it. */
    sub?: ReactNode
    /** Optional progress bar toward {@link VerdictHeroMeter.target}. Omit when the surface has no meaningful bar to show (e.g. a pure count). */
    meter?: VerdictHeroMeter
    /** Optional 2-up mini-stat row that breaks the headline number down (e.g. mature vs young retention) — the "▽" evidence framing. Omit when the number has no natural split. */
    splits?: ReadonlyArray<VerdictHeroSplit>
    /** Optional primary action slot (caller supplies the actual `<Button>`) — the "→" framing that turns the verdict into a next step. */
    action?: ReactNode
}

/** Left border + big-value color, one class per {@link VerdictHeroBand}. */
const BAND_BORDER: Record<VerdictHeroBand, string> = {
    danger: "border-l-danger",
    warning: "border-l-warning",
    success: "border-l-success",
}

/** Same tone pairing the `Score` block uses for a band-colored number on a plain (non-tinted) surface. */
const BAND_TEXT: Record<VerdictHeroBand, string> = {
    danger: "text-danger-soft-foreground",
    warning: "text-warning-soft-foreground",
    success: "text-success-soft-foreground",
}

/**
 * The "phán xử" (judgment) hero shared by all 3 Thống kê surfaces (review /
 * interview / quiz): a band-colored headline value, a one-line verdict
 * sentence, an optional muted evidence sub-line, an optional
 * {@link ProgressMeter} with a target mark, an optional 2-up split
 * breakdown, and an optional primary action slot. Replaces the old "trơ số"
 * hero — every zone here reads verdict → evidence → action, never a number
 * alone (`stats-insight-redesign` proposal).
 *
 * The left accent border is drawn by hand (`border-l-4` + a band color,
 * layered on top of the card's own `border-y border-r`) rather than via
 * `SectionCard`, which has no asymmetric-border variant.
 *
 * Pure/props-only — no store, no fetch, no `useTranslations` (all copy
 * arrives via props from a caller that already translated it).
 *
 * @param props - {@link VerdictHeroCardProps}
 * @see Story: .storybook/stories/blocks/stats/VerdictHeroCard/VerdictHeroCard.stories
 */
export const VerdictHeroCard = ({
    value,
    unit,
    band,
    verdict,
    sub,
    meter,
    splits,
    action,
    className,
}: VerdictHeroCardProps) => {
    const meterMax = meter?.max ?? 100
    const safeMeterMax = meterMax > 0 ? meterMax : 1
    const targetPercent = meter?.target === undefined
        ? null
        : Math.min(Math.max((meter.target / safeMeterMax) * 100, 0), 100)

    return (
        <div
            className={cn(
                "flex flex-col gap-3 rounded-3xl border-y border-r border-default bg-surface p-3 border-l-4",
                BAND_BORDER[band],
                className,
            )}
        >
            <div className="flex items-baseline gap-1">
                <span className={cn("text-4xl font-bold tabular-nums", BAND_TEXT[band])}>
                    {value}
                </span>
                {unit ? (
                    <Typography type="body-sm" color="muted">{unit}</Typography>
                ) : null}
            </div>

            <Typography type="body-sm" weight="semibold">{verdict}</Typography>
            {sub ? (
                <Typography type="body-xs" color="muted">{sub}</Typography>
            ) : null}

            {meter ? (
                <div className="relative">
                    <ProgressMeter value={meter.value} max={meterMax} color={band} />
                    {targetPercent === null ? null : (
                        // The line overshoots the thin track (-top-1/-bottom-1) so it stays
                        // visible instead of disappearing flush against the bar's own edges.
                        <div
                            className="pointer-events-none absolute -top-1 -bottom-1 w-px bg-foreground/40"
                            style={{ left: `${targetPercent}%` }}
                        >
                            <Typography
                                type="body-xs"
                                color="muted"
                                className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap"
                            >
                                {meter.target}{unit}
                            </Typography>
                        </div>
                    )}
                </div>
            ) : null}

            {splits && splits.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                    {splits.map((split, index) => (
                        // position-keyed: a fixed 2-up breakdown of the SAME headline number,
                        // never reordered/filtered at runtime like a normal list.
                        <div key={index} className="flex flex-col gap-1 rounded-2xl bg-default p-3">
                            <Typography type="body-xs" color="muted">{split.label}</Typography>
                            <Typography
                                type="h4"
                                weight="bold"
                                className={split.band ? BAND_TEXT[split.band] : undefined}
                            >
                                {split.value}
                            </Typography>
                        </div>
                    ))}
                </div>
            ) : null}

            {action ? <div>{action}</div> : null}
        </div>
    )
}
