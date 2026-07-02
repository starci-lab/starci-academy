import type { GraphQLResponse } from "../../types"

/** Request body for the `askRagPlayground` mutation. */
export interface AskRagPlaygroundRequest {
    /** Session previously indexed via `indexRagPlayground`. */
    sessionId: string
    /** The visitor's question about the indexed code. */
    question: string
}

/** One retrieved source chunk backing the answer (shown as a citation). */
export interface RagPlaygroundSourceChunk {
    /** File path (or synthetic label for pasted/sample code) the chunk came from. */
    filePath: string
    /** Truncated excerpt of the chunk's content. */
    snippet: string
}

/** Payload inside `askRagPlayground.data` after the standard API wrapper. */
export interface AskRagPlaygroundData {
    /** Run id to subscribe to on the `/rag_playground` socket for the streamed answer. */
    runId: string
    /** Retrieved source chunks grounding the (not-yet-streamed) answer. */
    sources: Array<RagPlaygroundSourceChunk>
}

/** Apollo response shape for `askRagPlayground`. */
export interface MutateAskRagPlaygroundResponse {
    /** Top-level `askRagPlayground` field wrapping the standard API response. */
    askRagPlayground: GraphQLResponse<AskRagPlaygroundData>
}
