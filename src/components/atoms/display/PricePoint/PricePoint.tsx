import type { ReactNode } from "react"
import { Skeleton as HeroSkeleton, cn } from "@heroui/react"
import { Typography } from "@/components/atoms/text/Typography/Typography"
import type { TypographySize } from "@/components/atoms/text/Typography/Typography"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"

/**
 * PricePoint: the tier / subscription price display as one atom — a prominent
 * amount + optional struck original + optional billing period, on one baseline.
 *
 * Distinct from `commerce/PriceTag`, which is a product-discount price (VND/USD
 * numbers + a −X% chip + a breakdown popover). PricePoint takes a pre-formatted
 * amount plus a billing `/period`.
 */

/** Amount type scale — drives the main amount's size, and (via {@link SIZE_TO_TOKENS}) the original/period sizes riding along with it. */
export type PricePointSize = "sm" | "md" | "lg"

/**
 * One table per `size` for all three parts — amount (Typography heading) +
 * original + period (Typography body). `periodBarH` is the skeleton bar height
 * for `period`, kept in step so the bar mirrors that size's real text height.
 */
const SIZE_TO_TOKENS: Record<
    PricePointSize,
    { amount: "h4" | "h3" | "h2"; original: TypographySize; period: TypographySize; periodBarH: string }
> = {
    sm: { amount: "h4", original: "xs", period: "xs", periodBarH: "h-3" },
    md: { amount: "h3", original: "sm", period: "xs", periodBarH: "h-3" },
    lg: { amount: "h2", original: "base", period: "sm", periodBarH: "h-[14px]" },
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

/** Props shared by every `amount`/`isSkeleton` combination — see {@link PricePointProps}. */
interface PricePointOwnProps {
    /** Optional struck-through original/list price shown beside the amount (e.g. "399.000đ"). */
    original?: ReactNode
    /** Optional billing period rendered small + muted after the amount (e.g. "/tháng"). */
    period?: ReactNode
    /** Amount size — also drives `original`/`period`'s size via {@link SIZE_TO_TOKENS}. Defaults to `"md"` (h3). */
    size?: PricePointSize
    /** Extra classes on the root. @deprecated pass `classNames` instead — a free string cannot be constrained. */
    className?: string
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     * Prefer this over `className`; the string form is going away.
     */
    classNames?: Array<AllowedClassName>
}

/**
 * `amount` is required to render the live price, optional when `isSkeleton` —
 * the shimmer bar has no content to read.
 */
export type PricePointProps = PricePointOwnProps &
    (
        | { isSkeleton: true; amount?: ReactNode }
        | { isSkeleton?: false; amount: ReactNode }
    )

/**
 * PricePoint renders a price as one baseline-aligned unit: the amount (prominent),
 * an optional struck original, and an optional muted period. The atom OWNS the
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
    className,
    classNames,
}: PricePointProps) => {
    const tokens = SIZE_TO_TOKENS[size]

    if (isSkeleton) {
        // Bars are sized to mirror the real amount/period boxes: the amount bar
        // follows `size`, and the period bar follows the same size table as the
        // real `period` Typography, rather than a fixed one-size skeleton.
        return (
            <div className={cn("flex flex-wrap items-baseline gap-2", className, classNames)}>
                <HeroSkeleton
                    className={cn("w-1/3 rounded", SIZE_TO_BAR[size])}
                />
                {period ? (
                    <HeroSkeleton
                        className={cn("my-1 w-1/4 rounded", tokens.periodBarH)}
                    />
                ) : null}
            </div>
        )
    }
    return (
        <div className={cn("flex flex-wrap items-baseline gap-2", className, classNames)}>
            {/* Main amount — prominent, sized off {@link SIZE_TO_TOKENS}. */}
            <Typography
                size={tokens.amount}
                weight="semibold"
                text={amount}
            />
            {/* Struck-through original — line-through is text-decoration, allowed as className */}
            {original ? (
                <Typography
                    size={tokens.original}
                    color="muted"
                    isStruck
                    text={original}
                />
            ) : null}
            {/* Billing period — smallest muted text at this size */}
            {period ? (
                <Typography
                    size={tokens.period}
                    color="muted"
                    text={period}
                />
            ) : null}
        </div>
    )
}

/** `PricePoint.*` — tier price as one baseline unit (amount + optional original + period). */
export { PricePointBase as PricePoint }
