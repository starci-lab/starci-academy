import React, { useState } from "react"
import { PlaygroundRagWorkspace } from "@/components/features/learn/Playground/PlaygroundRagWorkspace"

/** A scored source chunk, mirroring the socket `rag:citations` shape. */
interface MockSource {
    filePath: string
    snippet: string
    score?: number
}

/** Props for {@link SimulatedRagWorkspace}. */
interface SimulatedRagWorkspaceProps {
    /** The answer text the fake agent streams back for every ask. */
    answerText: string
    /** The scored citations the fake agent returns for every ask (drives the Sơ đồ graph). */
    sources: Array<MockSource>
}

/**
 * A self-contained harness that STANDS IN for the Playground BYOM socket so the
 * otherwise socket-driven {@link PlaygroundRagWorkspace} can be exercised in
 * Storybook. It captures the `runId` the workspace generates on each ask and
 * feeds back a matching `ragAnswer` + `ragCitations` (with scores), reproducing
 * the agent's streamed answer + citations without a real socket. Import a code
 * snippet, ask a question, then toggle the Nguồn "Sơ đồ" mode to see the graph.
 *
 * @param props - See {@link SimulatedRagWorkspaceProps}.
 */
export const SimulatedRagWorkspace = ({ answerText, sources }: SimulatedRagWorkspaceProps) => {
    const [ragAnswer, setRagAnswer] = useState<{ runId: string; text: string; done: boolean } | null>(null)
    const [ragCitations, setRagCitations] = useState<{ runId: string; sources: Array<MockSource> } | null>(null)

    // no-op: the workspace flips its own `imported` flag on import; the fake
    // agent has nothing to index.
    const sendRagIndex = () => {}

    // simulate the agent: stream a half answer, then the full answer + citations.
    const sendRagAsk = (runId: string, _question: string) => {
        void _question
        setRagAnswer({ runId, text: answerText.slice(0, Math.ceil(answerText.length / 2)), done: false })
        setTimeout(() => {
            setRagAnswer({ runId, text: answerText, done: true })
            setRagCitations({ runId, sources })
        }, 500)
    }

    return (
        <div className="h-[70vh] w-full overflow-hidden rounded-large border border-default bg-surface">
            <PlaygroundRagWorkspace
                ragAnswer={ragAnswer}
                ragCitations={ragCitations}
                sendRagIndex={sendRagIndex}
                sendRagAsk={sendRagAsk}
            />
        </div>
    )
}

/** A realistic streamed answer for the default story. */
export const MOCK_ANSWER =
    "Hàng đợi retry dùng exponential backoff: mỗi lần thử, độ trễ nhân đôi từ `baseDelayMs` "
    + "nhưng chặn trần ở `maxDelayMs` (`Math.min(baseDelayMs * 2 ** attempt, maxDelayMs)`). "
    + "Khi `attempts` vượt `maxAttempts`, job bị đẩy sang dead-letter thay vì thử lại vô hạn."

/** Scored citations for the default story — three sources so the Sơ đồ graph fans out. */
export const MOCK_SOURCES: Array<MockSource> = [
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
]
