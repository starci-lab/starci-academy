import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    AiOpsSummary,
    type AiOpsSummaryMetrics,
} from "@sb-components/nivoexpert/blocks/automation/AiOpsSummary/AiOpsSummary"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `AiOpsSummary` — the three headline tiles atop the AI-management console: active
 * workflows, tasks the assistant ran today, and events with a workflow listening.
 * The only state is `isSkeleton` (§12b) — the shape never otherwise changes.
 * Grounded in the real app's `N8nToolsService.listAll()`, the day's `AgentRun`
 * rows, and `N8nDispatcherService`'s per-event `isListening` join.
 */
const meta: Meta<typeof AiOpsSummary> = {
    title: "NivoExpert/Blocks/Automation/AiOpsSummary/AiOpsSummary",
    component: AiOpsSummary,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof AiOpsSummary>

const METRICS: AiOpsSummaryMetrics = {
    activeWorkflows: { value: "4 / 6", label: "Active workflows", hint: "2 inactive" },
    agentRunsToday: { value: "12", label: "Assistant tasks today", hint: "9 ran a workflow" },
    eventsWired: { value: "3 / 5", label: "Events wired", hint: "2 events have no listener yet" },
}

/** A brand-new account: nothing built, nothing run, nothing wired. */
const EMPTY_METRICS: AiOpsSummaryMetrics = {
    activeWorkflows: { value: "0 / 0", label: "Active workflows", hint: "no workflows built yet" },
    agentRunsToday: { value: "0", label: "Assistant tasks today", hint: "no tasks given yet" },
    eventsWired: { value: "0 / 5", label: "Events wired", hint: "no listeners wired yet" },
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    MetricCard: { tier: "composite", role: "each headline tile — active workflows, tasks run, events wired" },
}

/** LEAF — one shape; `isSkeleton` is the only state. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AiOpsSummary"
                tier="block"
                leaf="Summary tiles"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                reason="Blocks take no `className`: the block owns three counts already resolved by the connected layer (active-workflow ratio, today's assistant tasks, events with a listener). The tiles never change shape, so `isSkeleton` is the whole state set — there is no empty leaf, because a brand-new account still has three tiles, each reading zero."
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The console's own first fetch is in flight: all three tiles draw their skeleton mirror, matching the resolved layout so nothing jumps when the counts land.",
                        code: "<AiOpsSummary metrics={metrics} isSkeleton />",
                        render: <AiOpsSummary metrics={METRICS} isSkeleton />,
                    },
                    {
                        name: "metrics present",
                        why: "The resolved summary: 4 of 6 workflows active, 12 assistant tasks run today (9 of them via a workflow), and 3 of the five platform events currently wired to a listener.",
                        code: "<AiOpsSummary metrics={metrics} />",
                        render: <AiOpsSummary metrics={METRICS} />,
                    },
                    {
                        name: "metrics = all-zero (new account)",
                        why: "A brand-new account: no workflows built, no tasks given, no events wired — the tiles read zero rather than the section disappearing, because there is always something to report.",
                        code: "<AiOpsSummary metrics={emptyMetrics} />",
                        render: <AiOpsSummary metrics={EMPTY_METRICS} />,
                    },
                ]}
            />
        </div>
    ),
}
