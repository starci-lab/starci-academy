import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    AiManagementDashboard,
    type AiManagementDashboardLabels,
} from "@sb-components/nivoexpert/pages/automation/AiManagementDashboard/AiManagementDashboard"
import type { AgentRunView, AgentTaskConsoleLabels, AgentToolView } from "@sb-components/nivoexpert/blocks/automation/AgentTaskConsole/AgentTaskConsole"
import type { AiOpsSummaryMetrics } from "@sb-components/nivoexpert/blocks/automation/AiOpsSummary/AiOpsSummary"
import type { ExecutionRowView, N8nWorkflowTableLabels, WorkflowRowView } from "@sb-components/nivoexpert/blocks/automation/N8nWorkflowTable/N8nWorkflowTable"
import type { OpsEventRowView, OpsEventTableLabels } from "@sb-components/nivoexpert/blocks/automation/OpsEventTable/OpsEventTable"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `AiManagementDashboard` — the AI-management PAGE: summary tiles atop a tab strip
 * switching between the operations assistant, the n8n workflows it can call, and
 * the platform events those workflows can listen for. A page's story is one
 * complete STATE per story — `loading`, `content`, `empty` — not a leaf-per-prop
 * map. Grounded in the real ops module: `ClawbotService`, `N8nToolsService`, and
 * `N8nDispatcherService`'s five `OpsEvent`s.
 */
