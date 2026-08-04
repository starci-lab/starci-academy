import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    DeployStatusCard,
    type DeployStatusCardLabels,
    type DeployStatusSnapshot,
} from "@sb-components/nivo/blocks/expert-site/DeployStatusCard/DeployStatusCard"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `DeployStatusCard` — the operating-loop tile over the site's current stack.
 * One composition: a titled tile holding the current deployment's status and a
 * retry trigger that only appears once that deployment has failed. Two DATA
 * states of the single shape: `no-deployment` (site never published) and
 * `with-deployment`. Grounded in the real `ExpertDeploymentEntity`; the status
 * mirrors `ExpertDeploymentStatus`.
 */
const meta: Meta<typeof DeployStatusCard> = {
    title: "Nivo/Blocks/ExpertSite/DeployStatusCard/DeployStatusCard",
    component: DeployStatusCard,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof DeployStatusCard>

const LABELS: DeployStatusCardLabels = {
    title: "Deployment",
    notDeployedLabel: "Not published yet",
    statusOptions: {
        pending: "Queued",
        building: "Building",
        running: "Deployed",
        stopped: "Stopped",
        failed: "Failed",
    },
    retryLabel: "Retry",
}

const RUNNING: DeployStatusSnapshot = { status: "running", updatedAtLabel: "2 hours ago" }
const FAILED: DeployStatusSnapshot = { status: "failed", updatedAtLabel: "12 minutes ago" }

const NOOP = () => {}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the tile face and title" },
    Chip: { tier: "atom", role: "the deployment status, toned by lifecycle (running success, failed danger, others neutral/accent)" },
    Typography: { tier: "atom", role: "the relative-time caption beside the status" },
    Button: { tier: "atom", role: "the retry trigger — rendered only in the `failed` status" },
}

/** LEAF — the tile has one shape; no-deployment vs with-deployment are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="DeployStatusCard"
                tier="block"
                leaf="Deployment status"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xs"
                reason="Blocks take no `className`: the block owns the deployment entity, so no-deployment vs with-deployment are states of one shape. `onRetry` is the one intent it emits, reachable only from the `failed` status — every other status renders the same tile with no action, so there is nothing to press before there is something to fix."
                states={[
                    {
                        name: "deployment = null",
                        why: "The site has never been published, so no `ExpertDeploymentEntity` exists yet. The tile reads as an intentional resting state rather than a broken fetch.",
                        code: `<DeployStatusCard
    deployment={null}
    onRetry={retry}
    labels={labels}
/>`,
                        render: <DeployStatusCard deployment={null} onRetry={NOOP} labels={LABELS} />,
                    },
                    {
                        name: "deployment running",
                        why: "The healthy resting state once the site is live — a success-toned chip plus the relative time since it last changed status. No retry trigger: nothing here needs fixing.",
                        code: "<DeployStatusCard deployment={{ status: \"running\", updatedAtLabel: \"2 hours ago\" }} onRetry={retry} … />",
                        render: <DeployStatusCard deployment={RUNNING} onRetry={NOOP} labels={LABELS} />,
                    },
                    {
                        name: "deployment failed",
                        why: "Orchestration failed on the last attempt — a danger-toned chip plus the retry button, so the owner can re-trigger it without leaving the overview.",
                        code: "<DeployStatusCard deployment={{ status: \"failed\", updatedAtLabel: \"12 minutes ago\" }} onRetry={retry} … />",
                        render: <DeployStatusCard deployment={FAILED} onRetry={NOOP} labels={LABELS} />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The tile's own first fetch hasn't resolved yet, so the same titled tile draws a status-shaped chip shimmering — matching the loaded row so nothing jumps when the deployment lands.",
                        code: `<DeployStatusCard
    deployment={null}
    onRetry={retry}
    labels={labels}
    isSkeleton
/>`,
                        render: <DeployStatusCard deployment={null} onRetry={NOOP} labels={LABELS} isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
