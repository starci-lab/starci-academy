import type { SocketIoEnvelope } from "./content-discussion"

/** One retrieved source chunk backing a RAG Playground answer (a citation). */
export interface RagPlaygroundSourceChunk {
    /** File path (or synthetic label for pasted/sample code) the chunk came from. */
    filePath: string
    /** Truncated excerpt of the chunk's content. */
    snippet: string
}

/**
 * Inner payload of a `rag_playground.run_chunk.subscription` server push — one
 * streamed delta for a given run; the terminal chunk (`done: true`) carries the
 * final `sources` (and `error` when the model call failed).
 */
export interface RagPlaygroundRunChunkData {
    /** The run this chunk belongs to. */
    runId: string
    /** The incremental text appended to the answer. */
    delta: string
    /** Whether this is the terminal chunk for the run. */
    done: boolean
    /** Retrieved source chunks grounding the answer (present on the terminal chunk). */
    sources?: Array<RagPlaygroundSourceChunk>
    /** Human-readable failure reason (present on the terminal chunk when it failed). */
    error?: string
}

/** Server → client envelope for a RAG Playground run chunk. */
export type RagPlaygroundRunChunkSocketIoMessage = SocketIoEnvelope<RagPlaygroundRunChunkData>

/** Subscription target of a {@link SubscribeRagPlaygroundRunSocketIoPayload}. */
export interface SubscribeRagPlaygroundRunData {
    /** The run to subscribe to (joins room `rag-playground-run:{runId}`). */
    runId: string
}

/** Client → server payload to subscribe to a run's token stream. */
export interface SubscribeRagPlaygroundRunSocketIoPayload {
    /** The run to subscribe to. */
    data: SubscribeRagPlaygroundRunData
    /** Locale used for server-rendered status copy. */
    locale: string
}

/** Subscription target of an {@link AbortRagPlaygroundRunSocketIoPayload}. */
export interface AbortRagPlaygroundRunData {
    /** The run to abort. */
    runId: string
}

/** Client → server payload to abort an in-flight run. */
export interface AbortRagPlaygroundRunSocketIoPayload {
    /** The run to abort. */
    data: AbortRagPlaygroundRunData
    /** Locale used for server-rendered status copy. */
    locale: string
}
