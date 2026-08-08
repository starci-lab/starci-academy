"use client"

import React, { type ComponentType } from "react"
import { Typography } from "@/components/atoms/text/Typography"
import { Chip } from "@/components/atoms/chips/Chip"
import { SectionCard } from "@/components/blocks/cards/SectionCard"
import { StackH } from "@/components/frames/Stack"
import { FillAvailable } from "@/components/frames/FillAvailable"

/** Props for {@link PricingCard}. */
export interface PricingCardProps {
    /** Display name of the pricing tier (e.g. "Pro", "Enterprise"). */
    name: string
    /**
     * The current price to display prominently (e.g. "$9").
     * Rendered large in the price row.
     */
    price: string
    /**
     * Optional original / strike-through price shown alongside the current price
     * to indicate a discount (e.g. "$19"). Omit when there is no original price.
     */
    originalPrice?: string
    /**
     * Billing period label rendered muted next to the price (e.g. "/mo",
     * "/month"). Omit if not applicable.
     */
    period?: string
    /**
     * Feature list slot — typically a checklist. A buildable slot so this card
     * can decide not to render it (e.g. while resting).
     */
    features: ComponentType
    /**
     * Call-to-action slot — a buildable button the card pins to the bottom.
     */
    cta: ComponentType
    /**
     * Optional badge label shown beside the tier name to call out a popular or
     * recommended tier (e.g. "Popular", "Best value"). Omit to hide the badge.
     * Rendered as a shrink-to-content {@link Chip} — never full-width.
     */
    badge?: string
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
 * true. Text arrives as strings; feature list and CTA arrive uncalled so this
 * card can decide whether to render them.
 *
 * @example
 * ```tsx
 * <PricingCard>
 *     name="Pro"
 *     price="$9"
 *     originalPrice="$19"
 *     period="/month"
 *     features={() => <ul><li>Feature A</li></ul>}
 *     cta={() => <Button color="accent">Get started</Button>}
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
    features: Features,
    cta: Cta,
    badge,
    highlighted = false,
}: PricingCardProps) => {
    return (
        // Use SectionCard's accent variant for the highlighted (recommended) tier
        <SectionCard identity={{ tier: "block", component: "PricingCard" }} accent={highlighted} contentGap={6} fillHeight>
            {/* Name (+ optional popular chip inline — chip is shrink-to-content, never full-width) */}
            <StackH
                gap={3}
                principle="chip-row"
                explain="Lets chips share one wrapping row so related tags stay together without stacking as a column."
                at="sm"
                items={[
                    () => <Typography size="base" weight="semibold" text={name} />,
                    ...(highlighted && badge ? [() => <Chip tone="accent" text={badge} />] : []),
                ]}
            />

            {/* Price row: big price + optional struck original + muted period */}
            <StackH
                gap={3}
                principle="value-row"
                explain="Holds a label and its numeric value on one baseline so the count stays readable against the label."
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
            <FillAvailable at="base" body={Features} />            {/* CTA pinned to the bottom of the card */}
            <Cta />
        </SectionCard>
    )
}
