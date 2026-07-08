import type { SocketIoEnvelope } from "./content-discussion"

/** One prior turn of the transcript, replayed for the interviewer's short-term memory. */
export interface MockInterviewHistoryTurn {
    /** Who spoke this turn: `"interviewer"` or `"candidate"`. */
    role: string
    /** The turn's text. */
    content: string
}

/**
 * Inner payload of a `mock_interview.chunk.subscription` server push — one
 * streamed delta for the interviewer's next turn, plus the terminal `done`
 * flag (and an `error` message when the stream failed).
 */
export interface MockInterviewChunkData {
    /** The stream this chunk belongs to (echoes the request `streamId`). */
    streamId: string
    /** The incremental text appended to the turn (empty on the terminal chunk). */
    delta: string
    /** Whether this is the terminal chunk for the stream. */
    done: boolean
    /** Error message when the stream failed (present only on a failed terminal chunk). */
    error?: string
}

/** Server → client envelope for a mock-interviewer turn chunk. */
export type MockInterviewChunkSocketIoMessage = SocketIoEnvelope<MockInterviewChunkData>

/**
 * Client → server payload to ask the mock interviewer for its next turn
 * (opening question, or a follow-up reacting to the candidate's latest answer).
 */
export interface AskMockInterviewTurnSocketIoPayload {
    /** The stream id, course/prompt context, phase, transcript, and lane selection. */
    data: {
        /** Client-generated id correlating this turn's streamed chunks. */
        streamId: string
        /**
         * Id of the persisted `mock_interview_sessions` row this ask belongs
         * to — lets the server enforce the 1-hour ask-loop deadline against
         * THIS session's own `createdAt` before spending an AI call.
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
        /** Full transcript so far (oldest first); omitted/empty on the opening turn. */
        history?: Array<MockInterviewHistoryTurn>
        /** The candidate's most recent answer; empty string on the opening turn. */
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
        /** Current question's seed text (Q&A kinds) — resent unchanged for the opening ask and every follow-up on that question. */
        currentSeed?: string | null
        /** 0-based index of the question this turn belongs to (Q&A kinds), for "Câu N" phrasing + first-ask detection. */
        questionIndex?: number | null
    }
    /** Locale (reply language + which body locale the server loads). */
    locale: string
}

/** Client → server payload to abort an in-flight interviewer turn stream. */
export interface AbortMockInterviewTurnSocketIoPayload {
    /** The stream to abort. */
    data: {
        /** Stream whose in-flight turn should be aborted. */
        streamId: string
    }
    /** Locale (carried for payload symmetry). */
    locale: string
}
