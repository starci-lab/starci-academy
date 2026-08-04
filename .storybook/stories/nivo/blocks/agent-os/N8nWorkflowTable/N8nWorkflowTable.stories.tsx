import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    N8nWorkflowTable,
    type AgentOsWorkflowRow,
    type N8nWorkflowTableLabels,
} from "@sb-components/nivo/blocks/agent-os/N8nWorkflowTable/N8nWorkflowTable"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `N8nWorkflowTable` — the Agent OS pod's "Workflows" section: one n8n
 * workflow per row (name · trigger · on/off · last run · edit). Two DATA
 * states of the single shape: `empty` and `with-workflows`. A fresh,
 * pod-scoped, dark-shell twin of the nivoexpert automation block of the same
 * name — structure only, not an import.
 */
const meta: Meta<typeof N8nWorkflowTable> = {
    title: "Nivo/Blocks/AgentOs/N8nWorkflowTable/N8nWorkflowTable",
    component: N8nWorkflowTable,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof N8nWorkflowTable>

const LABELS: N8nWorkflowTableLabels = {
    title: "Workflows",
    description: "Turn a workflow off and it stops firing for every agent on this pod.",
    workflowColumn: "Workflow",
    triggerColumn: "Trigger",
    activeColumn: "Active",
    lastRunColumn: "Last run",
    actionsColumn: "",
    activeLabel: "On",
    inactiveLabel: "Off",
    noLastRunLabel: "Never run",
    editLabel: "Edit",
    tableAriaLabel: "Agent OS n8n workflows",
    emptyTitle: "No workflows yet",
    emptyDescription: "Add a workflow to automate a repeated task — payment reminders, order sync, weekly reports.",
}

const WORKFLOWS: Array<AgentOsWorkflowRow> = [
    { id: "wf-1", name: "Reply after hours", triggerLabel: "New message", active: true, lastRunLabel: "5 minutes ago" },
    { id: "wf-2", name: "Sync orders → Sheet", triggerLabel: "New order", active: true, lastRunLabel: "1 hour ago" },
    { id: "wf-3", name: "Remind unpaid customers", triggerLabel: "09:00 daily", active: false, lastRunLabel: "2 days ago" },
    { id: "wf-4", name: "Weekly report to admin", triggerLabel: "Monday, weekly", active: true, lastRunLabel: null },
]

const NOOP = () => {}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the titled card wrapping the workflow table" },
    Table: { tier: "composite", role: "the workflow rows — name, trigger, active toggle, last run, and edit" },
    EmptyState: { tier: "composite", role: "shown when the pod has no workflows yet" },
    ChoiceSwitch: { tier: "atom", role: "turns one workflow on or off" },
    Button: { tier: "atom", role: "opens a workflow for editing" },
    Typography: { tier: "atom", role: "the workflow names, triggers, and last-run times" },
}

/** LEAF — one shape; empty vs with-workflows are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="N8nWorkflowTable"
                tier="block"
                leaf="Workflows"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                reason="Blocks take no `className`: the block owns the pod's workflow entity, so empty vs with-workflows are states of one shape. Turning a workflow off is a real intent (`onToggleWorkflow`); editing deep-links into the n8n builder (`onEditWorkflow`) rather than being modeled inline."
                states={[
                    {
                        name: "workflows = [] (empty)",
                        why: "No workflows added yet, so the table is replaced by an empty state pointing at adding the first one.",
                        code: "<N8nWorkflowTable workflows={[]} onToggleWorkflow={toggle} onEditWorkflow={edit} labels={labels} />",
                        render: (
                            <N8nWorkflowTable
                                workflows={[]}
                                onToggleWorkflow={NOOP}
                                onEditWorkflow={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "with workflows",
                        why: "Four workflows, three active and one off, one that has never run yet (\"Never run\" instead of a fabricated date). Each row's switch fires independently and the edit action opens that workflow.",
                        code: "<N8nWorkflowTable workflows={workflows} onToggleWorkflow={toggle} onEditWorkflow={edit} togglingId=\"wf-2\" labels={labels} />",
                        render: (
                            <N8nWorkflowTable
                                workflows={WORKFLOWS}
                                onToggleWorkflow={NOOP}
                                onEditWorkflow={NOOP}
                                togglingId="wf-2"
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The first fetch hasn't resolved, so the card keeps its title and draws a fixed count of workflow-shaped rows — name, trigger, toggle, last run, and edit all shimmering — so nothing jumps when the workflows land.",
                        code: `<N8nWorkflowTable
    workflows={[]}
    onToggleWorkflow={toggle}
    onEditWorkflow={edit}
    labels={labels}
    isSkeleton
/>`,
                        render: (
                            <N8nWorkflowTable
                                workflows={[]}
                                onToggleWorkflow={NOOP}
                                onEditWorkflow={NOOP}
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
