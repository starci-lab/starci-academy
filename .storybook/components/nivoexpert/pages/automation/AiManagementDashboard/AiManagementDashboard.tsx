import { BroadcastIcon, FlowArrowIcon, SparkleIcon } from "@phosphor-icons/react"
import { Tabs, type TabItem } from "@sb-components/atoms/navigation/Tabs/Tabs"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV } from "@sb-components/frames/Stack/Stack"
import {
    AgentTaskConsole,
    type AgentRunView,
    type AgentTaskConsoleLabels,
    type AgentToolView,
} from "@sb-components/nivoexpert/blocks/automation/AgentTaskConsole/AgentTaskConsole"
import {
    AiOpsSummary,
    type AiOpsSummaryMetrics,
} from "@sb-components/nivoexpert/blocks/automation/AiOpsSummary/AiOpsSummary"
import {
    N8nWorkflowTable,
    type ExecutionRowView,
    type N8nWorkflowTableLabels,
    type WorkflowRowView,
} from "@sb-components/nivoexpert/blocks/automation/N8nWorkflowTable/N8nWorkflowTable"
import {
    OpsEventTable,
    type OpsEventRowView,
    type OpsEventTableLabels,
} from "@sb-components/nivoexpert/blocks/automation/OpsEventTable/OpsEventTable"

/**
 * `AiManagementDashboard` -- the AI-management PAGE: summary tiles atop a tab strip
 * switching between the operations assistant, the n8n workflows it can call, and
 * the platform events those workflows can listen for. A page's story is one
 * complete STATE per story -- `loading`, `content`, `empty` -- not a leaf-per-prop
 * map. Grounded in the real ops module: `ClawbotService`, `N8nToolsService`, and
 * `N8nDispatcherService`'s five `OpsEvent`s.
 */

/** Which automation tab is showing. */
export type AutomationTabKey = "assistant" | "workflows" | "events"

/** Props for {@link AiManagementDashboard}. */
export interface AiManagementDashboardProps {
    /** The tab currently showing. */
    activeTab: AutomationTabKey
    /** Fires with the newly selected tab. */
    onTabChange: (key: AutomationTabKey) => void
    /** The header summary tiles -- forwarded to {@link AiOpsSummary}. */
    summary: AiOpsSummaryMetrics

    /** The goal the expert is typing -- forwarded to {@link AgentTaskConsole}. */
    goal: string
    /** Fires as the goal changes. */
    onGoalChange: (value: string) => void
    /** Give the current goal to the agent. */
    onSubmit: () => void
    /** `true` -> a task is in flight. */
    isRunning?: boolean
    /** Suggested tasks offered as one-tap chips. */
    suggestions: Array<string>
    /** Fires with a suggestion's text when its chip is tapped. */
    onSuggestion: (goal: string) => void
    /** The assistant's completed tasks, newest first. */
    runs: Array<AgentRunView>
    /** The workflows the agent can currently use. */
    tools: Array<AgentToolView>
    /** Re-read the workflow list the assistant can call. */
    onReloadTools: () => void

    /** The expert's n8n workflows -- forwarded to {@link N8nWorkflowTable}. */
    workflows: Array<WorkflowRowView>
    /** Recent workflow runs, newest first. */
    executions: Array<ExecutionRowView>
    /** Turn a workflow on/off. */
    onToggleWorkflow: (id: string, active: boolean) => void
    /** Id of the workflow whose toggle is in flight, or null. */
    togglingId?: string | null
    /** Re-read the workflow list and recent runs from n8n. */
    onReloadWorkflows: () => void

    /** The five platform events -- forwarded to {@link OpsEventTable}. */
    events: Array<OpsEventRowView>

