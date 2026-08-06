import { Grid } from "@sb-components/frames/Grid/Grid"
import { MetricCard } from "@sb-components/composites/stats/MetricCard/MetricCard"

/**
 * `AiOpsSummary` -- the three headline tiles atop the AI-management console: active
 * workflows, tasks the assistant ran today, and events with a workflow listening.
 * The only state is `isSkeleton` (§12b) -- the shape never otherwise changes.
 * Grounded in the real app's `N8nToolsService.listAll()`, the day's `AgentRun`
 * rows, and `N8nDispatcherService`'s per-event `isListening` join.
 */

/** One headline tile -- already resolved by the connected layer. */
export interface AiOpsMetricView {
    /** The large value (e.g. "4 / 6", "12", "3 / 5"). */
    value: string
    /** What the value measures (e.g. "Active workflows"). */
    label: string
    /** Optional quiet footnote (e.g. "2 inactive"). */
    hint?: string
}

/** The three headline tiles this block renders. */
export interface AiOpsSummaryMetrics {
    /** Active vs total n8n workflows (`N8nToolsService.listAll()`). */
    activeWorkflows: AiOpsMetricView
    /** How many tasks the operations assistant ran today (`AgentRun` rows). */
    agentRunsToday: AiOpsMetricView
    /** How many of the five platform events have a workflow currently listening. */
    eventsWired: AiOpsMetricView
}

/** Props for {@link AiOpsSummary}. */
export interface AiOpsSummaryProps {
    /** The three headline tiles. */
    metrics: AiOpsSummaryMetrics
    /**
     * `true` -> the console's own first fetch is in flight: all three tiles draw
     * their skeleton mirror (§12b), threaded straight down -- never fed to a
     * separate skeleton tree.
     */
    isSkeleton?: boolean
}

/**
 * The AI-operations summary tiles. See the file header for why the only state is
 * `isSkeleton` rather than a set of separate leaves.
 *
 * @param props - {@link AiOpsSummaryProps}
 */
const AiOpsSummary = ({ metrics, isSkeleton = false }: AiOpsSummaryProps) => (
    <div data-tier="block" data-component="AiOpsSummary">
        <Grid
            principle="content-row" columns={{ base: 1, sm: 3 }}
            items={[
                {
                    key: "activeWorkflows",
                    content: () =>
                        isSkeleton ? (
                            <MetricCard isSkeleton />
                        ) : (
                            <MetricCard
                                value={metrics.activeWorkflows.value}
                                label={metrics.activeWorkflows.label}
                                hint={metrics.activeWorkflows.hint}
                            />
                        ),
                },
                {
                    key: "agentRunsToday",
                    content: () =>
                        isSkeleton ? (
                            <MetricCard isSkeleton />
                        ) : (
                            <MetricCard
                                value={metrics.agentRunsToday.value}
                                label={metrics.agentRunsToday.label}
                                hint={metrics.agentRunsToday.hint}
                            />
                        ),
                },
                {
                    key: "eventsWired",
                    content: () =>
                        isSkeleton ? (
                            <MetricCard isSkeleton />
                        ) : (
                            <MetricCard
                                value={metrics.eventsWired.value}
                                label={metrics.eventsWired.label}
                                hint={metrics.eventsWired.hint}
                            />
                        ),
                },
            ]}
        />
    </div>
)

export { AiOpsSummary }

/** Source-level tier marker -- lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "AiOpsSummary" } as const
