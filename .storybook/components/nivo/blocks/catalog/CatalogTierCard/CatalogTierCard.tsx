import { CheckIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `CatalogTierCard` — one price tier of a tiered product. The variations are all
 * DATA states of the single shape: `default`, `recommended` (accent highlight +
 * badge), `owned` (CTA → current-plan chip), and `disabled` (CTA blocked + reason).
 * Grounded in the real streamlined AI Academy tiers.
 */

/** One tier card — a subset of `CatalogTierEntity` with its feature flags resolved to labels. */
export interface CatalogTierRow {
    /** Tier id. */
    id: string
    /** Display name (`CatalogTierEntity.name`). */
    name: string
    /** Short positioning copy, or null (`CatalogTierEntity.description`). */
    description?: string | null
    /** Monthly price in VND, or null (`CatalogTierEntity.priceMonthlyVnd`). */
    priceMonthlyVnd?: number | null
    /** One-time price in VND, or null (`CatalogTierEntity.priceOneTimeVnd`). */
    priceOneTimeVnd?: number | null
    /** Already-resolved feature labels (derived from `CatalogTierEntity.featureFlags`). */
    features: Array<string>
    /** Positioning flag (`CatalogTierEntity.isRecommended`) — at most one true per product. */
    isRecommended: boolean
    /** `true` → the user is already on this tier. */
    isOwned: boolean
    /** Reason the tier cannot be chosen right now, or null (e.g. a downgrade block). */
    disabledReason?: string | null
}

/** Props for {@link CatalogTierCard}. */
export interface CatalogTierCardProps {
    /** The tier to show. */
    tier: CatalogTierRow
    /** Choose this tier — the connected layer places the order / upgrade. */
    onSelect: (tierId: string) => void
    /**
     * `true` → the catalog's own first fetch is in flight: the same tier card keeps
     * its shape while every `Typography`/`Chip`/`Button` node shimmers (§12b).
     * Threaded straight down — never fed to a separate skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: CatalogTierCardLabels
}

/** The already-resolved copy the block renders. */
export interface CatalogTierCardLabels {
    /** Choose-CTA label (e.g. "Choose"). */
    selectLabel: string
    /** Badge text for the recommended tier (e.g. "Recommended"). */
    recommendedLabel: string
    /** Chip text shown when the user already owns this tier (e.g. "Current plan"). */
    ownedLabel: string
    /** Suffix after a monthly price (e.g. "/ month"). */
    perMonthLabel: string
    /** Text shown in place of a price when the tier is free (price 0). */
    freeLabel: string
}

/** Money is a raw VND `Int`; the block owns the grouping + suffix. */
const formatVnd = (amountVnd: number) => `${amountVnd.toLocaleString("en-US")} VND`

/** Resolve the tier's price into one display string: monthly, one-time, or free. */
const priceTextOf = (tier: CatalogTierRow, labels: CatalogTierCardLabels): string => {
    if (tier.priceMonthlyVnd != null) {
        return tier.priceMonthlyVnd === 0
            ? labels.freeLabel
            : `${formatVnd(tier.priceMonthlyVnd)} ${labels.perMonthLabel}`
    }
    if (tier.priceOneTimeVnd != null) {
        return tier.priceOneTimeVnd === 0 ? labels.freeLabel : formatVnd(tier.priceOneTimeVnd)
    }
    return labels.freeLabel
}

/**
 * The tier card. See the file header for why recommended / owned / disabled are
 * states of one shape rather than separate leaves.
 *
 * @param props - {@link CatalogTierCardProps}
 */
const CatalogTierCard = ({ tier, onSelect, isSkeleton = false, labels }: CatalogTierCardProps) => (
    <div data-tier="block" data-component="CatalogTierCard">
        <SurfaceCard
            padding={3}
            isHighlight={tier.isRecommended}
            isSkeleton={isSkeleton}
            body={() => (
                <StackV
                    gap={3}
                    isSkeleton={isSkeleton}
                    items={[
                        ...(tier.isRecommended
                            ? [() => <Chip tone="accent" isSkeleton={isSkeleton} text={labels.recommendedLabel} />]
                            : []),
                        () => <Typography size="lg" weight="bold" isSkeleton={isSkeleton} text={tier.name} />,
                        () => <Typography size="h3" weight="bold" tabularNums isSkeleton={isSkeleton} text={priceTextOf(tier, labels)} />,
                        ...(isSkeleton || tier.description
                            ? [() => <Typography size="sm" color="muted" isSkeleton={isSkeleton} text={tier.description ?? ""} />]
                            : []),
                        () => (
                            <StackV
                                gap={2}
                                isSkeleton={isSkeleton}
                                items={tier.features.map((feature) => () => (
                                    <Typography
                                        size="sm"
                                        prefixIcon={CheckIcon}
                                        color="success"
                                        isSkeleton={isSkeleton}
                                        text={feature}
                                    />
                                ))}
                            />
                        ),
                        () =>
                            tier.isOwned ? (
                                <Chip tone="success" icon={CheckIcon} isSkeleton={isSkeleton} text={labels.ownedLabel} />
                            ) : (
                                <StackV
                                    gap={1}
                                    isSkeleton={isSkeleton}
                                    items={[
                                        () => (
                                            <Button
                                                variant={tier.isRecommended ? "primary" : "secondary"}
                                                label={labels.selectLabel}
                                                onPress={() => onSelect(tier.id)}
                                                isDisabled={tier.disabledReason != null}
                                                isSkeleton={isSkeleton}
                                            />
                                        ),
                                        ...(isSkeleton || tier.disabledReason
                                            ? [() => <Typography size="xs" color="muted" isSkeleton={isSkeleton} text={tier.disabledReason ?? ""} />]
                                            : []),
                                    ]}
                                />
                            ),
                    ]}
                />
            )}
        />
    </div>
)

export { CatalogTierCard }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "CatalogTierCard" } as const
