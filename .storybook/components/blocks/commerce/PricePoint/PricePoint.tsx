import React from "react"
import type { ReactNode } from "react"
import { Typography, cn } from "@heroui/react"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"

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
export const PricePoint = ({
    amount,
    original,
    period,
    size = "md",
    isSkeleton = false,
    anatPart,
    className,
}: PricePointProps) => {
    if (isSkeleton) {
        return (
            <div className={cn("flex flex-wrap items-baseline gap-2", className)} data-anat-part={anatPart}>
                <Skeleton.Typography type="h3" width="1/3" />
                {period ? <Skeleton.Typography type="body-xs" width="1/4" /> : null}
            </div>
        )
    }
    return (
        <div className={cn("flex flex-wrap items-baseline gap-2", className)} data-anat-part={anatPart}>
            {/* Main amount — prominent (primitive owns the scale) */}
            <Typography type={SIZE_TO_TYPE[size]} weight="semibold">{amount}</Typography>
            {/* Struck-through original — line-through is text-decoration, allowed as className */}
            {original ? (
                <Typography type="body-sm" color="muted" className="line-through">{original}</Typography>
            ) : null}
            {/* Billing period — smallest muted text */}
            {period ? <Typography type="body-xs" color="muted">{period}</Typography> : null}
        </div>
    )
}
