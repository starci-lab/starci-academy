import React from "react"
import { Popover, Typography, cn } from "@heroui/react"
import { StatusChip } from "../../chips/StatusChip/StatusChip"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — BLOCK ported faithfully from
 * `@/components/blocks/commerce/PriceTag`. The `next-intl` `useTranslations` strings are
 * INLINED locally (vi). The `−X%` saving chip — a raw `<Chip variant="soft"
 * color="success">` in `src` — is COMPOSED from the local `StatusChip` primitive
 * (`tone="success"` yields the byte-identical soft-success chip), so the block genuinely
 * composes a primitive instead of re-drawing one. Synced to `src` later.
 */

/** Currency a price is shown in. */
export type PriceCurrency = "VND" | "USD"

/** Visual size of the price (drives the discounted amount's type scale). */
export type PriceTagSize = "sm" | "md" | "lg"

/** Breakdown rows for the breakdown popover (amounts in the SAME currency as the price). */
export interface PriceBreakdown {
    /** Active-phase price BEFORE loyalty (the middle step list → phase → charge). */
    phase: number
    /** Localised phase name (e.g. "Early-bird") shown on the phase row. */
    phaseLabel?: string
    /** Loyalty discount percent (0 = no loyalty row). */
    loyaltyPercent: number
    /** Localised loyalty note (e.g. "đã sở hữu 2 khóa") appended to the loyalty row. */
    loyaltyNote?: string
}

/** Props for the {@link PriceTag} block. */
export interface PriceTagProps {
    /** The price the user actually pays. */
    discounted: number
    /** The pre-discount (list/MSRP) price; struck through when greater than discounted. */
    original?: number | null
    /** Currency to format in. Defaults to "VND". */
    currency?: PriceCurrency
    /** Size of the discounted amount. Defaults to "md". */
    size?: PriceTagSize
    /**
     * Optional phase-tier + loyalty rows for the breakdown {@link Popover}. Whenever
     * there IS a saving the `−X%` chip is ALWAYS a button that opens the popover (at
     * minimum list price → "you pay"); `breakdown` just adds the middle steps that
     * explain WHERE the drop came from. Click/tap (not hover) so it works on touch too.
     */
    breakdown?: PriceBreakdown
    /**
     * Show the concrete "save N₫" line under the price (the real VND saved, not just
     * the percent). Defaults to `true`; set `false` where space is tight (dense cards).
     */
    showSavingLine?: boolean
    /** Extra classes on the root. */
    className?: string
    /** Anatomy tag: names this part so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
    /** When on, emit `data-anat-part` on each composed part so a BlockAnatomy panel can badge it on-render. */
    showAnatomy?: boolean
}

/** size → discounted-amount type. */
const AMOUNT_TYPE: Record<PriceTagSize, "body" | "h4" | "h3"> = {
    sm: "body",
    md: "h4",
    lg: "h3",
}

/** Format an amount in the given currency. */
const formatPrice = (amount: number, currency: PriceCurrency): string =>
    currency === "USD"
        ? amount.toLocaleString("en-US", { style: "currency", currency: "USD" })
        : `${amount.toLocaleString("vi-VN")}₫`

/** Whole-percent saving between a "before" and an "after" amount (0 when none). */
const savingPercent = (before: number, after: number): number =>
    before > after ? Math.round((1 - after / before) * 100) : 0

/**
 * The single source of truth for rendering a course/product price: the discounted
 * amount (bold), the list price struck through (only when there IS a saving), and a
 * `−X%` success chip whose percent is the REAL list → charge gap (phase tier +
 * loyalty). Whenever there is a saving the chip is a clickable button opening a
 * {@link Popover} (at minimum list price → you pay; `breakdown` adds the phase +
 * loyalty steps). Works in VND or USD.
 *
 * @param props - {@link PriceTagProps}
 */
