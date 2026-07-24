import type { Meta, StoryObj } from "@storybook/nextjs"
import { RagSourceGraph } from "./RagSourceGraph"

const meta: Meta<typeof RagSourceGraph> = {
    title: "Design/Rendering/RagSourceGraph",
    component: RagSourceGraph,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof RagSourceGraph>

/** Multiple retrieved sources WITH scores — the question fans out to a card per source, edge label = score. */
export const MultipleSourcesScored: Story = {
    render: () => (
        <div className="p-8">
            <RagSourceGraph
                question="How does the retry queue back off between attempts?"
                sources={[
                    {
                        filePath: "src/queue/retry-policy.ts",
                        snippet: "const delayMs = Math.min(baseDelayMs * 2 ** attempt, maxDelayMs)",
                        score: 0.91,
                    },
                    {
                        filePath: "src/queue/worker.ts",
                        snippet: "if (job.attempts >= policy.maxAttempts) return moveToDeadLetter(job)",
                        score: 0.78,
                    },
                    {
                        filePath: "src/queue/config.ts",
                        snippet: "export const DEFAULT_RETRY_POLICY = { baseDelayMs: 200, maxDelayMs: 30_000 }",
                        score: 0.64,
                    },
                ]}
            />
        </div>
    ),
}

/** A single source WITHOUT a score — still lays out; the score chip + edge label are simply hidden. */
export const SingleSourceNoScore: Story = {
    render: () => (
        <div className="p-8">
            <RagSourceGraph
                question="What does this function return on an empty input?"
                sources={[
                    {
                        filePath: "src/utils/parse.ts",
                        snippet: "export function parseList(input: string): Array<string> {",
                    },
                ]}
            />
        </div>
    ),
}

/** Long file path + long snippet preview — both node lines are `truncate`, so overflow clips with an ellipsis instead of wrapping/breaking the fixed 220px node width. */
export const LongPathTruncated: Story = {
    render: () => (
        <div className="p-8">
            <RagSourceGraph
                question="Where is the exponential backoff for failed webhook deliveries configured?"
                sources={[
                    {
                        filePath: "src/modules/notifications/webhooks/delivery/retry-policy-config.ts",
                        snippet: "export const WEBHOOK_DELIVERY_RETRY_POLICY_DEFAULT_CONFIGURATION = { baseDelayMs: 500 }",
                        score: 0.87,
                    },
                ]}
            />
        </div>
    ),
}
