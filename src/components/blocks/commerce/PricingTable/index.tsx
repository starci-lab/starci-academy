"use client"

import React from "react"
import { Button, Typography, cn } from "@heroui/react"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { PricingCard } from "@/components/blocks/cards/PricingCard"
import { CheckListCard, CheckListItem } from "@/components/blocks/cards/CheckListCard"
import { CrossListItem } from "@/components/blocks/cards/CrossListCard"

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
    /**
     * Pre-formatted price string (e.g. "0₫", "299.000₫"). Passed straight through —
     * the caller owns currency + formatting, mirroring {@link PriceTag}. */
    price: string
    /** Optional billing period label rendered muted next to the price (e.g. "/tháng"). */
    period?: string
    /** Optional one-line description under the tier name. */
    description?: string
    /** Feature rows for this tier — keep the labels consistent across tiers so they align. */
    features: PricingTableFeature[]
    /** Call-to-action label for this tier's button (e.g. "Chọn gói"). */
    ctaLabel: string
    /** When true this tier is emphasized with an accent frame + a "phổ biến" ribbon. */
    isHighlighted?: boolean
}

/**
 * Props for the {@link PricingTable} block.
 *
 * Tier-3 presentational: props-only, no store/SWR/fetch. All prices arrive as
 * pre-formatted strings and the selection callback is fully no-op-able.
 */
export interface PricingTableProps extends WithClassNames<undefined> {
    /**
     * The 2–3 tiers to compare side by side. Rendered as responsive columns on
     * desktop and stacked cards on mobile.
     */
    tiers: PricingTableTier[]
    /**
     * Label shown on the ribbon of a highlighted tier. Defaults to "Phổ biến".
     */
    highlightLabel?: string
    /**
     * Fired with a tier's `id` when its CTA button is pressed. No-op-able.
     *
     * @param id - The `id` of the selected tier.
     */
    onSelectTier?: (id: string) => void
}

/**
 * PricingTable compares 2–3 pricing tiers side by side. Each column is a
 * {@link PricingCard} carrying a name, a pre-formatted price + period, an optional
 * description, a feature list with per-feature included/excluded marks (success
 * {@link CheckIcon} vs muted {@link XIcon}), and a CTA button. One tier may carry a
 * "phổ biến" highlight ribbon via `isHighlighted`.
 *
 * The layout is a responsive multi-column comparison (its whole purpose): columns
 * on desktop (`md` and up), stacked on mobile. Tier-3 presentational — props-only,
 * no store, no SWR, no side-effects; `onSelectTier` is no-op-able.
 *
 * @param props - {@link PricingTableProps}
 *
 * @example
 * <PricingTable
 *     tiers={[
 *         { id: "free", name: "Miễn phí", price: "0₫", ctaLabel: "Bắt đầu", features: [...] },
 *         { id: "pro", name: "Chuyên nghiệp", price: "299.000₫", period: "/tháng", ctaLabel: "Chọn gói", isHighlighted: true, features: [...] },
 *     ]}
 *     onSelectTier={(id) => console.log(id)}
 * />
 * @see Story: .storybook/stories/blocks/commerce/PricingTable/PricingTable.stories
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
        <div className={cn("flex flex-col items-stretch gap-6 md:flex-row", className)}>
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
                            {/* Optional per-tier description sits above the feature list */}
                            {tier.description ? (
                                <Typography type="body-sm" color="muted">
                                    {tier.description}
                                </Typography>
                            ) : null}

                            {/* Feature rows via CheckListCard — included → CheckListItem (success ✓),
                                excluded → CrossListItem (muted ✗). Bordered = surface-in-surface (inside the
                                pricing card). Consistent labels across tiers so rows align column-to-column. */}
                            <CheckListCard bordered>
                                {tier.features.map((feature, index) =>
                                    feature.included ? (
                                        <CheckListItem key={`${tier.id}-${index}`}>
                                            <Typography type="body-sm">{feature.label}</Typography>
                                        </CheckListItem>
                                    ) : (
                                        <CrossListItem key={`${tier.id}-${index}`}>
                                            <Typography type="body-sm" color="muted">{feature.label}</Typography>
                                        </CrossListItem>
                                    ),
                                )}
                            </CheckListCard>
                        </div>
                    }
                    cta={
                        <Button
                            fullWidth
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
