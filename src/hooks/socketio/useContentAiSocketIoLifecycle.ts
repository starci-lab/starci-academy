import { useEffect, useRef, useState } from "react"
import { useAppSelector } from "@/redux/hooks"
import { contentAiSocket } from "./sockets"
import { LocalStorage } from "@/modules/storage/local/storage"
import { LocalStorageId } from "@/modules/storage/local/enums/id"
import { sleep } from "@/modules/utils/misc"

/**
 * Lifecycle hook for the `/content_ai` namespace — runs ONCE in
 * {@link import("./SocketIoSideEffects").SocketIoSideEffects}. Auto-connects on
 * auth (same bearer-token handshake + reconnect backoff as the other
 * namespaces). Answer-chunk listeners are attached per-stream by consumers via
 * {@link import("./useContentAiStream").useContentAiStream}; this hook only owns
 * the connection.
 */
export const useContentAiSocketIoLifecycle = () => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const [numReconnect, setNumReconnect] = useState(0)

    /** Whether still mounted — blocks setState after unmount (the `disconnect` handler runs after `await sleep`). */
    const mountedRef = useRef(true)
    useEffect(() => () => { mountedRef.current = false }, [])

    /** Wire connect / disconnect listeners (no chunk accumulation here). */
    useEffect(() => {
        const socket = contentAiSocket
        const onConnect = () => {
            console.log("[Content AI Socket] Connected.")
        }
        const onDisconnect = async (reason: string) => {
            console.log(`[Content AI Socket] Disconnected — reason: ${reason}`)
            await sleep(3000)
            if (!mountedRef.current) {
                return
            }
            setNumReconnect((prev) => prev + 1)
        }
        const onConnectError = (err: Error) => {
            console.error("[Content AI Socket] Connection error:", err.message)
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

    /** Connect (or reconnect) when auth state changes. */
    useEffect(() => {
        if (!authenticated) {
            return
        }
        if (contentAiSocket.connected) {
            contentAiSocket.disconnect()
        }
        contentAiSocket.auth = {
            token: LocalStorage.getItemAsString(
                LocalStorageId.KeycloakAccessToken,
            ),
        }
        contentAiSocket.connect()
    }, [
        authenticated,
        numReconnect,
    ])
}
