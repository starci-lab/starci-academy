import React from "react"
import type { ReactNode } from "react"
import { Typography, cn } from "@heroui/react"
import { ProgressMeter } from "@/components/blocks/stats/ProgressMeter"
import { SectionCard } from "@/components/blocks/cards/SectionCard"
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
 * No left accent band (2026-07-18 — thầy: bỏ verdict; the §3i `SectionCard
 * withVerdict` band was dropped, the `band` prop now only colors the value / meter
 * / split values). The `splits` render as ONE surface-in-surface StatPair card
 * (border, bg-surface, full-height divider), and the meter's target mark is the
 * canonical `ProgressMeter` `target` prop — none hand-rolled here.
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

    return (
        <SectionCard className={className}>
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
                <ProgressMeter
                    value={meter.value}
                    max={meterMax}
                    color={band}
                    target={meter.target}
                    targetLabel={meter.target === undefined ? undefined : `${meter.target}${unit ?? ""}`}
                />
            ) : null}

            {splits && splits.length > 0 ? (
                // StatPair: ONE surface-in-surface card — the parent SectionCard's bg-surface shows through, a
                // border delineates it (surface-in-surface = border, not a bg-default fill). The halves are split by
                // a FULL-HEIGHT divider that touches the top+bottom border: `flex` + stretch (default) makes each
                // half fill the height, so its `border-l` reaches both borders.
                <div className="flex overflow-hidden rounded-2xl border border-default">
                    {splits.map((split, index) => (
                        // position-keyed: a fixed N-up breakdown of the SAME headline number,
                        // never reordered/filtered at runtime like a normal list.
                        <div key={index} className={cn("flex flex-1 flex-col gap-1 p-3", index > 0 && "border-l border-default")}>
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
        </SectionCard>
    )
}
