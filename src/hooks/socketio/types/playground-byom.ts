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
 * Browser → server payload for `browser:subscribe` — RAW (no `{data,locale}`
 * wrapper, matches `PlaygroundByomGateway.handleBrowserSubscribe`).
 */
export interface SubscribePlaygroundByomSocketIoPayload {
    /** The playground session to subscribe to (joins the session's room). */
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
