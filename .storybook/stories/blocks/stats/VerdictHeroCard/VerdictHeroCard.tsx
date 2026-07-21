import React from "react"
import type { ReactNode } from "react"
import { Card, CardContent, Typography, cn } from "@heroui/react"
import { ProgressMeter } from "../ProgressMeter/ProgressMeter"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/stats/VerdictHeroCard`. Authored in Storybook (not
 * `src`); synced to `src` later.
 */

/**
 * Inlined faithful local copy of `@/components/blocks/cards/SectionCard` (the
 * header-less path VerdictHeroCard uses): HeroUI `Card`/`CardContent` — globals
 * already give it the 3xl radius, `p-3`, no-shadow + border.
 * TODO: swap for the SectionCard local when the cards category ports it.
 */
const SectionCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <Card className={cn(className)}>
        <CardContent className="flex flex-col gap-3">{children}</CardContent>
    </Card>
)

/** Semantic verdict tone — drives the big value's color, and the meter fill. */
export type VerdictHeroBand = "danger" | "warning" | "success"

/** The meter row inside a {@link VerdictHeroCard} — current progress toward an optional target mark. */
export interface VerdictHeroMeter {
    /** Current value, same unit as {@link VerdictHeroCardProps.value}. */
    value: number
    /** Denominator for the bar. @default 100 */
    max?: number
    /** Optional healthy-mark position on the bar — omit when there is no known target yet. */
    target?: number
}

/** One mini stat in a {@link VerdictHeroCard}'s optional split row. */
export interface VerdictHeroSplit {
    /** Muted caption above the value. */
    label: ReactNode
    /** The split's own value — pass the unit inline if it needs one. */
    value: ReactNode
    /** Colors this split's value by band; omit to keep it neutral foreground. */
    band?: VerdictHeroBand
}

/** Props for the {@link VerdictHeroCard} block. */
export interface VerdictHeroCardProps {
    /** The headline number, rendered large and colored by {@link VerdictHeroCardProps.band}. */
    value: number
    /** Suffix rendered muted right after the value (e.g. "%", "/100"). */
    unit?: string
    /** Verdict tone — drives the value color + (when {@link VerdictHeroCardProps.meter} is set) the bar fill. */
    band: VerdictHeroBand
    /** The one-line judgment sentence — always a real verdict, never a bare restatement of the number. */
    verdict: ReactNode
    /** Optional muted line under the verdict, giving the evidence behind it. */
    sub?: ReactNode
    /** Optional progress bar toward {@link VerdictHeroMeter.target}. Omit when there is no meaningful bar. */
    meter?: VerdictHeroMeter
    /** Optional 2-up mini-stat row that breaks the headline number down. Omit when the number has no natural split. */
    splits?: ReadonlyArray<VerdictHeroSplit>
    /** Optional primary action slot (caller supplies the actual `<Button>`). */
    action?: ReactNode
    /** Extra classes on the root element. */
    className?: string
}

/** Same tone pairing the `Score` block uses for a band-colored number on a plain surface. */
const BAND_TEXT: Record<VerdictHeroBand, string> = {
    danger: "text-danger-soft-foreground",
    warning: "text-warning-soft-foreground",
    success: "text-success-soft-foreground",
}

/**
 * The "phán xử" (judgment) hero shared by the Thống kê surfaces: a band-colored
 * headline value, a one-line verdict sentence, an optional muted evidence sub-line,
 * an optional {@link ProgressMeter} with a target mark, an optional 2-up split
 * breakdown, and an optional primary action slot. Every zone reads verdict →
 * evidence → action, never a number alone.
 *
 * Pure/props-only — no store, no fetch, no `useTranslations` (all copy arrives via props).
 *
 * @param props - {@link VerdictHeroCardProps}
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
                // StatPair: ONE surface-in-surface card — a border delineates it (not a bg-default fill). The
                // halves are split by a FULL-HEIGHT divider that touches the top+bottom border: `flex` + stretch
                // makes each half fill the height, so its `border-l` reaches both borders.
                <div className="flex overflow-hidden rounded-2xl border border-default">
                    {splits.map((split, index) => (
                        // position-keyed: a fixed N-up breakdown of the SAME headline number.
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
