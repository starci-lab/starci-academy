import type { GraphQLResponse } from "../../types"

/**
 * Source kind for a RAG Playground import. Mirrors backend `RagPlaygroundSourceKind`
 * (wire values are the lowercase strings).
 */
export enum RagPlaygroundSourceKind {
    /** Code pasted directly into the composer. */
    Paste = "paste",
    /** A single file uploaded from disk. */
    Upload = "upload",
    /** The built-in sample snippet (no user input required). */
    Sample = "sample",
    /** A public GitHub repository, imported via the REST API (no cloning). */
    Github = "github",
}

/** Request body for the `indexRagPlayground` mutation. */
export interface IndexRagPlaygroundRequest {
    /** Client-generated id scoping the ephemeral Qdrant collection + session row. */
    sessionId: string
    /** How the code was supplied. */
    kind: RagPlaygroundSourceKind
    /** Raw code text — required for `paste`/`upload`, ignored otherwise. */
    code?: string
    /** Best-effort language hint (unused server-side beyond labeling, optional). */
    language?: string
    /** Original file name — used for `sourceLabel` when `kind` is `upload`. */
    fileName?: string
    /** `https://github.com/<owner>/<repo>` URL — required when `kind` is `github`. */
    githubUrl?: string
    /** Chosen catalog entry's id — used when `kind` is `sample`; server defaults to the first entry when omitted. */
    sampleId?: string
}

/** Payload inside `indexRagPlayground.data` after the standard API wrapper. */
export interface IndexRagPlaygroundData {
    /** Echoes the request's `sessionId` (session row's natural key). */
    sessionId: string
    /** Number of chunks embedded and written to the ephemeral Qdrant collection. */
    chunkCount: number
    /** Human-readable label for what was indexed (file name / repo / "Mẫu"). */
    sourceLabel?: string | null
}

/** Apollo response shape for `indexRagPlayground`. */
export interface MutateIndexRagPlaygroundResponse {
    /** Top-level `indexRagPlayground` field wrapping the standard API response. */
    indexRagPlayground: GraphQLResponse<IndexRagPlaygroundData>
}
