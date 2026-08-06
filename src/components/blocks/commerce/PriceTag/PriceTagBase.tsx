import React from "react"
import { type SkeletonProps } from "@/components/frames/_slot"
import { Popover } from "@heroui/react"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"
import { Chip } from "@/components/atoms/chips/Chip"
import { Cluster } from "@/components/frames/Cluster"
import { StackV } from "@/components/frames/Stack"
import { KeyValueList } from "@/components/composites/data/KeyValue"
import { Typography } from "@/components/atoms/text/Typography"

/**
 * DESIGN — a single course/product price: the amount to pay (bold), the struck
 * list price, a `−X%` success chip, and a breakdown popover.
 *
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and wraps its render in
 * its OWN BlockAnatomy (Diagram + Tree) reflecting the parts THAT leaf composes —
 * there is no separate consolidated "Anatomy" story. The composition shifts with
 * the shape: no-discount shows only the amount; on-sale adds the struck price,
 * chip, popover, and saving line; `showSavingLine={false}` drops that last line.
 */

/** Currency a price is shown in. */
export type PriceCurrency = "VND" | "USD"

/**
 * How loud the price is on its surface — decides the amount's font size. INTERNAL,
 * and deliberately NOT named `role`: that word is a DOM/ARIA attribute, so a prop by
 * that name reads as an accessibility role to both a reader and to eslint-jsx-a11y
 * (which flagged `role="prominent"` as an invalid ARIA role three times).
 * not exposed as a prop (§14d.1): the caller picks a MEMBER (`PriceTagInline` /
 * `PriceTagProminent`), not a size.
 */
export type PriceEmphasis = "inline" | "prominent"

/** Breakdown rows for the breakdown popover (amounts in the SAME currency as the price). */
export interface PriceBreakdown {
    /** Active-phase price BEFORE loyalty (the middle step list -> phase -> charge). */
    phase: number
    /** Localised phase name (e.g. "Early-bird") shown on the phase row. */
    phaseLabel?: string
    /** Loyalty discount percent (0 = no loyalty row). */
    loyaltyPercent: number
    /** Localised loyalty note (e.g. "already owns 2 courses") appended to the loyalty row. */
    loyaltyNote?: string
}

/** Every word the breakdown popover says — resolved by the connected {@link PriceTag}. */
export interface PriceTagLabels {
    /** Popover heading, and its accessible name. */
    breakdownTitle: string
    /** Row label for the pre-discount price. */
    listPrice: string
    /** Row label for the phase discount (already folded with the phase name when there is one). */
    phaseRow: string
    /** Row label for the loyalty discount (already folded with the loyalty note when there is one). */
    loyaltyRow: string
    /** Row label for the total the buyer actually pays. */
    youPay: string
}

/** Props for the {@link PriceTag} block. */
export interface PriceTagProps {
    /** Breakdown-popover copy, already localized. A story passes i18n keys. */
    labels: PriceTagLabels
    /** The price the user actually pays. */
    discounted: number
    /** The pre-discount (list/MSRP) price; struck through when greater than discounted. */
    original?: number | null
    /** Currency to format in. Defaults to "VND". */
    currency?: PriceCurrency
    /**
 * `true` -> the price is in its RESTING state: the amount, the struck-through
 * original price, the `−X%` chip, and the saving line all turn to shimmer,
 * KEEPING the same line boxes so nothing jumps in layout (§8).
 *
 * The flag FLOWS DOWN into the atoms that render each part (`Typography`,
 * `Chip`), instead of building a second shimmer tree (§12c). The popover
 * is TURNED OFF while resting — there is no data to open yet, and a pressable
 * control while loading is a false promise.
 */
    isSkeleton?: boolean
    /**
 * Optional phase-tier + loyalty rows for the breakdown {@link Popover}. Whenever
 * there IS a saving the `−X%` chip is ALWAYS a button that opens the popover (at
 * minimum list price -> "you pay"); `breakdown` just adds the middle steps that
 * explain WHERE the drop came from. Click/tap (not hover) so it works on touch too.
 */
    breakdown?: PriceBreakdown
    /**
 * Show the concrete "save N₫" line under the price (the real VND saved, not just
 * the percent). Defaults to `true`; set `false` where space is tight (dense cards).
 */
    showSavingLine?: boolean
    /** Where the root sits inside its parent. */
    classNames?: Array<AllowedClassName>
}

/**
 * Role -> amount font size.
 */
const AMOUNT_TYPE: Record<PriceEmphasis, "base" | "h4"> = {
    inline: "base",
    prominent: "h4",
}

