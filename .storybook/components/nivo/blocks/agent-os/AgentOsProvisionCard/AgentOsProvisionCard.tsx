import { ArrowRightIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Grid } from "@sb-components/frames/Grid/Grid"
import { StackV } from "@sb-components/frames/Stack/Stack"
import {
    PricingTierCard,
    type PricingTierCardLabels,
    type PricingTierRow,
} from "@sb-components/nivo/blocks/agent-os/PricingTierCard/PricingTierCard"

/**
 * `AgentOsProvisionCard` — the create hero: what an Agent OS pod is, the three
 * real monthly tiers to pick from, and the primary CTA that starts
 * provisioning. One composition; `selectedTierId` (which tier is highlighted)
 * and `isProvisioning` (the CTA busy while the mutation is in flight) are DATA
 * states of the single shape. Grounded in `AgentWorkspaceEntity` (SKU
 * `nivo-ai-agent`, one-to-one `catalogOrder`).
 */

/** Props for {@link AgentOsProvisionCard}. */
export interface AgentOsProvisionCardProps {
    /** The three real monthly tiers, in display order. */
    tiers: ReadonlyArray<PricingTierRow>
    /** Which tier is currently highlighted (controlled). */
    selectedTierId: string
    /** Fired with the newly chosen tier's id. */
    onSelectTier: (tierId: string) => void
    /** Fired by the primary CTA — the connected layer places the order and starts provisioning. */
    onProvision: () => void
    /**
     * `true` → the provision mutation is in flight: the CTA shows a spinner and
     * locks, the tier cards stay inert. Distinct from `isSkeleton` (first load,
     * nothing in hand yet) — this is an action already under way.
     */
    isProvisioning?: boolean
    /**
     * `true` → the hero's own first fetch (the tier catalog) is in flight: the
     * title, description, all three tier cards, and the CTA shimmer in place.
     * Threaded straight down — never fed to a separate skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: AgentOsProvisionCardLabels
}

/** The already-resolved copy the hero renders — extends the tier card's own label set. */
export interface AgentOsProvisionCardLabels extends PricingTierCardLabels {
    /** Hero title (e.g. "Rent Agent OS"). */
    title: string
    /** What a pod is, in one sentence — the buyer's first read of the product. */
    description: string
    /** Primary CTA label (e.g. "Rent Agent OS"). */
    ctaLabel: string
}

/**
 * The provision hero. See the file header for why `selectedTierId` is DATA
 * (a state of one shape) rather than three different tier-card compositions.
 *
 * @param props - {@link AgentOsProvisionCardProps}
 */
const AgentOsProvisionCard = ({
    tiers,
    selectedTierId,
    onSelectTier,
    onProvision,
    isProvisioning = false,
    isSkeleton = false,
    labels,
}: AgentOsProvisionCardProps) => (
    <div data-tier="block" data-component="AgentOsProvisionCard">
        <SurfaceCard
            padding={4}
            isHighlight
            isSkeleton={isSkeleton}
            body={() => (
                <StackV
                    gap={5}
                    principle="group-boundary"
                    align="center"
                    isSkeleton={isSkeleton}
                    items={[
                        () => <Typography size="h3" weight="bold" align="center" isSkeleton={isSkeleton} text={labels.title} />,
                        () => <Typography size="sm" color="muted" align="center" isSkeleton={isSkeleton} text={labels.description} />,
                        () => (
                            <Grid
                                columns={{ base: 1, md: 3 }}
                                principle="content-row"
                                items={tiers.map((tier) => ({
                                    key: tier.id,
                                    content: () => (
                                        <PricingTierCard
                                            tier={tier}
                                            isSelected={tier.id === selectedTierId}
                                            onSelect={onSelectTier}
                                            labels={labels}
                                            isSkeleton={isSkeleton}
                                        />
                                    ),
                                }))}
                            />
                        ),
                        () => (
                            <Button
                                variant="primary"
                                size="lg"
                                label={labels.ctaLabel}
                                suffixIcon={ArrowRightIcon}
                                onPress={onProvision}
                                isPending={isProvisioning}
                                isSkeleton={isSkeleton}
                            />
                        ),
                    ]}
                />
            )}
        />
    </div>
)

export { AgentOsProvisionCard }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "AgentOsProvisionCard" } as const
