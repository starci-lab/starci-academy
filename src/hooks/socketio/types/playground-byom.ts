/**
 * One live Pod/Container/Image/Deployment/Service/ConfigMap reported by the
 * agent — a FREE-FORM string kind/status (raw from `docker`/`kubectl` output,
 * e.g. kind `"Pod"`/`"Container"`/`"Image"`, status `"Running"`/`"Present"`/
 * `"2/2 ready"`), matching the backend `PlaygroundByomGateway` verify-lite
 * comparison exactly (`resource.kind === step.verifyResourceKind`) — do NOT
 * narrow this to a closed union, the backend does not normalize these values.
 */
export interface PlaygroundByomResource {
    /** Resource kind as reported (`"Pod"`, `"Container"`, `"Image"`, `"Deployment"`, `"Service"`, `"ConfigMap"`, `"Node"`, ...). */
    kind: string
    /** Display name (e.g. container name, pod name, image tag). */
    name: string
    /** Current status as reported (raw `docker`/`kubectl` phase/state text). */
    status: string
}

/**
 * Server → browser push for `resources:report` — RAW (no envelope, no
 * `sessionId`, see `PlaygroundByomGateway.handleResourcesReport`).
 */
export interface PlaygroundByomResourcesReportSocketIoMessage {
    /** Full current snapshot of live resources (replaces the previous list). */
    resources: Array<PlaygroundByomResource>
}

/**
 * Server → browser push for `step:verified` — wrapped in the standard
 * `WsResponseService.successToRoom` envelope (`{success,message,data}`, NOT
 * the `{data,locale}` shape used elsewhere in this app), no `sessionId`
 * (room-scoped), see `PlaygroundByomGateway.verifyCurrentStep`.
 */
export interface PlaygroundByomStepVerifiedSocketIoMessage {
    /** Always `true` for this push. */
    success: boolean
    /** Human-readable status text (not shown to the user, diagnostic only). */
    message: string
    /** The step-verified payload. */
    data: {
        /** The step index that was just verified as complete. */
        stepIndex: number
    }
}

/**
 * Server → browser push for `agent:connected` / `agent:disconnected` — RAW
 * (no envelope, no `sessionId`, room-scoped). Emitted when the learner's local
 * CLI agent pairs / drops, plus a seed on `browser:subscribe`. Drives the
 * install-gate: the UI only unlocks the lab once `connected` is `true`.
 */
export interface PlaygroundByomAgentConnectionSocketIoMessage {
    /** `true` when the agent is paired to this session, `false` when it dropped. */
    connected: boolean
}

/**
 * Server → browser push for `agent:pong` — RAW (no envelope, no `sessionId`,
 * room-scoped). Carries back the `t` timestamp the browser sent in its
 * `agent:ping`, so the browser computes `Date.now() - t` as the round-trip
 * latency to the learner's machine. See `PlaygroundByomGateway.handleAgentPong`.
 */
export interface PlaygroundByomAgentPongSocketIoMessage {
    /** The browser timestamp (ms) echoed back by the agent. */
    t: number
}

/**
 * Server → browser push for `env:report` — whether this lab's TOOLING is
 * installed and answering on the learner's machine. The agent probes it
 * (`docker info` / `kubectl`+`kind` / Ollama) on pair and again on every
 * `verify:now`, so the Setup surface's "check" button reflects a real probe.
 *
 * Deliberately separate from `agent:connected`: an agent pairs happily while
 * Docker's daemon is stopped, so pairing must never be read as "engine ready".
 */
export interface PlaygroundByomEnvReportSocketIoMessage {
    /** True when the engine answered — the lab's commands will actually run. */
    ready: boolean
    /** Human label for the thing probed ("Docker engine", "kubectl + kind", "Ollama"). */
    label: string
    /** Version / reason line shown under the label. */
    detail?: string
}

/**
 * Server → browser push for `device:info` — the connected machine's hardware/OS
 * snapshot, sent once by the agent on pair (see `PlaygroundByomGateway.handleDeviceInfo`).
 */
export interface PlaygroundByomDeviceInfoSocketIoMessage {
    /** `win32` | `linux` | `darwin`. */
    platform: string
    /** OS release/version string. */
    release: string
    /** CPU architecture (`x64`, `arm64`, …). */
    arch: string
    /** Machine hostname. */
    hostname: string
    /** CPU model string. */
    cpuModel: string
    /** Logical CPU core count. */
    cpuCores: number
    /** Total RAM in bytes. */
    totalMemBytes: number
    /** Free RAM in bytes (at snapshot time). */
    freeMemBytes: number
    /** First discrete GPU name, or `null` if it couldn't be read (best-effort). */
    gpu: string | null
    /** Free GPU VRAM in MiB (NVIDIA only, via `nvidia-smi`); omitted when no NVIDIA GPU. */
    vramFreeMb?: number
    /** Total GPU VRAM in MiB (NVIDIA only, via `nvidia-smi`); omitted when no NVIDIA GPU. */
    vramTotalMb?: number
}

/** One streamed agent log line (server → browser, `agent:log`). */
export interface PlaygroundByomAgentLogSocketIoMessage {
    /** The log text. */
    line: string
    /** Severity for UI colouring (`success` = green, from the agent's human log). */
    level: "info" | "success" | "warn" | "error"
    /** Agent-side timestamp (ms). */
    t: number
}

