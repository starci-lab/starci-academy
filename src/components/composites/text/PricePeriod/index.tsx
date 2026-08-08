import { cn } from "@heroui/react"
import { Typography } from "@/components/atoms/text/Typography"

/**
 * PricePeriod: a price shown as one baseline-aligned unit — a prominent amount, an
 * optional struck original/list price, and an optional billing period ("/month").
 *
 * This is a COMPOSITE, not an atom: a price is a CLUSTER of distinct values (a
 * `value-row`), not one atom's single concern. It replaces the retired `PricePoint`
 * atom, which reached ATOM-3 by rendering raw spans instead of the house `Typography`
 * atom — this component fixes that by composing `Typography` for all three parts, so
 * each part draws its own tone AND its own skeleton bar.
 *
 * Distinct from `commerce/PriceTag`, which is a product-discount price (VND/USD
 * numbers + a −X% chip + a breakdown popover). `PricePeriod` takes pre-formatted
 * strings plus a billing `/period`.
 */

/** Amount type scale — drives the main amount's size, and (via {@link SIZE_TO_TOKENS}) the original/period sizes riding along with it. */
export type PricePeriodSize = "sm" | "md" | "lg"

/** Heading-scale token for `amount` — one of `Typography`'s own heading sizes. */
type AmountHeadingSize = "h2" | "h3" | "h4"
/** Body-scale token for `original`/`period` — one of `Typography`'s own body sizes. */
type BodySize = "xs" | "sm" | "base"

/**
 * One table per `size` for all three parts — amount (heading scale) + original +
 * period (body scale) — so the whole unit grows as one coherent piece instead of a
 * big number next to leftover tiny text.
 */
const SIZE_TO_TOKENS: Record<
    PricePeriodSize,
    { amount: AmountHeadingSize; original: BodySize; period: BodySize }
> = {
    sm: { amount: "h4", original: "xs", period: "xs" },
    md: { amount: "h3", original: "sm", period: "xs" },
    lg: { amount: "h2", original: "base", period: "sm" },
}

/** Props shared by every `amount`/`isSkeleton` combination — see {@link PricePeriodProps}. */
interface PricePeriodOwnProps {
    /** Struck-through original/list price shown beside the amount (e.g. "399,000₫"). */
    original?: string
    /** Billing period rendered small + muted after the amount (e.g. "/month"). */
    period?: string
    /** Amount size — also drives `original`/`period`'s size via {@link SIZE_TO_TOKENS}. Defaults to `"md"` (h3). */
    size?: PricePeriodSize
}

/**
 * `amount` is required to render the live price, optional when `isSkeleton` — the
 * shimmer bar has no content to read.
 */
export type PricePeriodProps = PricePeriodOwnProps &
    (
        | { isSkeleton: true; amount?: string }
        | { isSkeleton?: false; amount: string }
    )

/**
 * Renders a price as one baseline-aligned unit: the amount (prominent), an optional
 * struck original, and an optional muted period. Each part is a `Typography` string —
 * the composite owns the tone and the per-size scale, the caller passes pre-formatted
 * text. `isSkeleton` forwards straight into every `Typography` instance so each part
 * draws its own bar (COMPOSITE-10): this component only decides WHICH parts shimmer
 * (the original never gets a placeholder of its own — passing it during `isSkeleton`
 * changes nothing) and, implicitly via `size`, HOW TALL each bar is.
 *
 * @param props - {@link PricePeriodProps}
 */
export const PricePeriod = ({
    amount,
    original,
    period,
    size = "md",
    isSkeleton = false,
    
}: PricePeriodProps) => {
    const tokens = SIZE_TO_TOKENS[size]

    return (
        <div
            data-tier="composite"
            data-component="PricePeriod"
            data-principle="value-row"
            className={cn("flex flex-wrap items-baseline gap-2")}
        >
            {/* Main amount — prominent, sized off {@link SIZE_TO_TOKENS}. */}
            <Typography
                size={tokens.amount}
                weight="semibold"
                color="default"
                isSkeleton={isSkeleton}
                text={amount}
            />
            {/* Struck-through original — only rendered for a real value; no skeleton
                placeholder of its own (mirrors the retired atom's behaviour). */}
            {original && !isSkeleton ? (
                <Typography
                    size={tokens.original}
                    color="muted"
                    isStruck
                    text={original}
                />
            ) : null}
            {/* Billing period — smallest muted text at this size. */}
            {period ? (
                <Typography
                    size={tokens.period}
                    color={isSkeleton ? undefined : "muted"}
                    isSkeleton={isSkeleton}
                    text={period}
                />
            ) : null}
        </div>
    )
}

/** Component-tier metadata for `PricePeriod` — registers it as a composite named `PricePeriod`. */
export const meta = { tier: "composite", name: "PricePeriod" } as const