const meta: Meta<typeof AiManagementDashboard> = {
    title: "NivoExpert/Pages/Automation/AiManagementDashboard/AiManagementDashboard",
    component: AiManagementDashboard,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof AiManagementDashboard>

const NOOP = () => {}

const LABELS: AiManagementDashboardLabels = {
    title: "AI management",
    description: "Everything automation in one place — the assistant, the workflows it can call, and the events they listen for.",
    tabsAriaLabel: "Automation sections",
    assistantTabLabel: "Assistant",
    workflowsTabLabel: "Workflows",
    eventsTabLabel: "Events",
}

const ASSISTANT_LABELS: AgentTaskConsoleLabels = {
    title: "Operations assistant",
    description: "Hand over a task in words — the assistant picks the right n8n workflow, runs it, then reports back.",
    inputPlaceholder: "e.g. welcome the learners who just signed up",
    inputAriaLabel: "Task for the operations assistant",
    submitLabel: "Give task",
    submitRunningLabel: "Running…",
    taskLabel: "Task",
    ranPrefix: "Ran",
    directAnswerLabel: "Answered directly (no workflow)",
    errorLabel: "Error",
    rawOutputLabel: "Raw workflow output",
    emptyRunsLabel: "No tasks given yet.",
    toolsTitle: "Workflows the assistant can use",
    reloadLabel: "Reload",
    webhookPrefix: "webhook",
    noWebhookLabel: "no Webhook trigger yet",
    noToolsTitle: "No workflows are active",
    noToolsDescription: "Open the Workflows tab to build one — the assistant will pick it up automatically.",
}

const WORKFLOWS_LABELS: N8nWorkflowTableLabels = {
    title: "Manage workflows",
    description: "Every workflow the assistant can reach for, and whether it is currently active.",
    reloadLabel: "Reload",
    workflowColumn: "Workflow",
    webhookColumn: "Webhook",
    activeColumn: "Active",
    activeLabel: "Active",
    inactiveLabel: "Inactive",
    tableAriaLabel: "n8n workflows",
    noWebhookLabel: "no Webhook trigger yet",
    emptyTitle: "No workflows yet",
    emptyDescription: "Build a workflow in n8n and give it a Webhook trigger — it shows up here once it exists.",
    executionsTitle: "Recent executions",
    statusOptions: { success: "Success", error: "Error", running: "Running" },
    editorPlaceholderTitle: "Embedded n8n editor",
    editorPlaceholderDescription: "The full n8n editor sits here in the real app — build and wire workflows without leaving the console.",
}

const EVENTS_LABELS: OpsEventTableLabels = {
    title: "Platform events",
    description: "The five events the platform fires — point a workflow at the one you want to automate.",
    eventColumn: "Event",
    whenColumn: "Fires when",
    webhookColumn: "Webhook path",
    listeningColumn: "Listening",
    listeningLabel: "Listening",
    notListeningLabel: "Not listening",
    tableAriaLabel: "Platform events",
}

const SUMMARY: AiOpsSummaryMetrics = {
    activeWorkflows: { value: "4 / 6", label: "Active workflows", hint: "2 inactive" },
    agentRunsToday: { value: "12", label: "Assistant tasks today", hint: "9 ran a workflow" },
    eventsWired: { value: "3 / 5", label: "Events wired", hint: "2 events have no listener yet" },
}

const EMPTY_SUMMARY: AiOpsSummaryMetrics = {
    activeWorkflows: { value: "0 / 0", label: "Active workflows", hint: "no workflows built yet" },
    agentRunsToday: { value: "0", label: "Assistant tasks today", hint: "no tasks given yet" },
    eventsWired: { value: "0 / 5", label: "Events wired", hint: "no listeners wired yet" },
}

const SUGGESTIONS: Array<string> = [
    "Welcome the learners who just signed up",
    "Summarise this week's course sales",
    "Draft a reminder for learners who stalled",
]

const TOOLS: Array<AgentToolView> = [
    { id: "wf-1", name: "Welcome new learners", webhookPath: "welcome-learner" },
    { id: "wf-2", name: "Weekly sales digest", webhookPath: "weekly-sales-digest" },
]

const RUNS: Array<AgentRunView> = [
    {
        id: "run-1",
        goal: "Welcome the learners who just signed up",
        toolUsed: "welcome-new-learners",
        toolOutput: "{\"sent\": 12, \"channel\": \"email\", \"template\": \"welcome-v2\"}",
        result: "Ran the welcome workflow: 12 new learners were emailed the welcome-v2 template.",
        error: null,
    },
    {
        id: "run-2",
        goal: "How should I price a four-week cohort?",
        toolUsed: null,
        result: "No workflow fits this, so here is a direct suggestion: anchor the cohort near your 1:1 monthly rate.",
        error: null,
    },
]

const WORKFLOWS: Array<WorkflowRowView> = [
    { id: "wf-1", name: "Welcome new learners", webhookPath: "welcome-learner", active: true },
    { id: "wf-2", name: "Weekly sales digest", webhookPath: "weekly-sales-digest", active: true },
    { id: "wf-3", name: "Cohort reminder", webhookPath: null, active: false },
]

const EXECUTIONS: Array<ExecutionRowView> = [
    { id: "exec-1", workflowName: "Welcome new learners", status: "success", startedAtLabel: "2 minutes ago" },
    { id: "exec-2", workflowName: "Weekly sales digest", status: "running", startedAtLabel: "just now" },
]

const EVENTS: Array<OpsEventRowView> = [
    { event: "member.registered", whenLabel: "A new member signs up", webhookPath: "nivo-member-registered", isListening: true },
    { event: "order.paid", whenLabel: "An order is paid", webhookPath: "nivo-order-paid", isListening: true },
    { event: "lesson.completed", whenLabel: "A learner completes a lesson", webhookPath: "nivo-lesson-completed", isListening: true },
    { event: "quiz.passed", whenLabel: "A learner passes a quiz", webhookPath: "nivo-quiz-passed", isListening: false },
    { event: "certificate.issued", whenLabel: "A certificate is issued", webhookPath: "nivo-certificate-issued", isListening: false },
]

/** All five events wired to nothing yet — a brand-new account's reference table. */
const EMPTY_EVENTS: Array<OpsEventRowView> = EVENTS.map((row) => ({ ...row, isListening: false }))

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    Typography: { tier: "atom", role: "the page heading and supporting line" },
    Tabs: { tier: "atom", role: "switches between the assistant, workflows, and events blocks" },
    AiOpsSummary: {
        tier: "block",
        role: "the three headline tiles — active workflows, tasks run today, events wired",
        storyId: "nivoexpert-blocks-automation-aiopssummary-aiopssummary--default",
    },
    AgentTaskConsole: {
        tier: "block",
        role: "the assistant tab — give the agent a task, see what it ran",
        storyId: "nivoexpert-blocks-automation-agenttaskconsole-agenttaskconsole--default",
    },
    N8nWorkflowTable: {
        tier: "block",
        role: "the workflows tab — manage workflows and see recent executions",
        storyId: "nivoexpert-blocks-automation-n8nworkflowtable-n8nworkflowtable--default",
    },
    OpsEventTable: {
        tier: "block",
        role: "the events tab — which platform events have a workflow listening",
        storyId: "nivoexpert-blocks-automation-opseventtable-opseventtable--default",
    },
}