/**
 * Browser → server payload for `browser:subscribe` — RAW (no `{data,locale}`
 * wrapper, matches `PlaygroundByomGateway.handleBrowserSubscribe`).
 */
export interface SubscribePlaygroundByomSocketIoPayload {
    /** The playground session to subscribe to (joins the session's room). */
    sessionId: string
}

/**
 * Browser → server payload for `agent:ping` — RAW (matches
 * `PlaygroundByomGateway.handleAgentPing`). The `t` is a `Date.now()` stamp the
 * agent echoes back so the browser can measure round-trip latency.
 */
export interface PingPlaygroundByomSocketIoPayload {
    /** The session whose connected agent should echo the ping. */
    sessionId: string
    /** Browser timestamp (ms) to be echoed back for latency measurement. */
    t: number
}

/**
 * Browser → server payload for `verify:now` — asks the paired agent to report
 * resources immediately so the current step verifies without waiting for the
 * next periodic snapshot (matches `PlaygroundByomGateway.handleVerifyNow`).
 */
export interface VerifyNowPlaygroundByomSocketIoPayload {
    /** The session whose connected agent should report its resources now. */
    sessionId: string
}

/**
 * Server → browser push for `ollama:status` — the local Ollama runtime's
 * serving state + loaded models, reported by the paired agent. RAW (no
 * envelope, no `sessionId`, room-scoped, matches `PlaygroundByomGateway.handleOllamaStatus`).
 */
export interface PlaygroundByomOllamaStatusSocketIoMessage {
    /** Whether the local Ollama runtime is up and answering. */
    serving: boolean
    /** Model tags currently pulled/loaded on the learner's machine. */
    models: Array<string>
}

/**
 * One retrieved source chunk backing a machine-backed RAG answer (carried in
 * {@link PlaygroundByomRagCitationsSocketIoMessage}). Mirrors the browser-side
 * `RagPlaygroundSourceChunk`, plus an optional retrieval score the local
 * retriever reports.
 */
export interface PlaygroundByomRagSource {
    /** File path (or synthetic label) the chunk came from. */
    filePath: string
    /** Truncated excerpt of the chunk's content. */
    snippet: string
    /** Retrieval score (0-1), when the local retriever reports one. */
    score?: number
}

/**
 * Server → browser push for `rag:answer` — a streamed answer chunk for a
 * machine-backed RAG run. RAW (no envelope, no `sessionId`, room-scoped,
 * matches `PlaygroundByomGateway.handleRagAnswer`).
 */
export interface PlaygroundByomRagAnswerSocketIoMessage {
    /** The run this chunk belongs to (matches the `runId` sent in `rag:ask`). */
    runId: string
    /** The answer text so far (accumulated by the agent, replaces the previous value). */
    text: string
    /** `true` once the stream for this run is complete. */
    done: boolean
}

/**
 * Server → browser push for `rag:citations` — the retrieved sources backing a
 * machine-backed RAG answer. RAW (no envelope, no `sessionId`, room-scoped,
 * matches `PlaygroundByomGateway.handleRagCitations`).
 */
export interface PlaygroundByomRagCitationsSocketIoMessage {
    /** The run these citations belong to (matches the `runId` sent in `rag:ask`). */
    runId: string
    /** The retrieved source chunks grounding the answer. */
    sources: Array<PlaygroundByomRagSource>
}

/**
 * Server → browser push for `rag:event` — a machine-backed RAG lifecycle
 * signal. RAW (no envelope, no `sessionId`, room-scoped, matches
 * `PlaygroundByomGateway.handleRagEvent`).
 */
export interface PlaygroundByomRagEventSocketIoMessage {
    /** The lifecycle phase: a source was indexed, a question was asked, or the answer finished. */
    kind: "imported" | "asked" | "answered"
}

/**
 * Browser → server payload for `rag:index` — asks the connected agent to index
 * a code source into an ephemeral RAG collection. RAW (no `{data,locale}`
 * wrapper, matches `PlaygroundByomGateway.handleRagIndex`).
 */
export interface IndexRagPlaygroundByomSocketIoPayload {
    /** The session whose connected agent should index the source. */
    sessionId: string
    /** How the source is provided (`paste` | `upload` | `sample` | `github`, raw from the picker). */
    kind: string
    /** Pasted / uploaded code, when the source is inline. */
    code?: string
    /** Uploaded file name, when the source is an upload. */
    fileName?: string
    /** Repository URL, when the source is a GitHub repo. */
    githubUrl?: string
    /** Catalog sample id, when the source is a built-in sample. */
    sampleId?: string
}

/**
 * Browser → server payload for `rag:ask` — asks the connected agent to answer a
 * question over the indexed code. RAW (no `{data,locale}` wrapper, matches
 * `PlaygroundByomGateway.handleRagAsk`).
 */
export interface AskRagPlaygroundByomSocketIoPayload {
    /** The session whose connected agent should answer. */
    sessionId: string
    /** Client-generated run id to correlate the streamed `rag:answer`/`rag:citations` pushes. */
    runId: string
    /** The visitor's question about the indexed code. */
    question: string
}
