import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    AgentOsHeader,
    type AgentOsHeaderLabels,
} from "@sb-components/nivo/blocks/agent-os/AgentOsHeader/AgentOsHeader"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `AgentOsHeader` — the Agent OS console masthead: pod name + status `Chip` +
 * `externalWorkspaceRef` + ONE primary action, which CHANGES with the status. Four
 * DATA states of the single shape (`provisioning`/`active`/`suspended`/`failed`)
 * rather than four leaves — the chip tone, which actions exist, and the ref line are
 * all derived from the same `status`, so drawing them as separate components would
 * let them drift out of sync. Grounded in `AgentWorkspaceEntity`
 * (`status: "provisioning" | "active" | "suspended" | "failed"`, `externalWorkspaceRef`).
 */
const meta: Meta<typeof AgentOsHeader> = {
    title: "Nivo/Blocks/AgentOs/AgentOsHeader/AgentOsHeader",
    component: AgentOsHeader,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof AgentOsHeader>

const LABELS: AgentOsHeaderLabels = {
    statusLabels: {
        provisioning: "Provisioning",
        active: "Active",
        suspended: "Suspended",
        failed: "Failed",
    },
    refLabel: "ref:",
    refPendingLabel: "pending…",
    viewLogLabel: "View log",
    suspendLabel: "Suspend",
    resumeLabel: "Resume",
    retryLabel: "Retry",
}

const NOOP = () => {}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the masthead face" },
    Chip: { tier: "atom", role: "the status badge, toned by lifecycle (active success, suspended warning, failed danger, provisioning neutral)" },
    Typography: { tier: "atom", role: "the pod name, the ref-code line (monospace once resolved, plain while pending), and every button label" },
    Button: { tier: "atom", role: "\"View log\" (active/failed only) + the one primary action, which changes with status" },
}

/** LEAF — the masthead has one shape; the four statuses are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AgentOsHeader"
                tier="block"
                leaf="Console masthead"
                annotate={ANNOTATE}
                reason="Blocks take no `className`: the header owns the pod's lifecycle, so `provisioning`/`active`/`suspended`/`failed` are states of one shape rather than four components that could disagree with each other. `provisioning` carries no action at all — nothing is press-able yet, the actionable surface at that point is the separate `ProvisioningState` waiting screen. `active` pairs a secondary `View log` with the primary `Suspend`; `suspended` carries only `Resume` (primary tone — the one thing to do); `failed` pairs `View log` with a danger-toned `Retry`."
                states={[
                    {
                        name: "status = \"provisioning\"",
                        why: "The pod is still being assembled by the system — `externalWorkspaceRef` is `null` (rendered as the pending caption instead of a ref code) and there is nothing for the owner to press yet, so no action renders at all.",
                        code: `<AgentOsHeader
  status="provisioning"
  podName="Agent OS · Pod Pro"
  externalWorkspaceRef={null}
  labels={labels}
/>`,
                        render: (
                            <AgentOsHeader
                                status="provisioning"
                                podName="Agent OS · Pod Pro"
                                externalWorkspaceRef={null}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "status = \"active\"",
                        why: "The pod is running: success chip, a real ref code, `View log` for a quick peek, and the primary swaps to `Suspend` — the one lifecycle action available while healthy.",
                        code: `<AgentOsHeader
  status="active"
  podName="Agent OS · Pod Pro"
  externalWorkspaceRef="aos-ws-7f2a91c"
  onViewLog={viewLog}
  onSuspend={suspend}
  labels={labels}
/>`,
                        render: (
                            <AgentOsHeader
                                status="active"
                                podName="Agent OS · Pod Pro"
                                externalWorkspaceRef="aos-ws-7f2a91c"
                                onViewLog={NOOP}
                                onSuspend={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "status = \"suspended\"",
                        why: "Warning chip, agents/workflows stopped acting — the ONLY action is `Resume`, in primary tone since getting back to active is the one thing to do; there is nothing to log while nothing has been running.",
                        code: `<AgentOsHeader
  status="suspended"
  podName="Agent OS · Pod Pro"
  externalWorkspaceRef="aos-ws-7f2a91c"
  onResume={resume}
  labels={labels}
/>`,
                        render: (
                            <AgentOsHeader
                                status="suspended"
                                podName="Agent OS · Pod Pro"
                                externalWorkspaceRef="aos-ws-7f2a91c"
                                onResume={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "status = \"failed\"",
                        why: "Provisioning or an operation broke — the danger chip flags it, `View log` stays available to see why, and the primary becomes a danger-toned `Retry` so the owner can re-trigger it from the masthead itself.",
                        code: `<AgentOsHeader
  status="failed"
  podName="Agent OS · Pod Pro"
  externalWorkspaceRef="aos-ws-7f2a91c"
  onViewLog={viewLog}
  onRetry={retry}
  labels={labels}
/>`,
                        render: (
                            <AgentOsHeader
                                status="failed"
                                podName="Agent OS · Pod Pro"
                                externalWorkspaceRef="aos-ws-7f2a91c"
                                onViewLog={NOOP}
                                onRetry={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The console's own first fetch hasn't resolved yet, so the masthead draws a representative `active` shape shimmering — title, chip, ref line, and both actions — matching the busiest real branch so nothing jumps when the status lands.",
                        code: "<AgentOsHeader isSkeleton />",
                        render: <AgentOsHeader isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
