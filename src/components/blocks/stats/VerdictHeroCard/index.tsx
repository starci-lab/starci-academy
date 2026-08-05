import React, { type ComponentType } from "react"
import type { ReactNode } from "react"
import { ProgressMeter } from "@/components/composites/stats/ProgressMeter"
import { SectionCard } from "@/components/blocks/cards/SectionCard"
import { Typography, type TypographyColor } from "@/components/atoms/text/Typography"
import { StackH, StackV } from "@/components/frames/Stack"

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
    /** Muted caption above the value (e.g. "Cards mastered") — a buildable slot. */
    label: ComponentType
    /** The split's own value — pass the unit inline if it needs one (this row has no separate `unit` prop). */
    value: string
    /** Colors this split's value by band; omit to keep it neutral foreground (e.g. a split that isn't itself good/bad). */
    band?: VerdictHeroBand
}

/** Props for the {@link VerdictHeroCard} block. */
export interface VerdictHeroCardProps {
    /** The headline number, rendered large and colored by {@link VerdictHeroCardProps.band}. */
    value: number
    /** Suffix rendered muted right after the value (e.g. "%", "/100"). */
    unit?: string
    /** Verdict tone — see {@link VerdictHeroBand}. Drives the left accent border + value color + (when {@link VerdictHeroCardProps.meter} is set) the bar fill. */
    band: VerdictHeroBand
    /** The one-line judgment sentence (e.g. "You're overloaded — adding new cards faster than you can retain them."). This is the "verdict" — always render a real verdict, never a bare restatement of the number. */
    verdict: ReactNode
    /** Optional muted line under the verdict, giving the evidence behind it. */
    sub?: string
    /** Optional progress bar toward {@link VerdictHeroMeter.target}. Omit when the surface has no meaningful bar to show (e.g. a pure count). */
    meter?: VerdictHeroMeter
    /** Optional 2-up mini-stat row that breaks the headline number down (e.g. mature vs young retention) — the "▽" evidence framing. Omit when the number has no natural split. */
    splits?: ReadonlyArray<VerdictHeroSplit>
    /** Optional primary action slot (caller supplies the actual button) — a buildable slot. */
    action?: ComponentType
}

/**
 * Same tone pairing the `Score` block hand-rolls for a band-colored number on a plain
 * (non-tinted) surface (`src/components/blocks/stats/Score/component.tsx`).
 *
 * MISSING VOCABULARY: no `Typography` atom `size` renders `text-4xl` (its scale stops at
 * `h1`, which wraps HeroUI's own proprietary heading treatment, not a raw `text-4xl`), so a
 * hero stat number can't go through the atom at all — this is the SAME hand-rolled span the
 * `Score` block already carries for the identical reason, kept minimal and local here rather
 * than reopening a leaf's `className`.
 */
const BAND_TEXT: Record<VerdictHeroBand, string> = {
    danger: "text-danger-soft-foreground",
    warning: "text-warning-soft-foreground",
    success: "text-success-soft-foreground",
}

/**
 * `VerdictHeroSplit.band` → the closest {@link TypographyColor} the `Typography` atom exposes.
 *
 * MISSING VOCABULARY: `success` has an exact soft-foreground match (`"success-soft"`), but
 * `TypographyColor` has no `danger-soft` / `warning-soft` member (only `success-soft` and
 * `accent-soft` exist) — those two bands fall back to the atom's full-strength tone instead of
 * the softer one `BAND_TEXT` uses for the headline value above.
 */
const SPLIT_VALUE_COLOR: Record<VerdictHeroBand, TypographyColor> = {
    danger: "danger",
    warning: "warning",
    success: "success-soft",
}

/**
 * The "verdict" (judgment) hero shared by all 3 Statistics surfaces (review /
 * interview / quiz): a band-colored headline value, a one-line verdict
 * sentence, an optional muted evidence sub-line, an optional
 * {@link ProgressMeter} with a target mark, an optional 2-up split
 * breakdown, and an optional primary action slot. Replaces the old "bare number"
 * hero — every zone here reads verdict → evidence → action, never a number
 * alone (`stats-insight-redesign` proposal).
 *
 * No left accent band (2026-07-18 — the teacher: drop the verdict band; the §3i `SectionCard
 * withVerdict` band was dropped, the `band` prop now only colors the value / meter
 * / split values). The `splits` render as ONE surface-in-surface bordered row (rounded,
 * overflow-hidden, `SectionCard`'s own `bg-surface` shows through) with a full-height
 * divider between cells, `StackH`'s own `divider` (not a hand-rolled `border-l`).
 *
 * Pure/props-only — no store, no fetch, no `useTranslations` (all copy
 * arrives via props from a caller that already translated it). No `className` (BLOCK-4):
 * nothing calls this with one today, and a per-call restyle belongs one tier down, named.
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
    action: Action,
}: VerdictHeroCardProps) => {
    const meterMax = meter?.max ?? 100

    return (
        <SectionCard>
            <StackH
                gap={2}
                align="baseline"
                items={[
                    () => <span className={`text-4xl font-bold tabular-nums ${BAND_TEXT[band]}`}>{value}</span>,
                    ...(unit ? [() => <Typography size="sm" color="muted" text={unit} />] : []),
                ]}
            />

            <Typography size="sm" weight="semibold" text={verdict} />
            {sub ? (
                <Typography size="xs" color="muted" text={sub} />
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
                // Surface-in-surface: a bordered, rounded, clipped row sitting on top of
                // SectionCard's own bg-surface. `StackH`'s `divider` inserts a real (atom)
                // vertical rule between cells with `self-stretch`, so it reaches the full
                // height of the tallest cell — the FRAME/atom equivalent of the old
                // hand-rolled `border-l` per cell past the first.
                <div className="overflow-hidden rounded-2xl border border-default">
                    <StackH
                        gap={1}
                        align="stretch"
                        divider
                        items={splits.map((split) => () => {
                            const SplitLabel = split.label
                            return (
                                // position-keyed: a fixed N-up breakdown of the SAME headline number,
                                // never reordered/filtered at runtime like a normal list.
                                <StackV
                                    gap={2}
                                    padding={4}
                                    classNames={["flex-1"]}
                                    items={[
                                        () => <Typography size="xs" color="muted" text={<SplitLabel />} />,
                                        () => (
                                            <Typography
                                                size="h4"
                                                weight="bold"
                                                color={split.band ? SPLIT_VALUE_COLOR[split.band] : undefined}
                                                text={split.value}
                                            />
                                        ),
                                    ]}
                                />
                            )
                        })}
                    />
                </div>
            ) : null}

            {Action ? <div><Action /></div> : null}
        </SectionCard>
    )
}
