import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    N8nWorkflowTable,
    type N8nWorkflowTableLabels,
    type ExecutionRowView,
    type WorkflowRowView,
} from "@sb-components/nivoexpert/blocks/automation/N8nWorkflowTable/N8nWorkflowTable"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `N8nWorkflowTable` — the "n8n workflows" tab. A table of the expert's workflows
 * (name · webhook · active toggle) plus a recent-executions list and a labelled
 * region standing in for the embedded n8n editor. The three phases — `empty`,
 * `with-workflows`, `with-executions` — are DATA, so they are STATES of the single
 * shape. Grounded in the real `N8nToolsService.listAll()` / `executions()` and
 * `setActive(id, active)` behind the toggle.
 */
const meta: Meta<typeof N8nWorkflowTable> = {
    title: "NivoExpert/Blocks/Automation/N8nWorkflowTable/N8nWorkflowTable",
    component: N8nWorkflowTable,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof N8nWorkflowTable>

const LABELS: N8nWorkflowTableLabels = {
    title: "Manage workflows",
    description: "Turn a workflow off and the assistant can no longer use it. Edit the details in the builder below.",
    reloadLabel: "Reload",
    workflowColumn: "Workflow",
    webhookColumn: "Webhook",
    activeColumn: "Active",
    activeLabel: "On",
    inactiveLabel: "Off",
    tableAriaLabel: "n8n workflows",
    noWebhookLabel: "—",
    emptyTitle: "No workflows yet",
    emptyDescription: "Build your first workflow in the editor below — it will show up here.",
    executionsTitle: "Recent runs",
    statusOptions: { success: "success", error: "error", running: "running" },
    editorPlaceholderTitle: "n8n editor",
    editorPlaceholderDescription: "The workflow builder loads here inside the app.",
}

const WORKFLOWS: Array<WorkflowRowView> = [
    { id: "wf-1", name: "Welcome new learners", webhookPath: "welcome-learner", active: true },
    { id: "wf-2", name: "Weekly sales digest", webhookPath: "weekly-sales-digest", active: true },
    { id: "wf-3", name: "Stalled-learner reminder", webhookPath: null, active: false },
]

const EXECUTIONS: Array<ExecutionRowView> = [
    { id: "ex-1", workflowName: "Welcome new learners", status: "success", startedAtLabel: "2 Aug 2026, 09:14" },
    { id: "ex-2", workflowName: "Weekly sales digest", status: "error", startedAtLabel: "1 Aug 2026, 08:00" },
    { id: "ex-3", workflowName: "Welcome new learners", status: "running", startedAtLabel: "2 Aug 2026, 09:20" },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the manage card, the recent-runs card, and the editor placeholder" },
    Table: { tier: "composite", role: "the workflow rows — name, webhook, and the active toggle" },
    EmptyState: { tier: "composite", role: "shown when there are no workflows, and inside the editor placeholder" },
    ChoiceSwitch: { tier: "atom", role: "turns one workflow on or off" },
    Chip: { tier: "atom", role: "a recent run's status — success, error, or running" },
    Typography: { tier: "atom", role: "the names, the webhook paths, and each run line" },
}

/** LEAF — one shape; empty, with-workflows, and with-executions are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="N8nWorkflowTable"
                tier="block"
                leaf="Workflows"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                reason="Blocks take no `className`: the block owns the workflow and execution entities, so its phases are states of one shape. The recent-runs card appears only when a run exists; the editor is app wiring, so it is a labelled placeholder, never a real iframe."
                states={[
                    {
                        name: "workflows = [] (empty)",
                        why: "No workflows yet, so the table is replaced by an empty state pointing to the builder. The editor placeholder still shows where a first workflow gets built.",
                        code: "<N8nWorkflowTable {...props} workflows={[]} executions={[]} />",
                        render: (
                            <N8nWorkflowTable
                                workflows={[]}
                                executions={[]}
                                onToggleWorkflow={() => {}}
                                onReload={() => {}}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "with workflows, no runs",
                        why: "Three workflows listed, each with its webhook and an on/off toggle (the third has no Webhook trigger yet, so its webhook cell is a dash). Nothing has run, so there is no recent-runs card.",
                        code: "<N8nWorkflowTable {...props} workflows={workflows} executions={[]} />",
                        render: (
                            <N8nWorkflowTable
                                workflows={WORKFLOWS}
                                executions={[]}
                                onToggleWorkflow={() => {}}
                                onReload={() => {}}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "with executions",
                        why: "Alongside the table, the recent-runs card lists the last runs with a status chip and time — success, error, and one still running — so the expert can see automation actually fired.",
                        code: "<N8nWorkflowTable {...props} workflows={workflows} executions={executions} togglingId=\"wf-2\" />",
                        render: (
                            <N8nWorkflowTable
                                workflows={WORKFLOWS}
                                executions={EXECUTIONS}
                                onToggleWorkflow={() => {}}
                                togglingId="wf-2"
                                onReload={() => {}}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The first fetch hasn't resolved, so the manage card keeps its title and draws a fixed count of workflow-shaped rows — name, webhook, and toggle all shimmering — while the reload action and executions card fall away, so nothing jumps when the workflows land.",
                        code: `<N8nWorkflowTable
    workflows={[]}
    executions={[]}
    onToggleWorkflow={toggle}
    onReload={reload}
    labels={labels}
    isSkeleton
/>`,
                        render: (
                            <N8nWorkflowTable
                                workflows={[]}
                                executions={[]}
                                onToggleWorkflow={() => {}}
                                onReload={() => {}}
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
