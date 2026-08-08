"use client"

import { Typography } from "@/components/atoms/text/Typography"
import { Button } from "@/components/atoms/buttons/Button"
import { Grid, type GridItem } from "@/components/frames/Grid"
import { StackV } from "@/components/frames/Stack"
import { PricingCard } from "@/components/blocks/cards/PricingCard"
import { CheckListCard, CheckListItem } from "@/components/blocks/cards/CheckListCard"
import { CrossListItem } from "@/components/blocks/cards/CrossListCard"

/** One feature row inside a pricing tier. */
export interface PricingTableFeature {
    /** The feature description shown on the row (e.g. "Unlimited grading"). */
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
    /** Display name of the tier (e.g. "Basic", "Professional"). */
    name: string
    /**
     * Pre-formatted price string (e.g. "0₫", "299.000₫"). Passed straight through —
     * the caller owns currency + formatting, mirroring {@link PriceTag}. */
    price: string
    /** Optional billing period label rendered muted next to the price (e.g. "/month"). */
    period?: string
    /** Optional one-line description under the tier name. */
    description?: string
    /** Feature rows for this tier — keep the labels consistent across tiers so they align. */
    features: PricingTableFeature[]
    /** Call-to-action label for this tier's button (e.g. "Choose plan"). */
    ctaLabel: string
    /** When true this tier is emphasized with an accent frame + a "most popular" ribbon. */
    isHighlighted?: boolean
}

/**
 * Props for the {@link PricingTable} block.
 *
 * Tier-3 presentational: props-only, no store/SWR/fetch. All prices arrive as
 * pre-formatted strings and the selection callback is fully no-op-able. Does
 * not take `className`/`classNames` (BLOCK-4) — a caller that needs a specific
 * placement wraps `PricingTable` in a frame of its own.
 */
export interface PricingTableProps {
    /**
     * The 2–3 tiers to compare side by side. Rendered as responsive columns on
     * desktop and stacked cards on mobile.
     */
    tiers: PricingTableTier[]
    /**
     * Label shown on the ribbon of a highlighted tier. Defaults to "Most popular".
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
 * Tier count → the {@link Grid} frame's `md` column step. Clamped at `4` — the
 * frame's own `GridColumns.md` union stops there — even though this block's
 * documented range is 2–3 tiers.
 */
const tierGridColumns = (count: number): 1 | 2 | 3 | 4 => {
    if (count <= 1) return 1
    if (count === 2) return 2
    if (count === 3) return 3
    return 4
}

/**
 * PricingTable compares 2–3 pricing tiers side by side. Each column is a
 * {@link PricingCard} carrying a name, a pre-formatted price + period, an optional
 * description, a feature list with per-feature included/excluded marks (success
 * check via {@link CheckListItem} vs muted cross via {@link CrossListItem}), and a
 * CTA button. One tier may carry a "most popular" highlight ribbon via
 * `isHighlighted`.
 *
 * The layout is a responsive multi-column comparison (its whole purpose), built
 * on the {@link Grid} frame: one stacked column on mobile, one equal-width
 * column per tier from `@app-md` up — the column count follows `tiers.length`
 * so the row never leaves a blank track. Tier-3 presentational — props-only,
 * no store, no SWR, no side-effects; `onSelectTier` is no-op-able.
 *
 * @param props - {@link PricingTableProps}
 *
 * @example
 * <PricingTable
 *     tiers={[
 *         { id: "free", name: "Free", price: "0₫", ctaLabel: "Get started", features: [...] },
 *         { id: "pro", name: "Professional", price: "299.000₫", period: "/month", ctaLabel: "Choose plan", isHighlighted: true, features: [...] },
 *     ]}
 *     onSelectTier={(id) => console.log(id)}
 * />
 * @see Story: .storybook/stories/blocks/commerce/PricingTable/PricingTable.stories
 */
export const PricingTable = ({
    tiers,
    highlightLabel = "Most popular",
    onSelectTier,
}: PricingTableProps) => {
    const tierItems: Array<GridItem> = tiers.map((tier) => ({
        key: tier.id,
        content: () => (
            <PricingCard
                name={tier.name}
                price={tier.price}
                period={tier.period}
                badge={tier.isHighlighted ? highlightLabel : undefined}
                highlighted={tier.isHighlighted}
                features={() => (
                    <StackV
                        gap={5}
                        items={[
                            // Optional per-tier description sits above the feature list
                            ...(tier.description ? [() => (
                                <Typography size="sm" color="muted" text={tier.description} />
                            )] : []),
                            // Feature rows via CheckListCard — included → CheckListItem (success
                            // check), excluded → CrossListItem (muted cross). Bordered = surface-in-surface
                            // (inside the pricing card). Consistent labels keep every tier's rows on
                            // the same line.
                            () => (
                                <CheckListCard bordered>
                                    {tier.features.map((feature, index) =>
                                        feature.included ? (
                                            <CheckListItem key={`${tier.id}-${index}`}>
                                                <Typography size="sm" text={feature.label} />
                                            </CheckListItem>
                                        ) : (
                                            <CrossListItem key={`${tier.id}-${index}`}>
                                                <Typography size="sm" color="muted" text={feature.label} />
                                            </CrossListItem>
                                        ),
                                    )}
                                </CheckListCard>
                            ),
                        ]}
                    />
                )}
                cta={() => (
                    <Button
                        variant={tier.isHighlighted ? "primary" : "secondary"}
                        label={tier.ctaLabel}
                        onPress={() => onSelectTier?.(tier.id)}
                    />
                )}
            />
        ),
    }))

    return (
        // Responsive tier comparison: stacked on mobile, one equal-width column per
        // tier from @app-md up. Grid's own CSS default (align-items: stretch) keeps
        // every column the same height so the CTAs align along a single baseline.
        // Grid is the root — it wears this block's identity (BLOCK-2) instead of
        // being wrapped in a raw identity div.
        <Grid
            identity={{ tier: "block", component: "PricingTable" }}
            columns={{ base: 1, md: tierGridColumns(tiers.length) }}
            principle="block-boundary"
            explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
            items={tierItems}
        />
    )
}
