import React from "react"
import { cn, Typography } from "@heroui/react"
import { SectionCard } from "../SectionCard/SectionCard"
import { StatusChip } from "../../chips/StatusChip/StatusChip"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — BLOCK (composite) ported faithfully from
 * `@/components/blocks/cards/PricingCard`. Composed from the local primitive
 * `SectionCard` (frame, `accent` when highlighted). Synced to `src` later.
 */

/** Props for {@link PricingCard}. */
export interface PricingCardProps {
    /** Display name of the pricing tier (e.g. "Pro", "Enterprise"). */
    name: React.ReactNode
    /**
     * The current price to display prominently (e.g. "$9" or a formatted node).
     * Rendered large in the price row.
     */
    price: React.ReactNode
    /**
     * Optional original / strike-through price shown alongside the current price
     * to indicate a discount (e.g. "$19"). Omit when there is no original price.
     */
    originalPrice?: React.ReactNode
    /**
     * Billing period label rendered muted next to the price (e.g. "/tháng",
     * "/month"). Omit if not applicable.
     */
    period?: React.ReactNode
    /**
     * Feature list node — typically a `<ul>` with bullet items. Passed in as-is
     * so callers control the exact markup and icons.
     */
    features: React.ReactNode
    /**
     * Call-to-action element — pass a fully configured `<Button>` from HeroUI.
     * The block pins it to the bottom of the card via flex layout.
     */
    cta: React.ReactNode
    /**
     * Optional badge label shown beside the tier name to call out a popular or
     * recommended tier (e.g. "Phổ biến", "Best value"). Omit to hide the badge.
     * Rendered as a shrink-to-content Chip (`w-fit`) — never full-width.
     */
    badge?: React.ReactNode
    /**
     * When true the card renders with SectionCard's accent variant
     * (tinted border + background) and the badge is visible.
     * Use this on the recommended / most popular tier.
     */
    highlighted?: boolean
    /** Extra classes on the card root. */
    className?: string
}

/**
 * Pricing tier card — a tier-3 presentational block that renders one pricing
 * plan with a name, price row, feature list, and a CTA button.
 *
 * Built on {@link SectionCard} with the `accent` variant when `highlighted` is
 * true. All content is received as `ReactNode` props so the caller controls
 * formatting, currency, and button configuration.
 *
 * @param props - {@link PricingCardProps}
 */
export const PricingCard = ({
    name,
    price,
    originalPrice,
    period,
    features,
    cta,
    badge,
    highlighted = false,
    className,
}: PricingCardProps) => {
    return (
        // Use SectionCard's accent variant for the highlighted (recommended) tier
        <SectionCard
            accent={highlighted}
            className={cn("flex flex-col", className)}
            contentClassName="flex flex-col gap-6 h-full"
        >
            {/* Name (+ optional popular chip inline — chip is w-fit, never full-width) */}
            <div className="flex flex-wrap items-center gap-2">
                <Typography type="body" weight="semibold">
                    {name}
                </Typography>
                {highlighted && badge ? (
                    <StatusChip tone="accent" className="shrink-0">
                        {badge}
                    </StatusChip>
                ) : null}
            </div>

            {/* Price row: big price + optional struck original + muted period */}
            <div className="flex flex-wrap items-baseline gap-2">
                {/* Main price — h3 size, semibold, prominent */}
                <Typography type="h3" weight="semibold">
                    {price}
                </Typography>

                {/* Strike-through original price — line-through is text-decoration, allowed as className */}
                {originalPrice ? (
                    <Typography type="body-sm" color="muted" className="line-through">
                        {originalPrice}
                    </Typography>
                ) : null}

                {/* Billing period label — smallest muted text */}
                {period ? (
                    <Typography type="body-xs" color="muted">
                        {period}
                    </Typography>
                ) : null}
            </div>

            {/* Feature list — grows to fill available vertical space; caller controls markup */}
            <div className="flex-1">{features}</div>

            {/* CTA pinned to the bottom of the card */}
            <div>{cta}</div>
        </SectionCard>
    )
}
