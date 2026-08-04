import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    ModelsSection,
    type AgentOsModelRow,
    type ModelsSectionLabels,
} from "@sb-components/nivo/blocks/agent-os/ModelsSection/ModelsSection"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ModelsSection` — the Agent OS pod's "Models" tab: the AI models available
 * to the pod's agents, each with its provider and whether it is the pod's
 * default. Two DATA states of the single shape: `empty` and `with-rows`. A
 * BASIC stub-section — a read-only list; assigning a model per agent is
 * deferred to `AgentDetailDrawer`.
 */
const meta: Meta<typeof ModelsSection> = {
    title: "Nivo/Blocks/AgentOs/ModelsSection/ModelsSection",
    component: ModelsSection,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ModelsSection>

const LABELS: ModelsSectionLabels = {
    title: "Models",
    description: "The AI models your pod's agents can be assigned to.",
    defaultLabel: "Default",
    emptyTitle: "No models available yet",
    emptyDescription: "Models unlock as your pod finishes provisioning.",
}

const MODELS: Array<AgentOsModelRow> = [
    { id: "model-1", name: "GPT-4o mini", providerLabel: "OpenAI", isDefault: true },
    { id: "model-2", name: "Qwen 2.5", providerLabel: "Local — self-hosted", isDefault: false },
    { id: "model-3", name: "Claude Haiku", providerLabel: "Anthropic", isDefault: false },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the outer card, and one nested card per model" },
    EmptyState: { tier: "composite", role: "the empty branch before the pod has any model available" },
    Chip: { tier: "atom", role: "marks the pod's current default model" },
    Typography: { tier: "atom", role: "the model name and provider" },
}

/** LEAF — one shape; empty vs with-rows are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ModelsSection"
                tier="block"
                leaf="Models"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xl"
                reason="Blocks take no `className`: the block owns the pod's model list, so empty vs with-rows are states of one shape. This is a BASIC stub-section — read-only for now; per-agent model assignment lives in `AgentDetailDrawer`, not here, so this list carries no selection action of its own."
                states={[
                    {
                        name: "models = []",
                        why: "No models available yet — a pod that hasn't finished provisioning. The card keeps its title and reads as an intentional empty state rather than a blank panel.",
                        code: "<ModelsSection models={[]} labels={labels} />",
                        render: <ModelsSection models={[]} labels={LABELS} />,
                    },
                    {
                        name: "models populated",
                        why: "Three models the pod can assign to an agent — a cloud default, a local self-hosted option, and a second cloud provider — with the Default chip on exactly one.",
                        code: "<ModelsSection models={models} labels={labels} />",
                        render: <ModelsSection models={MODELS} labels={LABELS} />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The section's own first fetch hasn't resolved yet, so the same titled card draws a fixed count of model-shaped rows — name and provider shimmering.",
                        code: "<ModelsSection models={[]} labels={labels} isSkeleton />",
                        render: <ModelsSection models={[]} labels={LABELS} isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
