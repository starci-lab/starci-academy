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
 * Server → browser push for `command:output` — RAW (no `{data,locale}`
 * envelope, no `sessionId`: the backend gateway relays only within the
 * subscriber's already-joined session room, see `PlaygroundByomGateway.handleCommandOutput`).
 */
export interface PlaygroundByomCommandOutputSocketIoMessage {
    /** The output text for this relay tick (already prefixed with `$ <command>` by the agent). */
    output: string
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
 * Browser → server payload for `command:run` — RAW (no `{data,locale}`
 * wrapper, matches `PlaygroundByomGateway.handleCommandRun`).
 */
export interface RunPlaygroundByomCommandSocketIoPayload {
    /** The session whose connected agent should run the command. */
    sessionId: string
    /** The shell command to run on the learner's machine. */
    command: string
}
