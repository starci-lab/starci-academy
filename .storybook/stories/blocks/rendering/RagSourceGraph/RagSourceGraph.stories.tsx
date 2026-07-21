import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { RagSourceGraph } from "@/components/blocks/rendering/RagSourceGraph"

/**
 * `RagSourceGraph` — a small `@xyflow/react` graph visualizing which retrieved
 * chunks grounded one RAG Playground answer: a single accent question node on
 * the left, fanning out to a card per source on the right (edge label = the
 * retrieval score, when the backend reports one).
 */
const meta: Meta<typeof RagSourceGraph> = {
    title: "Blocks/Rendering/RagSourceGraph",
    component: RagSourceGraph,
}

export default meta

type Story = StoryObj<typeof RagSourceGraph>

/** A question grounded by 3 sources, each with a retrieval score. */
export const Default: Story = {
    tags: ["news"],
    args: {
        question: "How does the retry queue back off between attempts?",
        sources: [
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
        ],
    },
    parameters: {
        usage: "Chờ duyệt — use as the \"Sơ đồ\" (graph) mode of a RAG answer's sources section, alongside the plain citation list, so a visitor can see at a glance which chunks a question pulled from and how strongly each matched.",
    },
    render: (args) => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Question → sources graph</Label>
                <Typography type="body-sm" color="muted">
                    One accent question node on the left, fanned out to a card per retrieved source on the right — edge labels show the retrieval score.
                </Typography>
            </div>
            <RagSourceGraph {...args} />
        </div>
    ),
}

/** A question with a single source and no retrieval score reported. */
export const SingleSourceNoScore: Story = {
    tags: ["news"],
    args: {
        question: "What does this function return on an empty input?",
        sources: [
            {
                filePath: "src/utils/parse.ts",
                snippet: "export function parseList(input: string): Array<string> {",
            },
        ],
    },
    parameters: {
        usage: "Chờ duyệt — a single source with no score (older backend responses, or a source the retriever couldn't rank) still lays out fine; the score chip is simply omitted.",
    },
    render: (args) => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Single source, no score</Label>
                <Typography type="body-sm" color="muted">
                    The score chip and edge label are both omitted when a source carries no retrieval score.
                </Typography>
            </div>
            <RagSourceGraph {...args} />
        </div>
    ),
}
