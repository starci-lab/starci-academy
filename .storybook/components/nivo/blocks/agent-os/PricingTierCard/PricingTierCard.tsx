import { CheckIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `PricingTierCard` — one Agent OS monthly tier: name, price, what it unlocks,
 * and a select action. One composition; `isSelected` is the only DATA state of
 * the shape — the card's accent ring plus a stepped-up primary CTA. Grounded in
 * the real `nivo-ai-agent` SKU's three monthly tiers (Basic 490,000 / Pro
 * 990,000 / Scale 2,400,000 VND, `catalog-seeder.service.ts`).
 */

/** One Agent OS tier — already-resolved for display. */
export interface PricingTierRow {
    /** Tier id — also the {@link PricingTierCardProps.onSelect} argument. */
    id: string
    /** Display name (e.g. "Pro"). */
    name: string
    /** Monthly price in VND (`catalog-seeder.service.ts`: 490000 / 990000 / 2400000). */
    priceMonthlyVnd: number
    /** Already-resolved list of what this tier unlocks, in display order. */
    unlocks: Array<string>
}

/** Props for {@link PricingTierCard}. */
export interface PricingTierCardProps {
    /** The tier to show. */
    tier: PricingTierRow
    /** `true` → this is the currently chosen tier in a single-select group of these cards. */
    isSelected: boolean
    /** Choose this tier — the connected layer holds which one is selected. */
    onSelect: (tierId: string) => void
    /**
     * `true` → the tier list's own first fetch is in flight: the same card keeps
     * its shape while every `Typography`/`Button` node shimmers. Threaded straight
     * down — never fed to a separate skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: PricingTierCardLabels
}

/** The already-resolved copy the card renders. */
export interface PricingTierCardLabels {
    /** Suffix after a monthly price (e.g. "/ month"). */
    perMonthLabel: string
    /** Choose-CTA label (e.g. "Select") — shown whether or not the tier is already selected. */
    selectLabel: string
}

/** Money is a raw VND `Int`; the card owns the grouping + suffix. */
const formatVnd = (amountVnd: number) => `${amountVnd.toLocaleString("en-US")} VND`

/**
 * The tier card. See the file header for why `isSelected` is a state of one
 * shape rather than a separate leaf.
 *
 * @param props - {@link PricingTierCardProps}
 */
const PricingTierCard = ({ tier, isSelected, onSelect, isSkeleton = false, labels }: PricingTierCardProps) => (
    <div data-tier="block" data-component="PricingTierCard">
        <SurfaceCard
            padding={3}
            isSelected={isSelected}
            isSkeleton={isSkeleton}
            body={() => (
                <StackV
                    gap={3}
                    isSkeleton={isSkeleton}
                    items={[
                        () => <Typography size="lg" weight="bold" isSkeleton={isSkeleton} text={tier.name} />,
                        () => (
                            <Typography
                                size="h3"
                                weight="bold"
                                tabularNums
                                isSkeleton={isSkeleton}
                                text={`${formatVnd(tier.priceMonthlyVnd)} ${labels.perMonthLabel}`}
                            />
                        ),
                        () => (
                            <StackV
                                gap={2}
                                isSkeleton={isSkeleton}
                                items={tier.unlocks.map((unlock) => () => (
                                    <Typography size="sm" prefixIcon={CheckIcon} color="success" isSkeleton={isSkeleton} text={unlock} />
                                ))}
                            />
                        ),
                        () => (
                            <Button
                                variant={isSelected ? "primary" : "secondary"}
                                label={labels.selectLabel}
                                onPress={() => onSelect(tier.id)}
                                isSkeleton={isSkeleton}
                            />
                        ),
                    ]}
                />
            )}
        />
    </div>
)

export { PricingTierCard }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "PricingTierCard" } as const
