import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    AgentOsProvisionCard,
    type AgentOsProvisionCardLabels,
} from "@sb-components/nivo/blocks/agent-os/AgentOsProvisionCard/AgentOsProvisionCard"
import type { PricingTierRow } from "@sb-components/nivo/blocks/agent-os/PricingTierCard/PricingTierCard"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `AgentOsProvisionCard` — the create hero: what an Agent OS pod is, the three
 * real monthly tiers to pick from, and the primary CTA that starts
 * provisioning. One composition; `selectedTierId` (which tier is highlighted)
 * and `isProvisioning` (the CTA busy while the mutation is in flight) are DATA
 * states of the single shape. Grounded in `AgentWorkspaceEntity` (SKU
 * `nivo-ai-agent`, one-to-one `catalogOrder`).
 */
const meta: Meta<typeof AgentOsProvisionCard> = {
    title: "Nivo/Blocks/AgentOs/AgentOsProvisionCard/AgentOsProvisionCard",
    component: AgentOsProvisionCard,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof AgentOsProvisionCard>

const LABELS: AgentOsProvisionCardLabels = {
    title: "Rent Agent OS",
    description:
        "A pod that runs a ready-made agent team plus workflow automation, live on Zalo, Telegram and WhatsApp — answering customers, syncing orders, and automating reminders, no engineering required.",
    ctaLabel: "Rent Agent OS",
    perMonthLabel: "/ month",
    selectLabel: "Select",
}

const TIERS: ReadonlyArray<PricingTierRow> = [
    {
        id: "agent_os_basic",
        name: "Basic",
        priceMonthlyVnd: 490000,
        unlocks: ["1 agent", "Zalo + Telegram", "1,000 messages / month", "Industry script templates"],
    },
    {
        id: "agent_os_pro",
        name: "Pro",
        priceMonthlyVnd: 990000,
        unlocks: ["3 agents", "Every channel (adds WhatsApp)", "5,000 messages / month", "Knowledge base (RAG)", "Playground"],
    },
    {
        id: "agent_os_scale",
        name: "Scale",
        priceMonthlyVnd: 2400000,
        unlocks: ["Unlimited agents", "Priority model", "Tool integrations", "SLA + dedicated support"],
    },
]

const NOOP = () => {}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the hero face — an accent highlight sweep marks the pod's own start-here surface" },
    Typography: { tier: "atom", role: "the title and the what-a-pod-is description" },
    Grid: { tier: "frame", role: "the responsive 1→3 column tier row" },
    PricingTierCard: { tier: "block", role: "one of the three real monthly tiers; `storyId` jumps to its own storymap", storyId: "nivo-blocks-agentos-pricingtiercard-pricingtiercard--default" },
    Button: { tier: "atom", role: "the primary CTA that starts provisioning" },
}

/** LEAF — the hero has one shape; the selected tier and `isProvisioning` are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AgentOsProvisionCard"
                tier="block"
                leaf="Provision hero"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-4xl"
                reason="Blocks take no `className`: `selectedTierId` is DATA about which of the three `PricingTierCard`s is currently chosen, and `isProvisioning` is DATA about whether the rent mutation is in flight — both are states of the one hero shape, not different compositions. The hero composes `PricingTierCard` directly (block importing block, allowed by the tier direction) rather than rebuilding the tier shape inline."
                states={[
                    {
                        name: "default (Basic selected)",
                        why: "The resting look: the first tier pre-selected, the CTA ready to press.",
                        code: "<AgentOsProvisionCard tiers={tiers} selectedTierId=\"agent_os_basic\" onSelectTier={select} onProvision={provision} labels={labels} />",
                        render: <AgentOsProvisionCard tiers={TIERS} selectedTierId="agent_os_basic" onSelectTier={NOOP} onProvision={NOOP} labels={LABELS} />,
                    },
                    {
                        name: "Pro selected",
                        why: "Choosing a different tier just moves the accent ring and the primary CTA styling to that card — the same shape, different data.",
                        code: "<AgentOsProvisionCard tiers={tiers} selectedTierId=\"agent_os_pro\" … />",
                        render: <AgentOsProvisionCard tiers={TIERS} selectedTierId="agent_os_pro" onSelectTier={NOOP} onProvision={NOOP} labels={LABELS} />,
                    },
                    {
                        name: "isProvisioning = true",
                        why: "The buyer already pressed the CTA — it shows a spinner and locks while the connected layer places the order, so a slow network can't be double-pressed into two pods.",
                        code: `<AgentOsProvisionCard
    tiers={tiers}
    selectedTierId="agent_os_pro"
    onSelectTier={select}
    onProvision={provision}
    labels={labels}
    isProvisioning
/>`,
                        render: (
                            <AgentOsProvisionCard
                                tiers={TIERS}
                                selectedTierId="agent_os_pro"
                                onSelectTier={NOOP}
                                onProvision={NOOP}
                                labels={LABELS}
                                isProvisioning
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The hero's own first fetch (the tier catalog) hasn't resolved, so the title, description, all three tier cards, and the CTA shimmer in the loaded shape — nothing jumps once the tiers land.",
                        code: `<AgentOsProvisionCard
    tiers={tiers}
    selectedTierId="agent_os_basic"
    onSelectTier={select}
    onProvision={provision}
    labels={labels}
    isSkeleton
/>`,
                        render: (
                            <AgentOsProvisionCard
                                tiers={TIERS}
                                selectedTierId="agent_os_basic"
                                onSelectTier={NOOP}
                                onProvision={NOOP}
                                labels={LABELS}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
