import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    ArrowsClockwiseIcon,
    ChartBarIcon,
    DatabaseIcon,
    GlobeIcon,
    SparkleIcon,
    TargetIcon,
} from "@phosphor-icons/react"
import {
    AgentOsProvision,
    type AgentOsProvisionLabels,
} from "@sb-components/nivo/pages/AgentOsProvision/AgentOsProvision"
import type { PricingTierRow } from "@sb-components/nivo/blocks/agent-os/PricingTierCard/PricingTierCard"
import type { OperatingLoopVisualNode } from "@sb-components/nivo/blocks/landing/OperatingLoopVisual/OperatingLoopVisual"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `AgentOsProvision` — the PAGE at `/agent-os` before a pod exists: a list of
 * functions, not a shape of its own. It NAMES `AgentOsProvisionCard` (the hero
 * + the three real monthly tiers, already composed inside that block) above
 * `OperatingLoopVisual` (the shared brand loop motif, lit on the AI stage —
 * the layer Agent OS itself is) while `status = "no-pod"`, and swaps the whole
 * body for `ProvisioningState` (the waiting screen) once `status =
 * "provisioning"` — the rail does not show there (the prototype's own S2 has
 * no loop under the spinner). This is the content this route mounts into
 * `DashboardShell`'s `content` slot; the shell itself sits ABOVE this page (a
 * page may import blocks/composites/frames, never a layout), so this file
 * renders standalone, never wrapping `DashboardShell` around itself.
 *
 * `status` is the page's own two-way vocabulary — `"no-pod"` / `"provisioning"`
 * — matching the proposal's own state matrix for this surface: `no-pod` (tier
 * picker + loop) onward `Rent` into `provisioning` (steps + spinner) onward
 * auto into the console (`AgentOsConsole`, a separate page this one hands off
 * to, never rendered from here). A page's story is one complete STATE per
 * render, not a leaf-per-prop map — the two states here are exactly those two.
 * Grounded in `AgentWorkspaceEntity` (one-to-one `catalogOrder`, SKU
 * `nivo-ai-agent`) and its three real monthly tiers (Basic 490,000 / Pro
 * 990,000 / Scale 2,400,000 VND, `catalog-seeder.service.ts`) — no fabricated
 * proof numbers.
 */
