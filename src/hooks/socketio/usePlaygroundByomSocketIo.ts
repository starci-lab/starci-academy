import { useCallback, useEffect, useRef, useState } from "react"
import type {
    PlaygroundByomAgentConnectionSocketIoMessage,
    PlaygroundByomAgentPongSocketIoMessage,
    PlaygroundByomCommandOutputSocketIoMessage,
    PlaygroundByomResource,
    PlaygroundByomResourcesReportSocketIoMessage,
    PlaygroundByomStepVerifiedSocketIoMessage,
    PingPlaygroundByomSocketIoPayload,
    RunPlaygroundByomCommandSocketIoPayload,
    SubscribePlaygroundByomSocketIoPayload,
} from "./types"
import { PublicationEvent, SubscriptionEvent } from "./enums"
import { playgroundByomSocket } from "./sockets"
import { LocalStorage } from "@/modules/storage/local/storage"
import { LocalStorageId } from "@/modules/storage/local/enums/id"

/** Accumulated live state for one Playground BYOM session. */
export interface PlaygroundByomState {
    /** Whether the learner's local CLI agent is currently connected + paired to this session. */
    connected: boolean
    /** Raw command/output log, newest line last — fed straight into the Terminal tab. */
    commandOutput: string
    /** Latest reported live resources (Pod/Container/Network/Service) — fed into the Resources tab. */
    resources: Array<PlaygroundByomResource>
    /** Index of the step most recently verified as complete by the agent/server, or `null`. */
    verifiedStepIndex: number | null
    /**
     * Latest round-trip latency (ms) to the learner's machine, measured by
     * pinging the agent every 5s while connected. `null` until the first pong.
     */
    latencyMs: number | null
}

const INITIAL_STATE: PlaygroundByomState = {
    connected: false,
    commandOutput: "",
    resources: [],
    verifiedStepIndex: null,
    latencyMs: null,
}

/** How often (ms) to ping the connected agent for a fresh latency reading. */
const PING_INTERVAL_MS = 5000

/** What {@link usePlaygroundByomSocketIo} returns to the Playground session screen. */
export interface PlaygroundByomSocketIoControls {
    /** Accumulated state of the session currently being tracked. */
    state: PlaygroundByomState
    /** Begin tracking a session: reset state and emit `browser:subscribe`. */
    subscribe: (sessionId: string) => void
    /** Emit `command:run` to relay a shell command to the connected agent. */
    sendCommand: (command: string) => void
}

/**
 * Consumer hook for the course-scoped Playground "bring your own machine"
 * relay: connects to the `/playground_byom` namespace, subscribes to one
 * session's room, and accumulates the command-output log + live resource
 * snapshot + step-verified events pushed by the backend gateway (itself
 * relaying from the learner's local CLI agent).
 *
 * Self-contained like {@link import("./useRagPlaygroundRunStreamSocketIo").useRagPlaygroundRunStreamSocketIo}
 * (connects on mount, local `useState`, no global lifecycle wiring). The
 * backend `PlaygroundByomGateway` is UNAUTHENTICATED (the paired CLI agent has
 * no Keycloak session — gated by a short-lived pairing code instead), so a
 * bearer token is attached defensively but the gateway ignores it either way.
 *
 * All 3 server pushes (`command:output` / `resources:report` / `step:verified`)
 * are ROOM-SCOPED by the gateway — no `sessionId` on the payload to filter by,
 * unlike this app's other socket features (see `types/playground-byom.ts`).
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

        const onCommandOutput = (message: PlaygroundByomCommandOutputSocketIoMessage) => {
            setState((prev) => ({
                ...prev,
                commandOutput: `${prev.commandOutput}\n${message.output}`,
            }))
        }

        const onResourcesReport = (message: PlaygroundByomResourcesReportSocketIoMessage) => {
            setState((prev) => ({ ...prev, resources: message.resources }))
        }

        const onStepVerified = (message: PlaygroundByomStepVerifiedSocketIoMessage) => {
            setState((prev) => ({ ...prev, verifiedStepIndex: message.data.stepIndex }))
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
        socket.on(SubscriptionEvent.PlaygroundByomCommandOutput, onCommandOutput)
        socket.on(SubscriptionEvent.PlaygroundByomResourcesReport, onResourcesReport)
        socket.on(SubscriptionEvent.PlaygroundByomStepVerified, onStepVerified)
        socket.on(SubscriptionEvent.PlaygroundByomAgentConnected, onAgentConnected)
        socket.on(SubscriptionEvent.PlaygroundByomAgentDisconnected, onAgentDisconnected)
        socket.on(SubscriptionEvent.PlaygroundByomAgentPong, onAgentPong)
        return () => {
            socket.off("connect", onConnect)
            socket.off("disconnect", onDisconnect)
            socket.off(SubscriptionEvent.PlaygroundByomCommandOutput, onCommandOutput)
            socket.off(SubscriptionEvent.PlaygroundByomResourcesReport, onResourcesReport)
            socket.off(SubscriptionEvent.PlaygroundByomStepVerified, onStepVerified)
            socket.off(SubscriptionEvent.PlaygroundByomAgentConnected, onAgentConnected)
            socket.off(SubscriptionEvent.PlaygroundByomAgentDisconnected, onAgentDisconnected)
            socket.off(SubscriptionEvent.PlaygroundByomAgentPong, onAgentPong)
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

    const sendCommand = useCallback(
        (command: string) => {
            const sessionId = sessionIdRef.current
            if (!sessionId) {
                return
            }
            const payload: RunPlaygroundByomCommandSocketIoPayload = { sessionId, command }
            playgroundByomSocket.emit(PublicationEvent.RunPlaygroundByomCommand, payload)
        },
        [],
    )

    return {
        state,
        subscribe,
        sendCommand,
    }
}
