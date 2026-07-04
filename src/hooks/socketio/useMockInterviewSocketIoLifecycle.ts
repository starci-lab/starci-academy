import { useEffect } from "react"
import { useAppSelector } from "@/redux/hooks"
import { mockInterviewSocket } from "./sockets"
import { useSocketConnectionStore } from "./connectionStore"
import { LocalStorage } from "@/modules/storage/local/storage"
import { LocalStorageId } from "@/modules/storage/local/enums/id"

/**
 * Lifecycle hook for the `/mock_interview` namespace — runs ONCE in
 * {@link import("./SocketIoSideEffects").SocketIoSideEffects}. Connects on auth
 * and relies on the manager's built-in reconnection (infinite backoff) to come
 * back after a drop; the bearer token is supplied per-attempt via a function
 * `socket.auth` so every reconnect carries a FRESH token. Turn-chunk listeners
 * are attached per-stream by consumers via
 * {@link import("./useMockInterviewTurnStream").useMockInterviewTurnStream}; this
 * hook only owns the connection.
 */
export const useMockInterviewSocketIoLifecycle = () => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)

    /** Wire connect / disconnect listeners (log only — reconnection is automatic). */
    useEffect(() => {
        const socket = mockInterviewSocket
        const onConnect = () => {
            console.log("[Mock Interview Socket] Connected.")
            useSocketConnectionStore.getState().setStatus("mock_interview", "connected")
        }
        const onDisconnect = (reason: string) => {
            console.log(`[Mock Interview Socket] Disconnected — reason: ${reason}`)
            useSocketConnectionStore.getState().setStatus("mock_interview", "disconnected")
        }
        const onConnectError = (err: Error) => {
            console.error("[Mock Interview Socket] Connection error:", err.message)
            useSocketConnectionStore.getState().setStatus("mock_interview", "disconnected")
        }
        socket.on("connect", onConnect)
        socket.on("disconnect", onDisconnect)
        socket.on("connect_error", onConnectError)
        return () => {
            socket.off("connect", onConnect)
            socket.off("disconnect", onDisconnect)
            socket.off("connect_error", onConnectError)
        }
    }, [])

    /** Connect when auth state changes; the manager auto-reconnects thereafter. */
    useEffect(() => {
        if (!authenticated) {
            return
        }
        if (mockInterviewSocket.connected) {
            mockInterviewSocket.disconnect()
        }
        // function form → re-evaluated on every (re)connection attempt, so a
        // reconnect after the token rotated still handshakes with a fresh token
        mockInterviewSocket.auth = (cb) => cb({
            token: LocalStorage.getItemAsString(
                LocalStorageId.KeycloakAccessToken,
            ),
        })
        mockInterviewSocket.connect()
    }, [authenticated])
}
