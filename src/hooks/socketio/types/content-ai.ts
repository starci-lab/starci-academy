import type { SocketIoEnvelope } from "./content-discussion"

/** One prior turn in the content-AI conversation, replayed for short-term memory. */
export interface ContentAiHistoryTurn {
    /** Who sent it: `"user"` or `"assistant"`. */
    role: string
    /** The message text. */
    content: string
}

/**
 * Inner payload of a `content_ai.chunk.subscription` server push — one streamed
 * delta for a given answer stream, plus the terminal `done` flag (and an
 * `error` message when the stream failed).
 */
export interface ContentAiChunkData {
    /** The stream this chunk belongs to (echoes the request `streamId`). */
    streamId: string
    /** The incremental text appended to the answer (empty on the terminal chunk). */
    delta: string
    /** Whether this is the terminal chunk for the stream. */
    done: boolean
    /** Error message when the stream failed (present only on a failed terminal chunk). */
    error?: string
}

/** Server → client envelope for a content-AI answer chunk. */
export type ContentAiChunkSocketIoMessage = SocketIoEnvelope<ContentAiChunkData>

/** Client → server payload to ask a content-AI question and stream the answer. */
export interface AskContentAiSocketIoPayload {
    /** The question, content id, recent turns, and a client-generated stream id. */
    data: {
        /** Client-generated id correlating this question's streamed chunks. */
        streamId: string
        /** Conversation (session) this turn belongs to — the saved turn is keyed by it. */
        sessionId: string
        /** Content the question is grounded on; omit with `courseId` for a course-general conversation. */
        contentId?: string | null
        /** Capstone task the question is grounded on (task scope). */
        taskId?: string | null
        /** Hands-on challenge the question is grounded on (challenge scope). */
        challengeId?: string | null
        /** Flashcard-quiz deck the question is grounded on (quiz scope). */
        quizId?: string | null
        /** Foundation the question is grounded on (foundation scope). */
        foundationId?: string | null
        /** Course the question is grounded on, when `contentId` is omitted (course-general conversation). */
        courseId?: string | null
        /** The learner's question. */
        question: string
        /** Recent prior turns (oldest first) for short-term memory. */
        history?: Array<ContentAiHistoryTurn>
        /** Pinned model name (absent → balancer picks from the free chain). */
        model?: string | null
        /** Provider of the pinned model. */
        provider?: string | null
    }
    /** Locale (reply language + which body locale the server loads). */
    locale: string
}

/** Client → server payload to abort an in-flight content-AI answer stream. */
export interface AbortContentAiSocketIoPayload {
    /** The stream to abort. */
    data: {
        /** Stream whose in-flight answer should be aborted. */
        streamId: string
    }
    /** Locale (carried for payload symmetry). */
    locale: string
}