/** STATE — the page's own first fetch is in flight; every region shimmers. */
export const Loading: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AiManagementDashboard"
                tier="screen"
                leaf="Loading"
                annotate={ANNOTATE}
                reason="A page's story is one complete state per render. While the first fetch is in flight, the heading, the summary tiles, the tab strip, and the active tab's block (the assistant, here) all draw their skeleton mirror — the SAME shape as the loaded page, threaded through `isSkeleton`, so nothing jumps once data lands."
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "Nothing has resolved yet: the heading text, the three summary tiles, the tab strip, and the assistant console all shimmer together.",
                        code: "<AiManagementDashboard activeTab=\"assistant\" isSkeleton … />",
                        render: (
                            <AiManagementDashboard
                                activeTab="assistant"
                                onTabChange={NOOP}
                                summary={SUMMARY}
                                goal=""
                                onGoalChange={NOOP}
                                onSubmit={NOOP}
                                suggestions={SUGGESTIONS}
                                onSuggestion={NOOP}
                                runs={[]}
                                tools={[]}
                                onReloadTools={NOOP}
                                workflows={[]}
                                executions={[]}
                                onToggleWorkflow={NOOP}
                                onReloadWorkflows={NOOP}
                                events={EVENTS}
                                isSkeleton
                                labels={LABELS}
                                assistantLabels={ASSISTANT_LABELS}
                                workflowsLabels={WORKFLOWS_LABELS}
                                eventsLabels={EVENTS_LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** STATE — the resolved console, Workflows tab active: the table, recent executions, and the editor placeholder. */
export const Content: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AiManagementDashboard"
                tier="screen"
                leaf="Content"
                annotate={ANNOTATE}
                reason="The page composes `N8nWorkflowTable` for the Workflows tab (active here), `AgentTaskConsole` for Assistant, and `OpsEventTable` for Events — only the selected tab's block is mounted, since the tabs are a client-side view switch over data the page already has in hand. The summary tiles above stay constant across tabs."
                states={[
                    {
                        name: "activeTab = \"workflows\"",
                        why: "Two active workflows and one inactive, two recent executions (one still running), and the embedded-editor placeholder below — the full Workflows tab.",
                        code: "<AiManagementDashboard activeTab=\"workflows\" workflows={workflows} executions={executions} … />",
                        render: (
                            <AiManagementDashboard
                                activeTab="workflows"
                                onTabChange={NOOP}
                                summary={SUMMARY}
                                goal=""
                                onGoalChange={NOOP}
                                onSubmit={NOOP}
                                suggestions={SUGGESTIONS}
                                onSuggestion={NOOP}
                                runs={RUNS}
                                tools={TOOLS}
                                onReloadTools={NOOP}
                                workflows={WORKFLOWS}
                                executions={EXECUTIONS}
                                onToggleWorkflow={NOOP}
                                onReloadWorkflows={NOOP}
                                events={EVENTS}
                                labels={LABELS}
                                assistantLabels={ASSISTANT_LABELS}
                                workflowsLabels={WORKFLOWS_LABELS}
                                eventsLabels={EVENTS_LABELS}
                            />
                        ),
                    },
                    {
                        name: "activeTab = \"assistant\"",
                        why: "The same resolved page, Assistant tab selected: two completed tasks (one ran a workflow, one answered directly) beside the two workflows the agent can use.",
                        code: "<AiManagementDashboard activeTab=\"assistant\" runs={runs} tools={tools} … />",
                        render: (
                            <AiManagementDashboard
                                activeTab="assistant"
                                onTabChange={NOOP}
                                summary={SUMMARY}
                                goal=""
                                onGoalChange={NOOP}
                                onSubmit={NOOP}
                                suggestions={SUGGESTIONS}
                                onSuggestion={NOOP}
                                runs={RUNS}
                                tools={TOOLS}
                                onReloadTools={NOOP}
                                workflows={WORKFLOWS}
                                executions={EXECUTIONS}
                                onToggleWorkflow={NOOP}
                                onReloadWorkflows={NOOP}
                                events={EVENTS}
                                labels={LABELS}
                                assistantLabels={ASSISTANT_LABELS}
                                workflowsLabels={WORKFLOWS_LABELS}
                                eventsLabels={EVENTS_LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** STATE — a brand-new account: no workflows built, no tasks run, nothing wired. */
export const Empty: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AiManagementDashboard"
                tier="screen"
                leaf="Empty"
                annotate={ANNOTATE}
                reason="A freshly-onboarded expert: the summary tiles read zero across the board, the assistant has no workflows to call (its own `no-tools` state), the workflow table shows its own empty state under the Add-a-workflow guidance, and the events reference table — always five rows — shows none of them wired to a listener yet. Events tab is shown here because it is the clearest single picture of 'nothing configured': the fixed five events with every listener off."
                states={[
                    {
                        name: "everything empty",
                        why: "Zero active workflows, zero assistant tasks, zero events wired — the events table still renders its fixed five rows, each reading 'Not listening', inviting the expert to point a workflow at one.",
                        code: "<AiManagementDashboard activeTab=\"events\" summary={emptySummary} workflows={[]} tools={[]} runs={[]} events={emptyEvents} … />",
                        render: (
                            <AiManagementDashboard
                                activeTab="events"
                                onTabChange={NOOP}
                                summary={EMPTY_SUMMARY}
                                goal=""
                                onGoalChange={NOOP}
                                onSubmit={NOOP}
                                suggestions={SUGGESTIONS}
                                onSuggestion={NOOP}
                                runs={[]}
                                tools={[]}
                                onReloadTools={NOOP}
                                workflows={[]}
                                executions={[]}
                                onToggleWorkflow={NOOP}
                                onReloadWorkflows={NOOP}
                                events={EMPTY_EVENTS}
                                labels={LABELS}
                                assistantLabels={ASSISTANT_LABELS}
                                workflowsLabels={WORKFLOWS_LABELS}
                                eventsLabels={EVENTS_LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
