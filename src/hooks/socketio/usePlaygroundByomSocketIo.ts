import { useCallback, useEffect, useRef, useState } from "react"
import type {
    PlaygroundByomAgentConnectionSocketIoMessage,
    PlaygroundByomAgentLogSocketIoMessage,
    PlaygroundByomAgentPongSocketIoMessage,
    PlaygroundByomDeviceInfoSocketIoMessage,
    PlaygroundByomEnvReportSocketIoMessage,
    PlaygroundByomOllamaStatusSocketIoMessage,
    PlaygroundByomRagAnswerSocketIoMessage,
    PlaygroundByomRagCitationsSocketIoMessage,
    PlaygroundByomRagEventSocketIoMessage,
    PlaygroundByomResource,
    PlaygroundByomResourcesReportSocketIoMessage,
    PlaygroundByomStepVerifiedSocketIoMessage,
    AskRagPlaygroundByomSocketIoPayload,
    IndexRagPlaygroundByomSocketIoPayload,
    PingPlaygroundByomSocketIoPayload,
    SubscribePlaygroundByomSocketIoPayload,
    VerifyNowPlaygroundByomSocketIoPayload,
} from "./types"
import { PublicationEvent, SubscriptionEvent } from "./enums"
import { playgroundByomSocket } from "./sockets"
import { LocalStorage } from "@/modules/storage/local/storage"
import { LocalStorageId } from "@/modules/storage/local/enums/id"

/** Accumulated live state for one Playground BYOM session. */
export interface PlaygroundByomState {
    /** Whether the learner's local CLI agent is currently connected + paired to this session. */
    connected: boolean
    /** Latest reported live resources (Pod/Container/Network/Service) — fed into the Resources tab. */
    resources: Array<PlaygroundByomResource>
    /** Index of the step most recently verified as complete by the agent/server, or `null`. */
    verifiedStepIndex: number | null
    /**
     * Latest round-trip latency (ms) to the learner's machine, measured by
     * pinging the agent every 5s while connected. `null` until the first pong.
     */
    latencyMs: number | null
    /** The connected machine's hardware/OS snapshot (sent once on pair), or `null`. */
    deviceInfo: PlaygroundByomDeviceInfoSocketIoMessage | null
    /**
     * Whether this lab's tooling is installed AND answering, probed by the agent
     * on pair and on every `verify:now`. `null` until the first report. Kept
     * SEPARATE from `connected` on purpose — an agent pairs fine while Docker's
     * daemon is stopped, so pairing is not evidence the engine works.
     */
    envReport: PlaygroundByomEnvReportSocketIoMessage | null
    /** Streamed agent lifecycle/diagnostic log lines, newest last (capped). */
    agentLog: Array<PlaygroundByomAgentLogSocketIoMessage>
    /** Latest local Ollama runtime serving state + loaded models, or `null` until first reported. */
    ollamaStatus: { serving: boolean; models: Array<string> } | null
    /** Latest streamed machine-backed RAG answer chunk, or `null` until the first `rag:answer`. */
    ragAnswer: PlaygroundByomRagAnswerSocketIoMessage | null
    /** Latest machine-backed RAG citations, or `null` until the first `rag:citations`. */
    ragCitations: PlaygroundByomRagCitationsSocketIoMessage | null
    /** Latest machine-backed RAG lifecycle event, or `null` until the first `rag:event`. */
    ragEvent: PlaygroundByomRagEventSocketIoMessage | null
}

/** Max agent log lines kept in memory (older lines drop off). */
const AGENT_LOG_CAP = 100

const INITIAL_STATE: PlaygroundByomState = {
    connected: false,
    resources: [],
    verifiedStepIndex: null,
    latencyMs: null,
    deviceInfo: null,
    envReport: null,
    agentLog: [],
    ollamaStatus: null,
    ragAnswer: null,
    ragCitations: null,
    ragEvent: null,
}

/** How often (ms) to ping the connected agent for a fresh latency reading. */
const PING_INTERVAL_MS = 5000

/** What {@link usePlaygroundByomSocketIo} returns to the Playground session screen. */
export interface PlaygroundByomSocketIoControls {
    /** Accumulated state of the session currently being tracked. */
    state: PlaygroundByomState
    /** Begin tracking a session: reset state and emit `browser:subscribe`. */
    subscribe: (sessionId: string) => void
    /** Emit `verify:now` — ask the agent to report resources immediately so the
     * current step verifies without waiting for the next periodic snapshot. */
    requestVerify: () => void
    /** Emit `rag:index` — ask the connected agent to index a code source into an
     * ephemeral RAG collection. The `sessionId` is filled from the tracked session. */
    sendRagIndex: (source: Omit<IndexRagPlaygroundByomSocketIoPayload, "sessionId">) => void
    /** Emit `rag:ask` — ask the connected agent to answer a question over the
     * indexed code, correlated by `runId` to the streamed `rag:answer`/`rag:citations`. */
    sendRagAsk: (runId: string, question: string) => void
}

