import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { PlaygroundRagWorkspace } from "@/components/features/learn/Playground/PlaygroundRagWorkspace"
import { MOCK_ANSWER, MOCK_SOURCES, SimulatedRagWorkspace } from "./components"

/**
 * `PlaygroundRagWorkspace` — the machine-backed RAG workspace that becomes the
 * RIGHT pane of a `kind: "rag"` PlaygroundRagSession, and the app's ONLY RAG
 * surface. A chat UX — import (paste / upload / built-in sample / GitHub repo) →
 * ask → streamed answer bubbles → citations with a per-turn "Tài liệu / Sơ đồ"
 * source toggle — that runs over the Playground BYOM socket (the learner's own
 * local Ollama, relayed by the paired agent). The agent resolves sample and
 * github sources to code before embedding.
 *
 * It's socket-driven: the parent owns the `usePlaygroundByomSocketIo` hook and
 * passes the streamed `ragAnswer` / `ragCitations` down plus the `sendRagIndex`
 * / `sendRagAsk` emitters. The `Simulated` story stands in for that socket so
 * the flow can be exercised here.
 */
const meta = {
    title: "Features/Learn/Playground/PlaygroundRagWorkspace",
    component: PlaygroundRagWorkspace,
} satisfies Meta<typeof PlaygroundRagWorkspace>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Interactive: a fake socket streams back an answer + scored citations for
 * whatever you ask. Paste a snippet → Nạp → ask a question → the answer streams
 * in and its 3 scored citations appear; toggle the Nguồn "Sơ đồ" mode to see
 * the question→sources graph.
 */
export const Simulated: Story = {
    tags: ["news"],
    // required props are satisfied by the SimulatedRagWorkspace harness in `render`;
    // these args exist only to satisfy the story's arg type (render ignores them).
    args: {
        ragAnswer: null,
        ragCitations: null,
        sendRagIndex: () => {},
        sendRagAsk: () => {},
    },
    parameters: {
        usage: "Chờ duyệt — the machine-backed RAG workspace (right pane of a kind=rag PlaygroundSession): import inline code → ask → the learner's local Ollama answers (streamed over the BYOM socket) with citations. This story simulates the socket: ask any question to get a streamed answer + 3 scored citations, then toggle \"Sơ đồ\" for the graph.",
    },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Machine-backed RAG workspace</Label>
                <Typography type="body-sm" color="muted">
                    Paste a snippet, press Nạp, then ask a question — the fake agent streams an answer and 3 scored citations. Switch the Nguồn toggle to Sơ đồ to see the graph.
                </Typography>
            </div>
            <SimulatedRagWorkspace answerText={MOCK_ANSWER} sources={MOCK_SOURCES} />
        </div>
    ),
}

/**
 * The initial import gate before any code is indexed — the empty state prompting
 * the learner to import code (runs on their own Ollama). No socket activity.
 */
export const EmptyNoImport: Story = {
    tags: ["news"],
    args: {
        ragAnswer: null,
        ragCitations: null,
        sendRagIndex: () => {},
        sendRagAsk: () => {},
    },
    parameters: {
        usage: "Chờ duyệt — the initial state before any code is indexed: the import strip plus the \"nạp code để bắt đầu\" empty state and a disabled composer.",
    },
    render: (args) => (
        <div className="h-[70vh] w-full overflow-hidden rounded-large border border-default bg-surface">
            <PlaygroundRagWorkspace {...args} />
        </div>
    ),
}
