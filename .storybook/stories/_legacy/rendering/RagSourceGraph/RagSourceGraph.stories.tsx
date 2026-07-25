import type { Meta, StoryObj } from "@storybook/nextjs"
import { RagSourceGraph } from "@sb-components/_legacy/designs/rendering/RagSourceGraph/RagSourceGraph"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof RagSourceGraph> = {
    title: "Legacy/Design/Rendering/RagSourceGraph",
    component: RagSourceGraph,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof RagSourceGraph>

// leaf live (MultipleSourcesScored/SingleSourceNoScore/LongPathTruncated): 1 QuestionCard
// trái + N×SourceCard phải — nội dung nhãn/score bên trong SourceCard KHÔNG badge riêng
// (§11a: chỉ badge con trực tiếp, không drill vào Typography/StatusChip nội bộ node).
const PARTS: Array<AnatomyNode> = [
    { name: "QuestionCard", tier: "design", role: "node câu hỏi bên trái (accent, line-clamp-2)" },
    { name: "SourceCard", tier: "design", role: "node nguồn bên phải, mỗi source 1 card (filePath·snippet·score)" },
]

/** Multiple retrieved sources WITH scores — the question fans out to a card per source, edge label = score. */
export const MultipleSourcesScored: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy name="RagSourceGraph" tier="design" leaf="MultipleSourcesScored" parts={PARTS}>
                <RagSourceGraph
                    question="How does the retry queue back off between attempts?"
                    showAnatomy
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
            </BlockAnatomy>
        </div>
    ),
}

/** A single source WITHOUT a score — still lays out; the score chip + edge label are simply hidden. */
export const SingleSourceNoScore: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy name="RagSourceGraph" tier="design" leaf="SingleSourceNoScore" parts={PARTS} note="Không score → SourceCard vẫn là 1 node, chỉ ẩn StatusChip nội bộ (không đổi cây anatomy).">
                <RagSourceGraph
                    question="What does this function return on an empty input?"
                    showAnatomy
                    sources={[
                        {
                            filePath: "src/utils/parse.ts",
                            snippet: "export function parseList(input: string): Array<string> {",
                        },
                    ]}
                />
            </BlockAnatomy>
        </div>
    ),
}

/** Long file path + long snippet preview — both node lines are `truncate`, so overflow clips with an ellipsis instead of wrapping/breaking the fixed 220px node width. */
export const LongPathTruncated: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy name="RagSourceGraph" tier="design" leaf="LongPathTruncated" parts={PARTS} note="filePath/snippet dài — truncate bên trong SourceCard, cùng composition với các leaf khác.">
                <RagSourceGraph
                    question="Where is the exponential backoff for failed webhook deliveries configured?"
                    showAnatomy
                    sources={[
                        {
                            filePath: "src/modules/notifications/webhooks/delivery/retry-policy-config.ts",
                            snippet: "export const WEBHOOK_DELIVERY_RETRY_POLICY_DEFAULT_CONFIGURATION = { baseDelayMs: 500 }",
                            score: 0.87,
                        },
                    ]}
                />
            </BlockAnatomy>
        </div>
    ),
}
