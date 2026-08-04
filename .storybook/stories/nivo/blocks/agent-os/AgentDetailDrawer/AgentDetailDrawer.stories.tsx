import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import {
    AgentDetailDrawer,
    type AgentDetailDrawerLabels,
    type AgentOsChannelKind,
} from "@sb-components/nivo/blocks/agent-os/AgentDetailDrawer/AgentDetailDrawer"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `AgentDetailDrawer` — overlay drawer over one Agent OS agent: read-only
 * model/status/channels, then editable persona name + system prompt, then the
 * tools it may call and the knowledge sources it may cite.
 */
const meta: Meta<typeof AgentDetailDrawer> = {
    title: "Nivo/Blocks/AgentOs/AgentDetailDrawer/AgentDetailDrawer",
    component: AgentDetailDrawer,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof AgentDetailDrawer>

const LABELS: AgentDetailDrawerLabels = {
    statusOptions: { active: "Active", paused: "Paused" },
    channelOptions: { zalo: "Zalo", telegram: "Telegram", whatsapp: "WhatsApp" },
    modelLabel: "Model",
    statusLabel: "Status",
    channelsLabel: "Channels",
    personaFieldLabel: "Persona / role",
    promptFieldLabel: "System prompt",
    toolsLabel: "Tools this agent may use",
    knowledgeLabel: "Knowledge base",
    cancelLabel: "Cancel",
    saveLabel: "Save changes",
}

const CHANNELS: ReadonlyArray<AgentOsChannelKind> = ["zalo", "whatsapp"]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Drawer.CloseTrigger": { tier: "heroui", role: "the close button, upper-right" },
    KeyValueList: { tier: "composite", role: "the read-only model/status/channels summary" },
    InputText: { tier: "atom", role: "the editable persona name" },
    InputTextarea: { tier: "atom", role: "the editable system prompt" },
    ChipGroup: { tier: "composite", role: "the tools row, and the knowledge-sources row" },
    Button: { tier: "atom", role: "cancel (ghost) and save (primary, busy while saving)" },
}

/** Shared controlled wrapper — one `isOpen`/persona/prompt state feeds every leaf state below, matching how `SubmissionAttemptsDrawer`'s story shares its trigger across states. */
const ControlledAgentDetailDrawer = () => {
    const [isOpen, setIsOpen] = useState(true)
    const [personaName, setPersonaName] = useState("Sales — Mai")
    const [systemPrompt, setSystemPrompt] = useState("Advise on products, close orders, and hand order details to the order-sync workflow.")

    const base = {
        isOpen,
        onOpenChange: setIsOpen,
        personaName,
        onPersonaNameChange: setPersonaName,
        model: "GPT-4o mini",
        status: "active" as const,
        channels: CHANNELS,
        systemPrompt,
        onSystemPromptChange: setSystemPrompt,
        tools: ["Look up order", "Create note", "Send product photo"],
        knowledgeSources: ["Price list 2026.pdf", "Returns FAQ"],
        onSave: () => setIsOpen(false),
        onCancel: () => setIsOpen(false),
        labels: LABELS,
    }

    return (
        <div data-tier="fixture" className="flex flex-col gap-3 p-8">
            <Button label="Open agent details" variant="secondary" size="sm" classNames={["self-start"]} onPress={() => setIsOpen(true)} />
            <BlockAnatomy
                name="AgentDetailDrawer"
                tier="block"
                leaf="Agent detail"
                annotate={ANNOTATE}
                reason="A presentational overlay drawer over one agent's persona/model/tools/knowledge/prompt. Read-only facts (model, status, channels) sit above the editable fields — changing what an agent answers on or which model runs it belongs to the Channels/Models sections, not this drawer."
                states={[
                    {
                        name: "editable, resting",
                        why: "The common state: persona name and system prompt are editable, tools and knowledge sources are shown as chip rows, and both footer actions are live.",
                        code: `<AgentDetailDrawer
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  personaName={personaName}
  onPersonaNameChange={setPersonaName}
  model="GPT-4o mini"
  status="active"
  channels={["zalo", "whatsapp"]}
  systemPrompt={systemPrompt}
  onSystemPromptChange={setSystemPrompt}
  tools={tools}
  knowledgeSources={sources}
  onSave={save}
  onCancel={cancel}
  labels={labels}
/>`,
                        render: <AgentDetailDrawer {...base} />,
                    },
                    {
                        name: "isSaving = true",
                        why: "The save mutation is in flight — both fields lock and the save button shows its busy state so the operator can't double-submit.",
                        code: "<AgentDetailDrawer isSaving … />",
                        render: <AgentDetailDrawer {...base} isSaving />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The drawer's own first fetch hasn't resolved yet, so the same layout shimmers end to end — the title, the read-only summary, both fields, and both chip rows — matching the loaded drawer so nothing jumps when the agent lands.",
                        code: "<AgentDetailDrawer isSkeleton … />",
                        render: <AgentDetailDrawer {...base} isSkeleton />,
                    },
                ]}
            />
        </div>
    )
}

/** All three states (editable, saving, loading) live inside one `BlockAnatomy` panel — see its `states` array. */
export const Default: Story = {
    render: () => <ControlledAgentDetailDrawer />,
}
