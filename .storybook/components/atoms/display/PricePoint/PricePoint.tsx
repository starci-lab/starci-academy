import React from "react"
import type { ReactNode } from "react"
import { Skeleton as HeroSkeleton, Typography as HeroTypography, cn } from "@heroui/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — PricePoint: the tier / subscription price display
 * as ONE primitive — a prominent amount + optional struck original + optional
 * billing period, on one baseline. A "price" is a semantic UNIT, so it is a single
 * component (one anatomy node), NOT three raw `<Typography>` hand-rolled at the
 * call-site.
 *
 * NOTE — distinct from `commerce/PriceTag`: PriceTag is a PRODUCT-discount price
 * (VND/USD numbers + a −X% chip + a breakdown popover). PricePoint is a TIER price
 * (a pre-formatted amount + a billing `/period`) — different concept, own primitive.
 * NO `@/components` imports.
 */

/** Amount type scale — drives the main amount's size. */
export type PricePointSize = "sm" | "md" | "lg"

/** Amount `Typography` type per size. */
const SIZE_TO_TYPE: Record<PricePointSize, "h4" | "h3" | "h2"> = {
    sm: "h4",
    md: "h3",
    lg: "h2",
}

/**
 * Amount skeleton bar per size — glyph height centered in the real line box
 * (same box math as the shared Skeleton registry's `TYPE_TO_BAR`), so the
 * placeholder mirrors whichever amount size is selected instead of a fixed h3.
 */
const SIZE_TO_BAR: Record<PricePointSize, string> = {
    sm: "h-5 my-1",
    md: "h-6 my-1",
    lg: "h-[30px] my-[3px]",
}

/** Props for the {@link PricePoint} primitive. */
export interface PricePointProps {
    /** The price the user pays, PRE-FORMATTED by the caller (e.g. "299.000đ", "0đ", "$9"). */
    amount: ReactNode
    /** Optional struck-through original/list price shown beside the amount (e.g. "399.000đ"). */
    original?: ReactNode
    /** Optional billing period rendered small + muted after the amount (e.g. "/tháng"). */
    period?: ReactNode
    /** Amount size. Defaults to `"md"` (h3). */
    size?: PricePointSize
    /** `true` → render the skeleton mirror (amount + period placeholders). */
    isSkeleton?: boolean
    /** Anatomy tag: names this part so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
    /** Extra classes on the root. */
    className?: string
}

/**
 * PricePoint renders a price as one baseline-aligned unit: the amount (prominent),
 * an optional struck original, and an optional muted period. The primitive OWNS the
 * type scale + spacing; the caller passes pre-formatted strings.
 *
 * @param props - {@link PricePointProps}
 */
const PricePointBase = ({
    amount,
    original,
    period,
    size = "md",
    isSkeleton = false,
    anatPart,
    className,
}: PricePointProps) => {
    if (isSkeleton) {
        // Leaf skeleton OWNED by this atom (hybrid C) — bars sized to MIRROR the
        // real amount/period boxes (amount bar follows `size`; period bar mirrors
        // the `Typography.Xs`/body-xs glyph box), not the shared Skeleton registry.
        return (
            <div className={cn("flex flex-wrap items-baseline gap-2", className)} data-anat-part={anatPart}>
                <HeroSkeleton className={cn("w-1/3 rounded", SIZE_TO_BAR[size])} />
                {period ? <HeroSkeleton className="h-3 my-1 w-1/4 rounded" /> : null}
            </div>
        )
    }
    return (
        <div className={cn("flex flex-wrap items-baseline gap-2", className)} data-anat-part={anatPart}>
            {/* Main amount — prominent (primitive owns the scale). NOTE: `size="lg"` maps
                to `type="h2"`, which the `Typography.*` atom does NOT expose (only
                H3/H4/H5/Code) — kept as raw HeroUI `Typography` (aliased `HeroTypography`)
                since the type is picked dynamically from {@link SIZE_TO_TYPE}. */}
            <HeroTypography type={SIZE_TO_TYPE[size]} weight="semibold">{amount}</HeroTypography>
            {/* Struck-through original — line-through is text-decoration, allowed as className */}
            {original ? (
                <Typography.Base size="sm" color="muted" className="line-through" text={original} />
            ) : null}
            {/* Billing period — smallest muted text */}
            {period ? <Typography.Base size="xs" color="muted" text={period} /> : null}
        </div>
    )
}

/** `PricePoint.*` — tier price as one baseline unit (amount + optional original + period). */
export const PricePoint = Object.assign(PricePointBase, {
    Base: PricePointBase,
})