const meta: Meta<typeof AgentOsProvision> = {
    title: "Nivo/Pages/AgentOsProvision/AgentOsProvision",
    component: AgentOsProvision,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof AgentOsProvision>

const NOOP = () => {}

const TIERS: ReadonlyArray<PricingTierRow> = [
    {
        id: "basic",
        name: "Basic",
        priceMonthlyVnd: 490000,
        unlocks: ["1 agent", "Zalo + Telegram", "1,000 messages / month", "Sample scripts by industry"],
    },
    {
        id: "pro",
        name: "Pro",
        priceMonthlyVnd: 990000,
        unlocks: ["3 agents", "Every channel (adds WhatsApp)", "5,000 messages / month", "Knowledge base (RAG)", "Playground"],
    },
    {
        id: "scale",
        name: "Scale",
        priceMonthlyVnd: 2400000,
        unlocks: ["Unlimited agents", "Priority model access", "Tool integrations", "SLA + dedicated support"],
    },
]

// Same six stages, ids, and icons as `OperatingLoopVisual`'s own story — the
// loop is shared brand vocabulary, not something this page invents.
const LOOP_NODES: Array<OperatingLoopVisualNode> = [
    { id: "website", label: "Website", icon: GlobeIcon },
    { id: "lead", label: "Lead", icon: TargetIcon },
    { id: "crm", label: "CRM", icon: DatabaseIcon },
    { id: "workflow", label: "Workflow", icon: ArrowsClockwiseIcon },
    { id: "ai-agent", label: "AI Agent", icon: SparkleIcon, isAi: true },
    { id: "dashboard", label: "Dashboard", icon: ChartBarIcon },
]

const LABELS: AgentOsProvisionLabels = {
    hero: {
        title: "Rent Agent OS",
        description:
            "A pod running a ready-made agent team plus n8n workflows, live on Zalo, Telegram, and WhatsApp — replying to customers, syncing orders, automating reminders, no engineering required.",
        ctaLabel: "Rent Agent OS",
        perMonthLabel: "/ month",
        selectLabel: "Select",
    },
    provisioning: {
        title: "Setting up your Agent OS…",
        description: "Pro plan · usually takes 1-2 minutes. You can leave this page — we'll let you know when it's ready.",
        refLabel: "externalWorkspaceRef:",
        refPendingLabel: "waiting to be assigned…",
        steps: [
            { label: "Provision workspace", description: "Creating the catalog order and the agent_workspaces record" },
            { label: "Install the default agent", description: "Loading the persona and model for the Pro plan…" },
            { label: "Connect channels", description: "Waiting on you to connect Zalo / Telegram / WhatsApp" },
        ],
        markFailedLabel: "Stuck? Cancel and retry",
    },
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    AgentOsProvisionCard: {
        tier: "block",
        role: "the provision hero — what a pod is, the three real tiers, and the primary CTA",
        storyId: "nivo-blocks-agentos-agentosprovisioncard-agentosprovisioncard--default",
    },
    OperatingLoopVisual: {
        tier: "block",
        role: "the shared brand loop rail, lit on the AI stage Agent OS itself is",
        storyId: "nivo-blocks-landing-operatingloopvisual-operatingloopvisual--default",
    },
    ProvisioningState: {
        tier: "block",
        role: "the pod-spinning-up waiting surface — steps + spinner, no loop rail",
        storyId: "nivo-blocks-agentos-provisioningstate-provisioningstate--default",
    },
    StackV: { tier: "frame", role: "the page's own vertical rhythm — hero over the loop rail" },
}

/** STATE — no pod yet: the tier picker and the loop rail, Pro pre-selected. */
export const NoPod: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AgentOsProvision"
                tier="screen"
                leaf="No pod"
                annotate={ANNOTATE}
                reason="A page's story is one complete state per render, not a leaf-per-prop map. Before a buyer has ever rented a pod: the hero explains what a pod is, the three real monthly tiers sit side by side (Pro pre-selected, matching the catalog's own middle tier), and the loop rail below shows Agent OS running the AI stage of the brand's operating loop."
                states={[
                    {
                        name: "status = no-pod, selectedTierId = pro",
                        why: "The first thing a buyer sees at /agent-os with no `AgentWorkspaceEntity` on their account yet — a tier to pick and one CTA to start renting.",
                        code: `<AgentOsProvision
    status="no-pod"
    tiers={tiers}
    selectedTierId="pro"
    onSelectTier={onSelectTier}
    onProvision={onProvision}
    loopNodes={loopNodes}
    activeLoopNodeId="ai-agent"
    labels={labels}
/>`,
                        render: (
                            <AgentOsProvision
                                status="no-pod"
                                tiers={TIERS}
                                selectedTierId="pro"
                                onSelectTier={NOOP}
                                onProvision={NOOP}
                                loopNodes={LOOP_NODES}
                                activeLoopNodeId="ai-agent"
                                labels={LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** STATE — the pod is spinning up: steps + spinner, no loop rail. */
export const Provisioning: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AgentOsProvision"
                tier="screen"
                leaf="Provisioning"
                annotate={ANNOTATE}
                reason="Right after the buyer presses Rent: the whole body swaps to `ProvisioningState`'s waiting surface — steps + spinner + the pending `externalWorkspaceRef` — with no loop rail beneath it, mirroring the prototype's own dedicated waiting screen. The connected layer auto-navigates to `AgentOsConsole` once the workspace flips to `active`."
                states={[
                    {
                        name: "status = provisioning, currentStepIndex = 1",
                        why: "The workspace record exists (step 1 done) and the default agent is loading (step 2 in flight); channels are still pending, so `externalWorkspaceRef` reads its pending caption.",
                        code: `<AgentOsProvision
    status="provisioning"
    currentStepIndex={1}
    externalWorkspaceRef={null}
    labels={labels}
/>`,
                        render: (
                            <AgentOsProvision
                                status="provisioning"
                                currentStepIndex={1}
                                externalWorkspaceRef={null}
                                labels={LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