/** Role -> struck-through original-price line size, placed next to {@link AMOUNT_TYPE} so the two scales don't drift apart. */
const ORIGINAL_TYPE: Record<PriceEmphasis, "xs" | "sm"> = {
    inline: "xs",
    prominent: "sm",
}

/** Format an amount in the given currency. */
export const formatPrice = (amount: number, currency: PriceCurrency): string =>
    currency === "USD"
        ? amount.toLocaleString("en-US", { style: "currency", currency: "USD" })
        : `${amount.toLocaleString("vi-VN")}₫`

/** Whole-percent saving between a "before" and an "after" amount (0 when none). */
const savingPercent = (before: number, after: number): number =>
    before > after ? Math.round((1 - after / before) * 100) : 0

/**
 * The single source of truth for rendering a course/product price: the discounted
 * amount (bold), the list price struck through (only when there IS a saving), and a
 * `−X%` success chip whose percent is the REAL list -> charge gap (phase tier +
 * loyalty). Whenever there is a saving the chip is a clickable button opening a
 * {@link Popover} (at minimum list price -> you pay; `breakdown` adds the phase +
 * loyalty steps). Works in VND or USD.
 *
 * @param props - {@link PriceTagProps}
 */
export const PriceTagBase = ({
    discounted,
    original,
    currency = "VND",
    emphasis,
    isSkeleton = false,
    breakdown,
    showSavingLine = true,
    classNames,
    labels,
}: PriceTagProps & { emphasis: PriceEmphasis }) => {
    const hasSaving = original != null && original > discounted
    const savePercent = hasSaving ? savingPercent(original, discounted) : 0

    // the −X% saving chip — composed from the `Chip` atom (tone success ->
    // soft-success chip, matching src's raw `<Chip variant="soft" color="success">`).
    // The pressable/focusable button role lives on the canonical `Popover.Trigger`
    // wrapper (react-aria: role=button, aria-expanded/controls, tabindex), so there is
    // exactly ONE interactive element. No caret; the whole chip is the affordance.
    const chip =
        savePercent > 0 ? (
            <Chip
                tone="success"
                text={`−${savePercent}%`}
            />
        ) : null

    // phase saving = list -> phase ; loyalty saving = phase -> charge
    const phaseSave = original != null ? savingPercent(original, breakdown?.phase ?? discounted) : 0
    // Popover content — shown for EVERY saving (so the chip is always clickable), at
    // minimum list price -> you pay. The phase-tier & loyalty rows only appear when a
    // full `breakdown` is supplied.
    const breakdownContent = hasSaving ? (
        // Those four rows are all ONE shape: label left <-> value right, repeated =>
        // exactly `KeyValueList` (a repeated list => `items` is DATA). The "you
        // pay" row is the TOTAL row => `emphasis`, not a hand-drawn rule: the frame
        // already knows how to emphasise a total row, and that emphasis looks the same
        // across every price table in the system.
        //
        // WARNING️ The frame does NOT format for you: every money string coming in here
        // has already gone through `formatPrice`.
        // WARNING️ This column is NOT badged: the panel groups nodes BY NAME (`firstEl` keeps
        // only the first element of each name), so two `StackV`s with the same name
        // would MERGE into one node and the tree would read wrong. The node that
        // matters inside the popover is `KeyValueList` — that one is badged; the
        // wrapping column is just `p-3` padding.
        // Two vertical rows inside a design (the eyebrow and the breakdown list) =
        // `grouped`, not `tight`. `tight` (1) is reserved for what sits INSIDE a
        // composite, e.g. the icon+label pair of `InlineIconLabel`.
        <StackV gap={4} principle="cell-pad"
            explain="Tight cell inset — not card-padding, because this sits inside a dense table or list cell rather than a card body."
            padding={4} isSkeleton={isSkeleton} body={() => (
                <StackV gap={4} principle="label-field"
                    explain="Form label above its field — not title-subtitle, because the upper line labels an input rather than a heading pair."
                    isSkeleton={isSkeleton} items={[
                        ({ isSkeleton }: SkeletonProps) => <Typography size="xs" color="muted" text={labels.breakdownTitle} isSkeleton={isSkeleton} />,
                        // No `gap` passed: `KeyValueList` already owns its row rhythm (its own default
                        // is the §10b `grouped` step). Passing one from here overrides the composite's
                        // spacing from OUTSIDE, which §10 forbids — a composite owns its internal
                        // spacing and must not receive it.
                        ({ isSkeleton }: SkeletonProps) => (
                            <KeyValueList
                                isSkeleton={isSkeleton}
                                items={[
                                    {
                                        key: "list",
                                        label: labels.listPrice,
                                        value: formatPrice(original ?? discounted, currency),
                                    },
                                    ...(breakdown && original != null && original > breakdown.phase
                                        ? [{
                                            key: "phase",
                                            label: labels.phaseRow,
                                            // NOTE: `KeyValueListItem.value` is now a plain `string` — this row
                                            // loses the `color="success-soft"` (green) tint it used to carry via
                                            // its own `Typography`. `KeyValueRow` only renders `value` through the
                                            // emphasis/plain split, no per-row tone prop. Preserving the green
                                            // accent needs either accepting the loss (done here) or a future
                                            // `tone`/`accent` field on `KeyValueListItem` — left for whoever owns
                                            // PriceTag/KeyValue next, not decided in this pass.
                                            value: `−${formatPrice(original - breakdown.phase, currency)} (−${phaseSave}%)`,
                                        }]
                                        : []),
                                    ...(breakdown && breakdown.loyaltyPercent > 0 && breakdown.phase > discounted
                                        ? [{
                                            key: "loyalty",
                                            label: labels.loyaltyRow,
                                            // See the "phase" row's note above — same loss of the green tint,
                                            // same reason.
                                            value: `−${formatPrice(breakdown.phase - discounted, currency)} (−${breakdown.loyaltyPercent}%)`,
                                        }]
                                        : []),
                                    {
                                        key: "total",
                                        label: labels.youPay,
                                        value: formatPrice(discounted, currency),
                                        // the TOTAL row: the frame handles the emphasis, replacing a hand-typed `border-t … pt-1`
                                        emphasis: true,
                                    },
                                ]}
                            />
                        ),
                    ]} />
            )} />
    ) : null

    // The price row aligns on BASELINE (big number, struck number, chip share the
    // same text baseline) and wraps on its own when tight => exactly `Cluster`.
    // The three elements are THREE separate items, not merged into one
    // fragment — merging them leaves the frame's `gap` with nowhere to apply.
    const priceRow = (
        <Cluster
            gap={3}
            principle="value-row"
            explain="Holds a label and its numeric value on one baseline so the count stays readable against the label."
            align="baseline"

            items={[
                // The amount goes through the ATOM `Typography` (§9c), NOT raw
                // HeroUI — thanks to that, `isSkeleton` flows straight into it instead
                // of branching off to build a separate shimmer bar.
                () => (
                    <Typography
                        size={AMOUNT_TYPE[emphasis]}
                        weight="bold"
                        isSkeleton={isSkeleton}
                        classNames={isSkeleton ? ["w-2/3"] : undefined}

                        text={formatPrice(discounted, currency)}
                    />
                ),
                ...(hasSaving
                    ? [() => (
                        <Typography
                            size={ORIGINAL_TYPE[emphasis]}
                            color="muted"
                            isSkeleton={isSkeleton}
                            isStruck
                            classNames={isSkeleton ? ["w-1/3"] : undefined}

                            text={formatPrice(original, currency)}
                        />
                    )]
                    : []),
                // While resting: the chip still holds its place but is NOT wrapped in a
                // Popover — there's no data yet to open, and a pressable control while
                // loading is a false promise.
                ...(isSkeleton
                    ? [() => <Chip isSkeleton />]
                    : savePercent > 0
                        ? [() => (
                            <Popover>
                                <Popover.Trigger
                                    aria-label={labels.breakdownTitle}
                                    className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"

                                >
                                    {chip}
                                </Popover.Trigger>
                                <Popover.Content
                                    className="max-w-xs"

                                >
                                    {breakdownContent}
                                </Popover.Content>
                            </Popover>
                        )]
                        : []),
            ]}
        />
    )

    const savingLine = showSavingLine && (isSkeleton || hasSaving) ? (
        <Typography
            size="xs"
            color="muted"
            isSkeleton={isSkeleton}
            classNames={isSkeleton ? ["w-1/2"] : undefined}

            text={hasSaving ? `Save ${formatPrice(original - discounted, currency)}` : undefined}
        />
    ) : null

    return (
        // The outer column = two DIFFERENT lines (the price row · the "saving" line) =>
        // `StackV`, NOT `Cluster`: a cluster is ONE track of N PEER elements (§13b).
        <StackV
            // `grouped` (§10b): the price row and the saving line are two DIFFERENT vertical
            // rows of one design. It was `tight` (1), which §10b reserves for pairs sitting
            // inside a lower-tier component — the saving line read as if it were glued under the number.
            gap={4}
            classNames={classNames}
            isSkeleton={isSkeleton}
            items={[
                () => priceRow,
                () => savingLine,
            ]}
        />
    )
}
