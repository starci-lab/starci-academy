import React from "react"
import { Typography, cn } from "@heroui/react"
import { Button } from "../../buttons/Button/Button"
import { SectionCard } from "../../cards/SectionCard/SectionCard"
import { StatusChip } from "../../chips/StatusChip/StatusChip"
import { CrossListCard, CrossListItem } from "../../cards/CrossListCard/CrossListCard"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — BLOCK ported faithfully from
 * `@/components/blocks/commerce/PricingTable`. Composed from the local primitives
 * `PricingCard` (each tier column) + `CrossListCard`/`CrossListItem` (feature rows —
 * one list mixing `mark="check"` ✓ included and `mark="cross"` ✗ excluded) + a HeroUI
 * `Button` CTA. Synced to `src` later.
 *
 * NOTE: `PricingCard` (a `cards/*` block) is NOT yet ported under `.storybook/stories`,
 * so a faithful local copy is inlined below (composing the local `SectionCard` +
 * `StatusChip` primitives). TODO: swap for the PricingCard local when it is ported.
 */

// ── inlined faithful local copy of `@/components/blocks/cards/PricingCard` ────────────
// TODO: swap for the PricingCard local when it is ported under .storybook/stories.

/** Props for the inlined {@link PricingCard}. */
interface PricingCardProps {
    name: React.ReactNode
    price: React.ReactNode
    originalPrice?: React.ReactNode
    period?: React.ReactNode
    features: React.ReactNode
    cta: React.ReactNode
    badge?: React.ReactNode
    highlighted?: boolean
    className?: string
}

/**
 * Pricing tier card — one plan with a name, price row, feature list, and a CTA button.
 * Built on {@link SectionCard} (accent variant when `highlighted`); the "popular" badge
 * is a {@link StatusChip} (tone accent, `w-fit`). All content arrives as `ReactNode`.
 */
const PricingCard = ({
    name,
    price,
    originalPrice,
    period,
    features,
    cta,
    badge,
    highlighted = false,
    className,
}: PricingCardProps) => (
    <SectionCard accent={highlighted} className={cn("flex flex-col", className)} contentClassName="flex flex-col gap-6 h-full">
        {/* Name (+ optional popular chip inline — chip is w-fit, never full-width) */}
        <div className="flex flex-wrap items-center gap-2">
            <Typography type="body" weight="semibold">{name}</Typography>
            {highlighted && badge ? <StatusChip tone="accent">{badge}</StatusChip> : null}
        </div>

        {/* Price row: big price + optional struck original + muted period */}
        <div className="flex flex-wrap items-baseline gap-2">
            <Typography type="h3" weight="semibold">{price}</Typography>
            {originalPrice ? (
                <Typography type="body-sm" color="muted" className="line-through">{originalPrice}</Typography>
            ) : null}
            {period ? <Typography type="body-xs" color="muted">{period}</Typography> : null}
        </div>

        {/* Feature list — grows to fill available vertical space; caller controls markup */}
        <div className="flex-1">{features}</div>

        {/* CTA pinned to the bottom of the card */}
        <div>{cta}</div>
    </SectionCard>
)

// ── PricingTable ─────────────────────────────────────────────────────────────────────

/** One feature row inside a pricing tier. */
export interface PricingTableFeature {
    /** The feature description shown on the row (e.g. "Chấm bài không giới hạn"). */
    label: string
    /**
     * Whether this tier includes the feature. `true` renders a success check,
     * `false` renders a muted cross so the row still appears (aligned across tiers).
     */
    included: boolean
}

/** One pricing tier column of the {@link PricingTable}. */
export interface PricingTableTier {
    /** Stable identifier passed back through `onSelectTier` when the CTA is pressed. */
    id: string
    /** Display name of the tier (e.g. "Cơ bản", "Chuyên nghiệp"). */
    name: string
    /** Pre-formatted price string (e.g. "0₫", "299.000₫") — caller owns formatting. */
    price: string
    /** Optional billing period label rendered muted next to the price (e.g. "/tháng"). */
    period?: string
    /** Optional one-line description under the tier name. */
    description?: string
    /** Feature rows for this tier — keep labels consistent across tiers so they align. */
    features: PricingTableFeature[]
    /** Call-to-action label for this tier's button (e.g. "Chọn gói"). */
    ctaLabel: string
    /** When true this tier is emphasized with an accent frame + a "phổ biến" ribbon. */
    isHighlighted?: boolean
}

/** Props for the {@link PricingTable} block. */
export interface PricingTableProps {
    /** The 2–3 tiers to compare side by side (columns on desktop, stacked on mobile). */
    tiers: PricingTableTier[]
    /** Label shown on the ribbon of a highlighted tier. Defaults to "Phổ biến". */
    highlightLabel?: string
    /** Fired with a tier's `id` when its CTA button is pressed. No-op-able. */
    onSelectTier?: (id: string) => void
    /** Extra classes on the root. */
    className?: string
}

/**
 * PricingTable compares 2–3 pricing tiers side by side. Each column is a
 * {@link PricingCard} carrying a name, a pre-formatted price + period, an optional
 * description, a feature list with per-feature included/excluded marks (success check
 * vs muted cross), and a CTA button. One tier may carry a "phổ biến" highlight ribbon
 * via `isHighlighted`.
 *
 * The layout is a responsive multi-column comparison: columns on desktop (`md` up),
 * stacked on mobile. Tier-3 presentational — props-only, no store/SWR/side-effects.
 *
 * @param props - {@link PricingTableProps}
 */
export const PricingTable = ({
    tiers,
    highlightLabel = "Phổ biến",
    onSelectTier,
    className,
}: PricingTableProps) => {
    return (
        // Responsive tier comparison: stacked on mobile, columns from md up. items-stretch
        // keeps every column the same height so the CTAs align along a single baseline.
        <div className={cn("flex flex-col items-stretch gap-6 @app-md:flex-row", className)}>
            {tiers.map((tier) => (
                <PricingCard
                    key={tier.id}
                    className="flex-1"
                    name={tier.name}
                    price={tier.price}
                    period={tier.period}
                    badge={tier.isHighlighted ? highlightLabel : undefined}
                    highlighted={tier.isHighlighted}
                    features={
                        <div className="flex flex-col gap-4">
                            {tier.description ? (
                                <Typography type="body-sm" color="muted">{tier.description}</Typography>
                            ) : null}

                            {/* Feature rows in ONE CrossListCard: included → mark="check" (✓),
                                excluded → mark="cross" (✗). Bordered = surface-in-surface. */}
                            <CrossListCard bordered>
                                {tier.features.map((feature, index) => (
                                    <CrossListItem key={`${tier.id}-${index}`} mark={feature.included ? "check" : "cross"}>
                                        <Typography type="body-sm" color={feature.included ? undefined : "muted"}>{feature.label}</Typography>
                                    </CrossListItem>
                                ))}
                            </CrossListCard>
                        </div>
                    }
                    cta={
                        <Button
                            // port has no `fullWidth` prop — HeroUI's fullWidth is literally
                            // `w-full` (see button.styles.ts `button--full-width`), so className
                            // reproduces the identical visual.
                            className="w-full"
                            variant={tier.isHighlighted ? "primary" : "secondary"}
                            onPress={() => onSelectTier?.(tier.id)}
                        >
                            {tier.ctaLabel}
                        </Button>
                    }
                />
            ))}
        </div>
    )
}
