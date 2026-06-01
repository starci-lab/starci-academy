import { useEffect, useRef, useCallback, useState } from "react"
import EventEmitter2 from "eventemitter2"
import { useAppSelector } from "@/redux"
import { SubscriptionEvent } from "../enums"
import { createManager } from "../utils"
import type { Socket } from "socket.io-client"
import { LocalStorage, LocalStorageId } from "@/modules/storage"
import { sleep } from "@/modules/utils"

/** Fan-out for content-discussion events to (non-Redux) component listeners. */
export const contentDiscussionSocketIoEventEmitter = new EventEmitter2()

/** The five server → client discussion events this socket forwards to the emitter. */
const FORWARDED_EVENTS: ReadonlyArray<SubscriptionEvent> = [
    SubscriptionEvent.CommentCreated,
    SubscriptionEvent.CommentUpdated,
    SubscriptionEvent.CommentDeleted,
    SubscriptionEvent.ContentReactionChanged,
    SubscriptionEvent.CommentReactionChanged,
]

/**
 * Core Socket.IO hook for the `/content_discussion` namespace.
 * Creates the manager + socket once via ref, auto-connects on auth, and fans every
 * discussion event out via {@link contentDiscussionSocketIoEventEmitter} so the per-content
 * UI can refetch. Room subscription is done by the consuming component (per content id).
 */
export const useContentDiscussionSocketIoCore = () => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const [numReconnect, setNumReconnect] = useState(0)

    /** Stable ref: manager + socket created once per component lifetime. */
    const socketRef = useRef<Socket | null>(null)
    const getSocket = useCallback((): Socket => {
        // lazily create the namespace socket on first access
        if (!socketRef.current) {
            const manager = createManager()
            socketRef.current = manager.socket("/content_discussion")
        }
        return socketRef.current
    }, [])

    /** Wire connect / disconnect / event listeners that forward to the emitter. */
    useEffect(() => {
        const socket = getSocket()
        const onConnect = () => {
            console.log("[Content discussion Socket] Connected.")
        }
        // one forwarding handler per event so the UI can listen on the emitter
        const handlers = FORWARDED_EVENTS.map((event) => {
            const handler = (message: unknown) => {
                contentDiscussionSocketIoEventEmitter.emit(event, message)
            }
            socket.on(event, handler)
            return {
                event,
                handler,
            }
        })
        const onDisconnect = async (reason: string) => {
            console.log(`[Content discussion Socket] Disconnected — reason: ${reason}`)
            // brief backoff, then bump the counter to trigger a reconnect effect
            await sleep(3000)
            setNumReconnect((prev) => prev + 1)
        }
        const onConnectError = (err: Error) => {
            console.error("[Content discussion Socket] Connection error:", err.message)
        }
        socket.on("connect", onConnect)
        socket.on("disconnect", onDisconnect)
        socket.on("connect_error", onConnectError)
        return () => {
            socket.off("connect", onConnect)
            socket.off("disconnect", onDisconnect)
            socket.off("connect_error", onConnectError)
            // detach every forwarding handler on cleanup
            handlers.forEach(({ event, handler }) => socket.off(event, handler))
        }
    }, [getSocket])

    /** Connect (or reconnect) when auth state changes. */
    useEffect(() => {
        // unauthenticated users have no token → skip connecting
        if (!authenticated) {
            return
        }
        const socket = getSocket()
        // drop any stale connection before re-auth so the handshake carries a fresh token
        if (socket.connected) {
            socket.disconnect()
        }
        socket.auth = {
            token: LocalStorage.getItemAsString(
                LocalStorageId.KeycloakAccessToken,
            ),
        }
        socket.connect()
    }, [
        authenticated,
        getSocket,
        numReconnect,
    ])

    return getSocket()
}
