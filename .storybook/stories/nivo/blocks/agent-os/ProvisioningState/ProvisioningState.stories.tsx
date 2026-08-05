import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    ProvisioningState,
    type ProvisioningStateLabels,
} from "@sb-components/nivo/blocks/agent-os/ProvisioningState/ProvisioningState"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ProvisioningState` — the pod-spinning-up waiting surface between choosing a
 * tier and landing in the console: a spinner, a fixed 3-step progress, and the
 * pending `externalWorkspaceRef`. One composition; `currentStepIndex` (which
 * step is in flight) and `externalWorkspaceRef` (assigned or still pending) are
 * DATA states of the single shape. Grounded in
 * `AgentWorkspaceEntity.status === "provisioning"`.
 *
 * Also carries a low-emphasis "stuck? cancel and retry" control
 * (`onMarkFailed`) — the owner-triggered `AgentWorkspaceAction.MarkFailed`
 * escape hatch out of a provisioning pod that never finished. Optional so the
 * surface still composes without it; the connected layer always supplies it.
 */
const meta: Meta<typeof ProvisioningState> = {
    title: "Nivo/Blocks/AgentOs/ProvisioningState/ProvisioningState",
    component: ProvisioningState,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ProvisioningState>

const LABELS: ProvisioningStateLabels = {
    title: "Setting up your Agent OS…",
    description: "Pro plan · usually takes 1–2 minutes. You can leave this page — we'll let you know when it's ready.",
    refLabel: "externalWorkspaceRef:",
    refPendingLabel: "waiting to be assigned…",
    steps: [
        { label: "Provision workspace", description: "Creates the catalog order and the agent_workspaces record." },
        { label: "Install the default agent", description: "Loads the persona and model for your plan." },
        { label: "Connect channels", description: "Waiting for you to connect Zalo, Telegram, or WhatsApp." },
    ],
    markFailedLabel: "Stuck? Cancel and retry",
}

const NOOP = () => {}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the waiting surface's face" },
    Spinner: { tier: "atom", role: "the busy indicator above the heading" },
    Typography: { tier: "atom", role: "the heading, supporting line, and the ref line" },
    Stepper: { tier: "composite", role: "the 3-step vertical progress track — done / current / upcoming", storyId: "composites-navigation-stepper--vertical" },
    StepBadge: { tier: "atom", role: "the loading branch's own step-row mirror — Stepper has no isSkeleton yet" },
    Button: { tier: "atom", role: "the low-emphasis mark-failed escape hatch, only when a stuck pod supplies the handler" },
}

/** LEAF — the surface has one shape; the in-flight step and the ref are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ProvisioningState"
                tier="block"
                leaf="Provisioning surface"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-md"
                reason="Blocks take no `className`: `currentStepIndex` and `externalWorkspaceRef` are both DATA read off `AgentWorkspaceEntity` while it sits in `provisioning`, so every point along the flow is a state of one shape, never a different composition. `Stepper` has no co-located `isSkeleton`, so the loading state hand-mirrors its three rows with the same real atoms (`StepBadge`, `Typography`) shimmering instead."
                states={[
                    {
                        name: "step 0 (provisioning workspace)",
                        why: "The very first moment: nothing done yet, the catalog order and the workspace record are being created.",
                        code: "<ProvisioningState currentStepIndex={0} externalWorkspaceRef={null} labels={labels} onMarkFailed={cancelAndRetry} />",
                        render: <ProvisioningState currentStepIndex={0} externalWorkspaceRef={null} labels={LABELS} onMarkFailed={NOOP} />,
                    },
                    {
                        name: "no escape hatch (onMarkFailed omitted)",
                        why: "The surface's own very first render, before the connected layer has anything to act on yet — the control is absent entirely, not disabled, since there is nothing meaningful `onMarkFailed` could do at this instant.",
                        code: "<ProvisioningState currentStepIndex={0} externalWorkspaceRef={null} labels={labels} />",
                        render: <ProvisioningState currentStepIndex={0} externalWorkspaceRef={null} labels={LABELS} />,
                    },
                    {
                        name: "step 1 (installing the default agent)",
                        why: "The workspace exists; the persona and model for the chosen plan are loading now — the resting look most buyers actually see.",
                        code: "<ProvisioningState currentStepIndex={1} externalWorkspaceRef={null} labels={labels} onMarkFailed={cancelAndRetry} />",
                        render: <ProvisioningState currentStepIndex={1} externalWorkspaceRef={null} labels={LABELS} onMarkFailed={NOOP} />,
                    },
                    {
                        name: "step 2 (connecting channels)",
                        why: "Workspace and agent are ready; the flow is now waiting on the buyer to connect a channel before the pod can go active.",
                        code: "<ProvisioningState currentStepIndex={2} externalWorkspaceRef={null} labels={labels} onMarkFailed={cancelAndRetry} />",
                        render: <ProvisioningState currentStepIndex={2} externalWorkspaceRef={null} labels={LABELS} onMarkFailed={NOOP} />,
                    },
                    {
                        name: "complete (externalWorkspaceRef assigned)",
                        why: "All three steps read done and the ref has landed — the moment right before the caller hands off to the console.",
                        code: "<ProvisioningState currentStepIndex={3} externalWorkspaceRef=\"aos-ws-7f2a91c\" labels={labels} onMarkFailed={cancelAndRetry} />",
                        render: <ProvisioningState currentStepIndex={3} externalWorkspaceRef="aos-ws-7f2a91c" labels={LABELS} onMarkFailed={NOOP} />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The surface's own first read of the workspace status hasn't resolved yet, so the heading, the three step rows, and the ref line all shimmer in the loaded shape.",
                        code: `<ProvisioningState
    currentStepIndex={0}
    externalWorkspaceRef={null}
    labels={labels}
    isSkeleton
/>`,
                        render: <ProvisioningState currentStepIndex={0} externalWorkspaceRef={null} labels={LABELS} isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
