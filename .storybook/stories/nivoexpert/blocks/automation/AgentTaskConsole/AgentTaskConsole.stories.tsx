import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    AgentTaskConsole,
    type AgentTaskConsoleLabels,
    type AgentRunView,
    type AgentToolView,
} from "@sb-components/nivoexpert/blocks/automation/AgentTaskConsole/AgentTaskConsole"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `AgentTaskConsole` — the "operations assistant" tab. The expert gives the agent
 * a task in words; the agent runs ONE of their n8n workflows (or answers directly)
 * and reports back, beside the list of workflows it can use. The five phases —
 * `idle`, `running`, `result-ran-workflow`, `result-direct-answer`, `no-tools` —
 * are DATA, so they are STATES of the single shape. Grounded in the real
 * `ClawbotService.act(goal)` → `AgentRun` and `N8nToolsService.list()` → `N8nTool`.
 */
const meta: Meta<typeof AgentTaskConsole> = {
    title: "NivoExpert/Blocks/Automation/AgentTaskConsole/AgentTaskConsole",
    component: AgentTaskConsole,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof AgentTaskConsole>

const LABELS: AgentTaskConsoleLabels = {
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
    noToolsDescription: "Open the n8n workflows tab to build one — the assistant will pick it up automatically.",
}

const TOOLS: Array<AgentToolView> = [
    { id: "wf-1", name: "Welcome new learners", webhookPath: "welcome-learner" },
    { id: "wf-2", name: "Weekly sales digest", webhookPath: "weekly-sales-digest" },
]

const SUGGESTIONS: Array<string> = [
    "Welcome the learners who just signed up",
    "Summarise this week's course sales",
    "Draft a reminder for learners who stalled",
]

const RUN_RAN_WORKFLOW: AgentRunView = {
    id: "run-1",
    goal: "Welcome the learners who just signed up",
    toolUsed: "welcome-new-learners",
    toolOutput: "{\"sent\": 12, \"channel\": \"email\", \"template\": \"welcome-v2\"}",
    result: "Ran the welcome workflow: 12 new learners were emailed the welcome-v2 template.",
    error: null,
}

const RUN_DIRECT_ANSWER: AgentRunView = {
    id: "run-2",
    goal: "How should I price a four-week cohort?",
    toolUsed: null,
    result: "No workflow fits this, so here is a direct suggestion: anchor the cohort near your 1:1 monthly rate, and offer an early-bird tier to seed the first run.",
    error: null,
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the console card, each result card, and the workflows card" },
    ChipButtonList: { tier: "composite", role: "the suggested tasks, one chip each" },
    Disclosure: { tier: "composite", role: "collapses the raw workflow output under a result" },
    EmptyState: { tier: "composite", role: "shown when no workflow is active" },
    InputText: { tier: "atom", role: "the task the expert types — the console's only free input" },
    Button: { tier: "atom", role: "the submit action and the reload-workflows action" },
    Chip: { tier: "atom", role: "the result badge — ran a workflow, answered directly, or errored" },
    Typography: { tier: "atom", role: "the titles, the goals, and each answer line" },
}

/** LEAF — one shape; the five phases are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AgentTaskConsole"
                tier="block"
                leaf="Console"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                reason="Blocks take no `className`: the block owns the run and tool entities, so its phases are states of one shape. `Submit` is offered only once the goal has text — presentation logic the block derives from its own props, never a request. The embedded n8n editor is app wiring, so it never appears here."
                states={[
                    {
                        name: "goal empty, no runs",
                        why: "The resting state: an empty goal, no tasks run yet, and the two active workflows listed on the right. Suggested tasks invite a first goal without typing.",
                        code: `<AgentTaskConsole
    goal="" onGoalChange={setGoal}
    onSubmit={run}
    suggestions={suggestions} onSuggestion={run}
    runs={[]}
    tools={tools} onReloadTools={reload}
    labels={labels}
/>`,
                        render: (
                            <AgentTaskConsole
                                goal=""
                                onGoalChange={() => {}}
                                onSubmit={() => {}}
                                suggestions={SUGGESTIONS}
                                onSuggestion={() => {}}
                                runs={[]}
                                tools={TOOLS}
                                onReloadTools={() => {}}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "isRunning = true",
                        why: "A task is in flight. The submit button shows a spinner and the input and suggestions lock, so the expert can't fire a second task over the first.",
                        code: "<AgentTaskConsole {...props} goal={goal} isRunning />",
                        render: (
                            <AgentTaskConsole
                                goal="Welcome the learners who just signed up"
                                onGoalChange={() => {}}
                                onSubmit={() => {}}
                                isRunning
                                suggestions={SUGGESTIONS}
                                onSuggestion={() => {}}
                                runs={[]}
                                tools={TOOLS}
                                onReloadTools={() => {}}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "run.toolUsed set (ran a workflow)",
                        why: "A result whose `toolUsed` names a workflow: the badge reads \"Ran: …\", the answer summarises what happened, and the raw workflow output sits under a collapsible.",
                        code: "<AgentTaskConsole {...props} runs={[runRanWorkflow]} />",
                        render: (
                            <AgentTaskConsole
                                goal=""
                                onGoalChange={() => {}}
                                onSubmit={() => {}}
                                suggestions={SUGGESTIONS}
                                onSuggestion={() => {}}
                                runs={[RUN_RAN_WORKFLOW]}
                                tools={TOOLS}
                                onReloadTools={() => {}}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "run.toolUsed = null (direct answer)",
                        why: "A result the agent answered without a workflow: `toolUsed` is null, so the badge reads \"Answered directly\", the answer stands alone, and there is no raw-output collapsible.",
                        code: "<AgentTaskConsole {...props} runs={[runDirectAnswer]} />",
                        render: (
                            <AgentTaskConsole
                                goal=""
                                onGoalChange={() => {}}
                                onSubmit={() => {}}
                                suggestions={SUGGESTIONS}
                                onSuggestion={() => {}}
                                runs={[RUN_DIRECT_ANSWER]}
                                tools={TOOLS}
                                onReloadTools={() => {}}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "tools = [] (no workflows)",
                        why: "No workflow is active, so the agent can only answer directly. The tools panel shows an empty state pointing the expert to the workflows tab.",
                        code: "<AgentTaskConsole {...props} tools={[]} />",
                        render: (
                            <AgentTaskConsole
                                goal=""
                                onGoalChange={() => {}}
                                onSubmit={() => {}}
                                suggestions={SUGGESTIONS}
                                onSuggestion={() => {}}
                                runs={[]}
                                tools={[]}
                                onReloadTools={() => {}}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The block's own first fetch hasn't resolved yet, so the same two regions draw the console card, a fixed count of result-shaped rows, and a fixed count of tool-shaped rows — all shimmering, the reload action dropped — matching the loaded shape so nothing jumps when the runs and tools land.",
                        code: "<AgentTaskConsole {...props} runs={[]} tools={[]} isSkeleton />",
                        render: (
                            <AgentTaskConsole
                                goal=""
                                onGoalChange={() => {}}
                                onSubmit={() => {}}
                                suggestions={SUGGESTIONS}
                                onSuggestion={() => {}}
                                runs={[]}
                                tools={[]}
                                onReloadTools={() => {}}
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