/**
 * Consumer hook for the course-scoped Playground "bring your own machine"
 * relay: connects to the `/playground_byom` namespace, subscribes to one
 * session's room, and accumulates the live resource snapshot + step-verified
 * events pushed by the backend gateway (itself relaying from the learner's
 * local CLI agent). There is no command relay — the learner runs commands in
 * their own terminal; `requestVerify` just asks the agent to re-snapshot.
 *
 * Self-contained (connects on mount, local `useState`, no global lifecycle
 * wiring). The
 * backend `PlaygroundByomGateway` is UNAUTHENTICATED (the paired CLI agent has
 * no Keycloak session — gated by a short-lived pairing code instead), so a
 * bearer token is attached defensively but the gateway ignores it either way.
 *
 * The server pushes (`resources:report` / `step:verified` / …) are ROOM-SCOPED
 * by the gateway — no `sessionId` on the payload to filter by, unlike this
 * app's other socket features (see `types/playground-byom.ts`).
 */
export const usePlaygroundByomSocketIo = (): PlaygroundByomSocketIoControls => {
    const [state, setState] = useState<PlaygroundByomState>(INITIAL_STATE)
    const sessionIdRef = useRef<string | undefined>(undefined)

    useEffect(() => {
        const socket = playgroundByomSocket

        // the BROWSER socket (re)connecting does NOT mean the learner's agent is
        // connected — re-join the session room so relays + a fresh agent-connected
        // seed resume after a reconnect. `connected` is driven ONLY by the
        // agent:connected/disconnected pushes below.
        const onConnect = () => {
            const sessionId = sessionIdRef.current
            if (sessionId) {
                const payload: SubscribePlaygroundByomSocketIoPayload = { sessionId }
                socket.emit(PublicationEvent.SubscribePlaygroundByom, payload)
            }
        }
        // browser lost the relay → we can no longer vouch the agent is up, and
        // any last latency reading is stale.
        const onDisconnect = () => setState((prev) => ({ ...prev, connected: false, latencyMs: null }))
        const onAgentConnected = (message: PlaygroundByomAgentConnectionSocketIoMessage) =>
            setState((prev) => ({ ...prev, connected: message.connected }))
        // agent dropped → clear the stale latency along with the connected flag.
        const onAgentDisconnected = (message: PlaygroundByomAgentConnectionSocketIoMessage) =>
            setState((prev) => ({ ...prev, connected: message.connected, latencyMs: null }))
        // pong echoes back the `t` we stamped in the ping → round-trip = now - t.
        const onAgentPong = (message: PlaygroundByomAgentPongSocketIoMessage) =>
            setState((prev) => ({ ...prev, latencyMs: Math.max(0, Date.now() - message.t) }))

        const onResourcesReport = (message: PlaygroundByomResourcesReportSocketIoMessage) => {
            setState((prev) => ({ ...prev, resources: message.resources }))
        }

        const onStepVerified = (message: PlaygroundByomStepVerifiedSocketIoMessage) => {
            setState((prev) => ({ ...prev, verifiedStepIndex: message.data.stepIndex }))
        }

        const onDeviceInfo = (message: PlaygroundByomDeviceInfoSocketIoMessage) => {
            setState((prev) => ({ ...prev, deviceInfo: message }))
        }

        const onEnvReport = (message: PlaygroundByomEnvReportSocketIoMessage) => {
            setState((prev) => ({ ...prev, envReport: message }))
        }

        const onAgentLog = (message: PlaygroundByomAgentLogSocketIoMessage) => {
            setState((prev) => ({
                ...prev,
                agentLog: [...prev.agentLog, message].slice(-AGENT_LOG_CAP),
            }))
        }

        const onOllamaStatus = (message: PlaygroundByomOllamaStatusSocketIoMessage) => {
            setState((prev) => ({ ...prev, ollamaStatus: { serving: message.serving, models: message.models } }))
        }

        const onRagAnswer = (message: PlaygroundByomRagAnswerSocketIoMessage) => {
            setState((prev) => ({ ...prev, ragAnswer: message }))
        }

        const onRagCitations = (message: PlaygroundByomRagCitationsSocketIoMessage) => {
            setState((prev) => ({ ...prev, ragCitations: message }))
        }

        const onRagEvent = (message: PlaygroundByomRagEventSocketIoMessage) => {
            setState((prev) => ({ ...prev, ragEvent: message }))
        }

        // function form → re-evaluated on every (re)connection attempt, so a
        // reconnect after the token rotated still handshakes with a fresh token
        // (harmless here — the gateway is unauthenticated and ignores it).
        socket.auth = (cb) => cb({
            token: LocalStorage.getItemAsString(LocalStorageId.KeycloakAccessToken),
        })
        if (!socket.connected) {
            socket.connect()
        }
        socket.on("connect", onConnect)
        socket.on("disconnect", onDisconnect)
        socket.on(SubscriptionEvent.PlaygroundByomResourcesReport, onResourcesReport)
        socket.on(SubscriptionEvent.PlaygroundByomStepVerified, onStepVerified)
        socket.on(SubscriptionEvent.PlaygroundByomAgentConnected, onAgentConnected)
        socket.on(SubscriptionEvent.PlaygroundByomAgentDisconnected, onAgentDisconnected)
        socket.on(SubscriptionEvent.PlaygroundByomAgentPong, onAgentPong)
        socket.on(SubscriptionEvent.PlaygroundByomDeviceInfo, onDeviceInfo)
        socket.on(SubscriptionEvent.PlaygroundByomEnvReport, onEnvReport)
        socket.on(SubscriptionEvent.PlaygroundByomAgentLog, onAgentLog)
        socket.on(SubscriptionEvent.PlaygroundByomOllamaStatus, onOllamaStatus)
        socket.on(SubscriptionEvent.PlaygroundByomRagAnswer, onRagAnswer)
        socket.on(SubscriptionEvent.PlaygroundByomRagCitations, onRagCitations)
        socket.on(SubscriptionEvent.PlaygroundByomRagEvent, onRagEvent)
        return () => {
            socket.off("connect", onConnect)
            socket.off("disconnect", onDisconnect)
            socket.off(SubscriptionEvent.PlaygroundByomResourcesReport, onResourcesReport)
            socket.off(SubscriptionEvent.PlaygroundByomStepVerified, onStepVerified)
            socket.off(SubscriptionEvent.PlaygroundByomAgentConnected, onAgentConnected)
            socket.off(SubscriptionEvent.PlaygroundByomAgentDisconnected, onAgentDisconnected)
            socket.off(SubscriptionEvent.PlaygroundByomAgentPong, onAgentPong)
            socket.off(SubscriptionEvent.PlaygroundByomDeviceInfo, onDeviceInfo)
            socket.off(SubscriptionEvent.PlaygroundByomEnvReport, onEnvReport)
            socket.off(SubscriptionEvent.PlaygroundByomAgentLog, onAgentLog)
            socket.off(SubscriptionEvent.PlaygroundByomOllamaStatus, onOllamaStatus)
            socket.off(SubscriptionEvent.PlaygroundByomRagAnswer, onRagAnswer)
            socket.off(SubscriptionEvent.PlaygroundByomRagCitations, onRagCitations)
            socket.off(SubscriptionEvent.PlaygroundByomRagEvent, onRagEvent)
        }
    }, [])

    // Ping the connected agent every 5s to keep a live round-trip latency
    // reading. Only runs while the agent is actually paired (`connected`); the
    // pong handler above turns each echo into `latencyMs`. Re-armed whenever the
    // connection flips so a reconnect resumes measuring immediately.
    useEffect(() => {
        if (!state.connected) {
            return
        }
        const emitPing = () => {
            const sessionId = sessionIdRef.current
            if (!sessionId) {
                return
            }
            const payload: PingPlaygroundByomSocketIoPayload = { sessionId, t: Date.now() }
            playgroundByomSocket.emit(PublicationEvent.PlaygroundByomPing, payload)
        }
        emitPing()
        const handle = setInterval(emitPing, PING_INTERVAL_MS)
        return () => clearInterval(handle)
    }, [state.connected])

    const subscribe = useCallback(
        (sessionId: string) => {
            sessionIdRef.current = sessionId
            // reset to "not connected" — the gateway replies to browser:subscribe
            // with an agent:connected/disconnected SEED that sets the real state.
            setState({ ...INITIAL_STATE })
            const payload: SubscribePlaygroundByomSocketIoPayload = { sessionId }
            playgroundByomSocket.emit(PublicationEvent.SubscribePlaygroundByom, payload)
        },
        [],
    )

    const requestVerify = useCallback(
        () => {
            const sessionId = sessionIdRef.current
            if (!sessionId) {
                return
            }
            const payload: VerifyNowPlaygroundByomSocketIoPayload = { sessionId }
            playgroundByomSocket.emit(PublicationEvent.PlaygroundByomVerifyNow, payload)
        },
        [],
    )

    const sendRagIndex = useCallback(
        (source: Omit<IndexRagPlaygroundByomSocketIoPayload, "sessionId">) => {
            const sessionId = sessionIdRef.current
            if (!sessionId) {
                return
            }
            const payload: IndexRagPlaygroundByomSocketIoPayload = { sessionId, ...source }
            playgroundByomSocket.emit(PublicationEvent.PlaygroundByomRagIndex, payload)
        },
        [],
    )

    const sendRagAsk = useCallback(
        (runId: string, question: string) => {
            const sessionId = sessionIdRef.current
            if (!sessionId) {
                return
            }
            const payload: AskRagPlaygroundByomSocketIoPayload = { sessionId, runId, question }
            playgroundByomSocket.emit(PublicationEvent.PlaygroundByomRagAsk, payload)
        },
        [],
    )

    return {
        state,
        subscribe,
        requestVerify,
        sendRagIndex,
        sendRagAsk,
    }
}
