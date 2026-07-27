import type { ReactNode } from "react"
import { Skeleton as HeroSkeleton, cn } from "@heroui/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import type { TypographySize } from "@sb-components/atoms/text/Typography/Typography"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — PricePoint: the tier / subscription price display
 * as ONE atom — a prominent amount + optional struck original + optional
 * billing period, on one baseline. A "price" is a semantic UNIT, so it is a single
 * component (one anatomy node), NOT three raw `<Typography>` hand-rolled at the
 * call-site.
 *
 * NOTE — distinct from `commerce/PriceTag`: PriceTag is a PRODUCT-discount price
 * (VND/USD numbers + a −X% chip + a breakdown popover). PricePoint is a TIER price
 * (a pre-formatted amount + a billing `/period`) — different concept, own atom.
 * NO `@/components` imports.
 */

/** Amount type scale — drives the main amount's size, and (via {@link SIZE_TO_TOKENS}) the original/period sizes riding along with it. */
export type PricePointSize = "sm" | "md" | "lg"

/**
 * MỘT BẢNG DUY NHẤT theo `size` cho cả ba phần — amount (Typography heading) +
 * original + period (Typography body). Trước đây `original`/`period` khoá cứng
 * `sm`/`xs` bất kể `size`, nên ở `size="lg"` (amount to bằng h2) chúng nhỏ lạc lõng
 * bên cạnh con số lớn. `periodBarH` là chiều cao thanh skeleton của `period`, đi kèm
 * để bar MIRROR đúng cỡ chữ thật của bậc đó (§12d) thay vì khoá cứng một cỡ.
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
    /** Anatomy tag: names the ROOT part so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
    /** `true` → tag `Amount`/`Original`/`Period` with `data-anat-part`, and forward down into the composed `Typography` calls. */
    showAnatomy?: boolean
    /** Extra classes on the root. */
    className?: string
}

/**
 * `amount` BẮT BUỘC khi render giá thật, KHÔNG cần khi `isSkeleton` — thanh
 * shimmer không có nội dung để đọc. Union ép luật đó ở compile-time (§12c), thay vì
 * hạ `amount` xuống optional đại trà và mất lưới an toàn.
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
    anatPart,
    showAnatomy = false,
    className,
}: PricePointProps) => {
    const tokens = SIZE_TO_TOKENS[size]

    if (isSkeleton) {
        // Leaf skeleton OWNED by this atom (hybrid C) — bars sized to MIRROR the
        // real amount/period boxes (amount bar follows `size`; period bar follows
        // the SAME size table as the real `period` Typography), not a shared,
        // one-size-fits-all Skeleton registry entry.
        return (
            <div className={cn("flex flex-wrap items-baseline gap-2", className)} data-anat-part={anatPart}>
                <HeroSkeleton
                    className={cn("w-1/3 rounded", SIZE_TO_BAR[size])}
                    data-anat-part={showAnatomy ? "Skeleton" : undefined}
                />
                {period ? (
                    <HeroSkeleton
                        className={cn("my-1 w-1/4 rounded", tokens.periodBarH)}
                        data-anat-part={showAnatomy ? "Skeleton" : undefined}
                    />
                ) : null}
            </div>
        )
    }
    return (
        <div className={cn("flex flex-wrap items-baseline gap-2", className)} data-anat-part={anatPart}>
            {/* Main amount — prominent, sized off {@link SIZE_TO_TOKENS}. Composed via
                `Typography` (which now covers h1–h5) instead of raw HeroUI
                `Typography`, so `showAnatomy` forwards down like `original`/`period`. */}
            <Typography
                size={tokens.amount}
                weight="semibold"
                text={amount}
                showAnatomy={showAnatomy}
                anatPart="Typography"
            />
            {/* Struck-through original — line-through is text-decoration, allowed as className */}
            {original ? (
                <Typography
                    size={tokens.original}
                    color="muted"
                    className="line-through"
                    text={original}
                    showAnatomy={showAnatomy}
                    anatPart="Typography"
                />
            ) : null}
            {/* Billing period — smallest muted text at this size */}
            {period ? (
                <Typography
                    size={tokens.period}
                    color="muted"
                    text={period}
                    showAnatomy={showAnatomy}
                    anatPart="Typography"
                />
            ) : null}
        </div>
    )
}

/** `PricePoint.*` — tier price as one baseline unit (amount + optional original + period). */
export { PricePointBase as PricePoint }