    /**
     * `true` -> the page's own first fetch is in flight: the summary tiles, the tab
     * strip, and the active tab's block all draw their skeleton mirror (§12b),
     * threaded straight down -- never a separate skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy for the page's own chrome. */
    labels: AiManagementDashboardLabels
    /** Already-localized copy forwarded to the embedded {@link AgentTaskConsole}. */
    assistantLabels: AgentTaskConsoleLabels
    /** Already-localized copy forwarded to the embedded {@link N8nWorkflowTable}. */
    workflowsLabels: N8nWorkflowTableLabels
    /** Already-localized copy forwarded to the embedded {@link OpsEventTable}. */
    eventsLabels: OpsEventTableLabels
}

/** The already-resolved copy the page renders for its own chrome. */
export interface AiManagementDashboardLabels {
    /** Page heading (e.g. "AI management"). */
    title: string
    /** Supporting line under the heading. */
    description: string
    /** Accessible name for the tab strip. */
    tabsAriaLabel: string
    /** Tab label for the operations-assistant tab. */
    assistantTabLabel: string
    /** Tab label for the n8n-workflows tab. */
    workflowsTabLabel: string
    /** Tab label for the platform-events tab. */
    eventsTabLabel: string
}

/**
 * The AI-management console page. See the file header for why the tab strip
 * composes the three automation blocks rather than rebuilding their shapes, and
 * why its story is one complete state per render.
 *
 * @param props - {@link AiManagementDashboardProps}
 */
const AiManagementDashboard = ({
    activeTab,
    onTabChange,
    summary,
    goal,
    onGoalChange,
    onSubmit,
    isRunning,
    suggestions,
    onSuggestion,
    runs,
    tools,
    onReloadTools,
    workflows,
    executions,
    onToggleWorkflow,
    togglingId,
    onReloadWorkflows,
    events,
    isSkeleton = false,
    labels,
    assistantLabels,
    workflowsLabels,
    eventsLabels,
}: AiManagementDashboardProps) => {
    const tabItems: Array<TabItem> = [
        { key: "assistant", label: labels.assistantTabLabel, icon: SparkleIcon },
        { key: "workflows", label: labels.workflowsTabLabel, icon: FlowArrowIcon },
        { key: "events", label: labels.eventsTabLabel, icon: BroadcastIcon },
    ]

    /** The tab currently selected -- only ITS block is mounted below the strip. */
    const ActivePanel = () => {
        if (activeTab === "assistant") {
            return (
                <AgentTaskConsole
                    goal={goal}
                    onGoalChange={onGoalChange}
                    onSubmit={onSubmit}
                    isRunning={isRunning}
                    suggestions={suggestions}
                    onSuggestion={onSuggestion}
                    runs={runs}
                    tools={tools}
                    onReloadTools={onReloadTools}
                    isSkeleton={isSkeleton}
                    labels={assistantLabels}
                />
            )
        }
        if (activeTab === "workflows") {
            return (
                <N8nWorkflowTable
                    workflows={workflows}
                    executions={executions}
                    onToggleWorkflow={onToggleWorkflow}
                    togglingId={togglingId}
                    onReload={onReloadWorkflows}
                    isSkeleton={isSkeleton}
                    labels={workflowsLabels}
                />
            )
        }
        return <OpsEventTable events={events} labels={eventsLabels} />
    }

    return (
        <div
            data-tier="page"
            data-component="AiManagementDashboard"
            className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8"
        >
            <StackV
                gap={1}
                isSkeleton={isSkeleton}
                items={[
                    () => <Typography size="h3" weight="semibold" isSkeleton={isSkeleton} text={labels.title} />,
                    () => <Typography size="sm" color="muted" isSkeleton={isSkeleton} text={labels.description} />,
                ]}
            />
            <AiOpsSummary metrics={summary} isSkeleton={isSkeleton} />
            <Tabs
                items={tabItems}
                selectedKey={activeTab}
                onSelectionChange={(key) => onTabChange(key as AutomationTabKey)}
                ariaLabel={labels.tabsAriaLabel}
                isSkeleton={isSkeleton}
            />
            <ActivePanel />
        </div>
    )
}

export { AiManagementDashboard }

/** Source-level tier marker -- lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "page", name: "AiManagementDashboard" } as const
