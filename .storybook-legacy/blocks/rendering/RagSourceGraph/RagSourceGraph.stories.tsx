import type { Meta, StoryObj } from "@storybook/nextjs"
import { RagSourceGraph } from "@/components/blocks/rendering/RagSourceGraph"
import { Gallery, Variant } from "../../../../story-kit"

/**
 * `RagSourceGraph` — a small `@xyflow/react` graph visualizing which retrieved
 * chunks grounded one RAG Playground answer: a single accent question node on
 * the left, fanning out to a card per source on the right (edge label = the
 * retrieval score, when the backend reports one).
 */
const meta: Meta<typeof RagSourceGraph> = {
    title: "Legacy/Blocks/Rendering/RagSourceGraph",
    component: RagSourceGraph,
}

export default meta

type Story = StoryObj<typeof RagSourceGraph>

/**
 * Toàn bộ trạng thái của RagSourceGraph: nhiều nguồn kèm điểm truy hồi, và một
 * nguồn duy nhất không có điểm. Dùng để tra khi nào chip điểm và nhãn cạnh bị ẩn.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Nhiều nguồn, có điểm truy hồi"
                hint="Dùng làm chế độ Sơ đồ (graph) của phần nguồn trong câu trả lời RAG, song song danh sách trích dẫn thường, để người xem thấy ngay câu hỏi kéo từ những đoạn nào và khớp mạnh tới đâu — một nút câu hỏi màu nhấn bên trái, toè ra một thẻ cho mỗi nguồn được truy hồi bên phải, nhãn cạnh hiện điểm truy hồi."
            >
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
            </Variant>
            <Variant
                label="Một nguồn duy nhất, không điểm"
                hint="Một nguồn duy nhất không mang điểm truy hồi (phản hồi backend cũ, hoặc nguồn mà bộ truy hồi không xếp hạng được) vẫn lên layout bình thường — chip điểm và nhãn cạnh chỉ đơn giản bị ẩn."
            >
                <RagSourceGraph
                    question="What does this function return on an empty input?"
                    sources={[
                        {
                            filePath: "src/utils/parse.ts",
                            snippet: "export function parseList(input: string): Array<string> {",
                        },
                    ]}
                />
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ trạng thái của RagSourceGraph: nhiều nguồn kèm điểm truy hồi (chế độ \"Sơ đồ\" của " +
            "phần nguồn trong câu trả lời RAG, song song danh sách trích dẫn thường), và một nguồn duy nhất " +
            "không có điểm (chip điểm và nhãn cạnh bị ẩn). Dùng để tra khi nào chip điểm hiện/ẩn.",
    },
}