export const PriceTag = ({
    discounted,
    original,
    currency = "VND",
    size = "md",
    breakdown,
    showSavingLine = true,
    className,
    anatPart,
    showAnatomy,
}: PriceTagProps) => {
    const hasSaving = original != null && original > discounted
    const savePercent = hasSaving ? savingPercent(original, discounted) : 0

    // the −X% saving chip — composed from the StatusChip primitive (tone success →
    // soft-success chip, matching src's raw `<Chip variant="soft" color="success">`).
    // The pressable/focusable button role lives on the canonical `Popover.Trigger`
    // wrapper (react-aria: role=button, aria-expanded/controls, tabindex), so there is
    // exactly ONE interactive element. No caret; the whole chip is the affordance.
    const chip =
        savePercent > 0 ? (
            <StatusChip tone="success" anatPart={showAnatomy ? "StatusChip" : undefined}>
                {`−${savePercent}%`}
            </StatusChip>
        ) : null

    // phase saving = list → phase ; loyalty saving = phase → charge
    const phaseSave = original != null ? savingPercent(original, breakdown?.phase ?? discounted) : 0
    // Popover content — shown for EVERY saving (so the chip is always clickable), at
    // minimum list price → you pay. The phase-tier & loyalty rows only appear when a
    // full `breakdown` is supplied.
    const breakdownContent = hasSaving ? (
        <div className="flex flex-col gap-1 p-3">
            <Typography type="body-xs" color="muted">
                Chi tiết giá
            </Typography>
            <div className="flex items-center justify-between gap-3">
                <Typography type="body-sm">Giá gốc</Typography>
                <Typography type="body-sm">{formatPrice(original ?? discounted, currency)}</Typography>
            </div>
            {breakdown && original != null && original > breakdown.phase ? (
                <div className="flex items-center justify-between gap-3">
                    <Typography type="body-sm" color="muted">
                        {breakdown.phaseLabel ? `Giai đoạn ${breakdown.phaseLabel}` : "Ưu đãi giai đoạn"}
                    </Typography>
                    <Typography type="body-sm" className="text-success-soft-foreground">
                        {`−${formatPrice(original - breakdown.phase, currency)} (−${phaseSave}%)`}
                    </Typography>
                </div>
            ) : null}
            {breakdown && breakdown.loyaltyPercent > 0 && breakdown.phase > discounted ? (
                <div className="flex items-center justify-between gap-3">
                    <Typography type="body-sm" color="muted" className="min-w-0 truncate">
                        {breakdown.loyaltyNote ? `Ưu đãi thành viên · ${breakdown.loyaltyNote}` : "Ưu đãi thành viên"}
                    </Typography>
                    <Typography type="body-sm" className="shrink-0 text-success-soft-foreground">
                        {`−${formatPrice(breakdown.phase - discounted, currency)} (−${breakdown.loyaltyPercent}%)`}
                    </Typography>
                </div>
            ) : null}
            <div className="flex items-center justify-between gap-3 border-t border-default pt-1">
                <Typography type="body-sm" weight="semibold">Bạn trả</Typography>
                <Typography type="body-sm" weight="semibold">{formatPrice(discounted, currency)}</Typography>
            </div>
        </div>
    ) : null

    return (
        <div className={cn("flex flex-col gap-1", className)} data-anat-part={anatPart}>
            <div className="flex flex-wrap items-baseline gap-2">
                <Typography
                    type={AMOUNT_TYPE[size]}
                    weight="bold"
                    data-anat-part={
                        showAnatomy ? (hasSaving ? "Typography · giá phải trả" : "Typography") : undefined
                    }
                >
                    {formatPrice(discounted, currency)}
                </Typography>
                {hasSaving ? (
                    <Typography
                        type={size === "sm" ? "body-xs" : "body-sm"}
                        color="muted"
                        className="line-through"
                        data-anat-part={showAnatomy ? "Typography · giá gốc" : undefined}
                    >
                        {formatPrice(original, currency)}
                    </Typography>
                ) : null}
                {savePercent > 0 ? (
                    <Popover>
                        <Popover.Trigger
                            aria-label="Chi tiết giá"
                            className="cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                            data-anat-part={showAnatomy ? "Popover.Trigger" : undefined}
                        >
                            {chip}
                        </Popover.Trigger>
                        <Popover.Content
                            className="max-w-xs"
                            data-anat-part={showAnatomy ? "Popover.Content" : undefined}
                        >
                            {breakdownContent}
                        </Popover.Content>
                    </Popover>
                ) : null}
            </div>
            {showSavingLine && hasSaving ? (
                <Typography
                    type="body-xs"
                    color="muted"
                    data-anat-part={showAnatomy ? "Typography · tiết kiệm" : undefined}
                >
                    {`Tiết kiệm ${formatPrice(original - discounted, currency)}`}
                </Typography>
            ) : null}
        </div>
    )
}
