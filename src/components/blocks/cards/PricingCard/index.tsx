"use client"

import React from "react"
import { Typography } from "@/components/atoms/text/Typography"
import { Chip } from "@/components/atoms/chips/Chip"
import { SectionCard } from "@/components/blocks/cards/SectionCard"
import { StackH, StackV } from "@/components/frames/Stack"

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
     * Billing period label rendered muted next to the price (e.g. "/mo",
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
     * recommended tier (e.g. "Popular", "Best value"). Omit to hide the badge.
     * Rendered as a shrink-to-content {@link Chip} — never full-width.
     */
    badge?: React.ReactNode
    /**
     * When true the card renders with SectionCard's accent variant
     * (tinted border + background) and the badge is visible.
     * Use this on the recommended / most popular tier.
     */
    highlighted?: boolean
}

/**
 * Pricing tier card — a tier-3 presentational block that renders one pricing
 * plan with a name, price row, feature list, and a CTA button.
 *
 * Built on {@link SectionCard} with the `accent` variant when `highlighted` is
 * true. All content is received as `ReactNode` props so the caller controls
 * formatting, currency, and button configuration.
 *
 * @example
 * ```tsx
 * <PricingCard
 *     name="Pro"
 *     price="$9"
 *     originalPrice="$19"
 *     period="/month"
 *     features={<ul><li>Feature A</li></ul>}
 *     cta={<Button color="accent">Get started</Button>}
 *     badge="Most popular"
 *     highlighted
 * />
 * ```
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
}: PricingCardProps) => {
    return (
        // Use SectionCard's accent variant for the highlighted (recommended) tier
        <SectionCard accent={highlighted} contentGap={6} fillHeight>
            {/* Name (+ optional popular chip inline — chip is shrink-to-content, never full-width) */}
            <StackH
                gap={3}
                at="sm"
                items={[
                    () => <Typography size="base" weight="semibold" text={name} />,
                    ...(highlighted && badge ? [() => <Chip tone="accent" text={badge} />] : []),
                ]}
            />

            {/* Price row: big price + optional struck original + muted period */}
            <StackH
                gap={3}
                align="baseline"
                at="sm"
                items={[
                    // Main price — h3 size, semibold, prominent
                    () => <Typography size="h3" weight="semibold" text={price} />,
                    // Strike-through original price
                    ...(originalPrice
                        ? [() => <Typography size="sm" color="muted" isStruck text={originalPrice} />]
                        : []),
                    // Billing period label — smallest muted text
                    ...(period ? [() => <Typography size="xs" color="muted" text={period} />] : []),
                ]}
            />

            {/* Feature list — grows to fill available vertical space; caller controls markup */}
            <StackV gap={1} classNames={["flex-1"]} body={() => <>{features}</>} />

            {/* CTA pinned to the bottom of the card */}
            {cta}
        </SectionCard>
    )
}
