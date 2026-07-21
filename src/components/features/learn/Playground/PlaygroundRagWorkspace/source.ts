/**
 * The on-device RAG lab's import contract — kept lab-local (no longer tied to a
 * GraphQL mutation). These are the ONLY RAG surface left after the server-side
 * "PublicRagPlayground" demo was removed; the paired CLI agent
 * (`@starciacademy/playground-rag-agent`) resolves each `kind` to code entirely
 * on-device.
 */

/** Which source the learner is importing. Wire values (lowercase) match the agent's `IndexSource.kind`. */
export enum RagPlaygroundSourceKind {
    /** Inline code pasted into the textarea. */
    Paste = "paste",
    /** Code read from an uploaded file. */
    Upload = "upload",
    /** A built-in catalog entry — the agent owns the code, keyed by {@link RagSampleOption.id}. */
    Sample = "sample",
    /** A public GitHub repo the agent fetches over the REST API. */
    Github = "github",
}

/** One selectable built-in sample: the wire `id` the agent resolves + its human label. */
export interface RagSampleOption {
    id: string
    label: string
}

/**
 * The built-in sample catalog the picker offers. IDs MIRROR the agent's
 * `SAMPLE_CATALOG` in `apps/playground-rag-agent/src/rag-samples.ts` (backend
 * monorepo) — the picker sends only the `id`, and the agent resolves it to the
 * actual code locally, so only `id` + `label` need to live here. Keep the ids in
 * sync if the agent's catalog changes.
 */
export const RAG_SAMPLES: Array<RagSampleOption> = [
    { id: "retrieval-helper", label: "Retrieval helper (cosine similarity top-k)" },
    { id: "express-todo-api", label: "Express REST API (todos CRUD)" },
    { id: "docker-compose-api", label: "Dockerfile + docker-compose (API + Postgres)" },
]
