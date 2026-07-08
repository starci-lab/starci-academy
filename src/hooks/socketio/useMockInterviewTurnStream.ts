import { useCallback, useEffect, useRef } from "react"
import { useLocale } from "next-intl"
import type {
    AbortMockInterviewTurnSocketIoPayload,
    AskMockInterviewTurnSocketIoPayload,
    MockInterviewChunkSocketIoMessage,
    MockInterviewHistoryTurn,
} from "./types"
import { PublicationEvent, SubscriptionEvent } from "./enums"
import { mockInterviewSocket } from "./sockets"

/** Args for one streamed mock-interviewer turn. */
export interface AskMockInterviewTurnStreamParams {
    /**
     * Id of the persisted `mock_interview_sessions` row this ask belongs to —
     * "session time limit" (2026-07-08): lets the server enforce the 1-hour
     * ask-loop deadline against THIS session's own `createdAt` before
     * spending an AI call.
     */
    sessionId: string
    /** Course the interview is grounded in (RAG scope + on-rails course content). */
    courseId: string
    /** Id of the interview prompt this session is running. */
    promptId: string
    /** Human-readable title of what the candidate is working through this session. */
    promptTitle: string
    /** Current canonical phase (a `MockInterviewPhase` value) to probe next. */
    phase: string
    /** Full transcript so far (oldest first); pass empty on the opening turn. */
    history: Array<MockInterviewHistoryTurn>
    /** The candidate's most recent answer; pass empty string on the opening turn. */
    latestAnswer: string
    /** Pinned model name (absent → balancer picks from the chain). */
    model?: string | null
    /** Provider of the pinned model. */
    provider?: string | null
    /** Seniority level driving rubric strictness for this turn's follow-up, or omitted for "any level". */
    level?: string
    /** Top-level flow this session runs ("qna" | "design"); absent is treated as `"qna"`. */
    mode?: string | null
    /** THIS question's cognitive frame ("theory" | "reasoning" | "scenario"), randomly assigned per-question at draw time; meaningful only when `mode` is "qna". */
    kind?: string | null
    /** Current question's seed text (Q&A kinds) — resend unchanged for the opening ask and every follow-up on that question. */
    currentSeed?: string | null
    /** 0-based index of the question this turn belongs to (Q&A kinds). */
    questionIndex?: number | null
    /** Called for every incremental token delta as the turn streams. */
    onDelta: (delta: string) => void
    /** Called once when the stream finishes (with `error` set when it failed). */
    onDone: (error?: string) => void
}

/** What {@link useMockInterviewTurnStream} returns to the interview component. */
export interface MockInterviewTurnStreamControls {
    /** Emit a turn request and stream its answer back through the supplied callbacks. */
    ask: (params: AskMockInterviewTurnStreamParams) => void
    /** Abort the current in-flight turn stream (no-op when nothing is streaming). */
    abort: () => void
}

/**
 * Consumer hook for mock-interviewer turn streaming over the singleton
 * `/mock_interview` socket (connection owned by
 * {@link import("./useMockInterviewSocketIoLifecycle").useMockInterviewSocketIoLifecycle}).
 *
 * `ask` emits the turn request and registers the active stream; the chunk
 * listener routes deltas for the matching `streamId` to the caller's
 * `onDelta` and fires `onDone` on the terminal chunk. Only one stream is
 * tracked at a time.
 *
 * @returns `ask` / `abort` emitters bound to the active stream.
 */
export const useMockInterviewTurnStream = (): MockInterviewTurnStreamControls => {
    const locale = useLocale()

    /** The active stream's id + callbacks, or `null` when nothing is streaming. */
    const activeRef = useRef<{
        streamId: string
        onDelta: (delta: string) => void
        onDone: (error?: string) => void
            } | null>(null)

    // route incoming chunks to the active stream's callbacks (one listener for
    // the socket's lifetime; matches by streamId so stale chunks are ignored)
    useEffect(() => {
        const onChunk = (message: MockInterviewChunkSocketIoMessage) => {
            const data = message.data
            const active = activeRef.current
            if (!data || !active || data.streamId !== active.streamId) {
                return
            }
            if (data.delta) {
                active.onDelta(data.delta)
            }
            if (data.done) {
                active.onDone(data.error)
                activeRef.current = null
            }
        }
        mockInterviewSocket.on(SubscriptionEvent.MockInterviewChunk, onChunk)
        return () => {
            mockInterviewSocket.off(SubscriptionEvent.MockInterviewChunk, onChunk)
        }
    }, [])

    const ask = useCallback(
        (params: AskMockInterviewTurnStreamParams) => {
            const streamId = crypto.randomUUID()
            activeRef.current = {
                streamId,
                onDelta: params.onDelta,
                onDone: params.onDone,
            }
            const payload: AskMockInterviewTurnSocketIoPayload = {
                data: {
                    streamId,
                    sessionId: params.sessionId,
                    courseId: params.courseId,
                    promptId: params.promptId,
                    promptTitle: params.promptTitle,
                    phase: params.phase,
                    history: params.history,
                    latestAnswer: params.latestAnswer,
                    model: params.model,
                    provider: params.provider,
                    level: params.level,
                    mode: params.mode,
                    kind: params.kind,
                    currentSeed: params.currentSeed,
                    questionIndex: params.questionIndex,
                },
                locale,
            }
            mockInterviewSocket.emit(PublicationEvent.AskMockInterviewTurn, payload)
        },
        [locale],
    )

    const abort = useCallback(() => {
        const active = activeRef.current
        if (!active) {
            return
        }
        const payload: AbortMockInterviewTurnSocketIoPayload = {
            data: { streamId: active.streamId },
            locale,
        }
        mockInterviewSocket.emit(PublicationEvent.AbortMockInterviewTurn, payload)
        activeRef.current = null
    }, [locale])

    return {
        ask,
        abort,
    }
}
