import { useEffect } from "react"
import EventEmitter2 from "eventemitter2"
import { useKeycloakZustand } from "@/hooks/zustand/keycloak"
import { setGlobalSearchResults } from "@/redux/slices/socketio"
import { useAppDispatch } from "@/redux"
import { sleep } from "@/modules/utils"
import { GlobalSearchSocketIoMessage } from "@/hooks/singleton/socketio/types"
import { SubscriptionEvent } from "@/hooks/singleton/socketio/enums"
import { useSocketIoZustand, type SocketIoStoreState } from "./useSocketIoZustand"

/** Fan-out for consumers that are not tied to this hook’s Redux wiring. */
export const autocompleteSocketIoEventEmitter = new EventEmitter2()

/**
 * Subscribes to `/autocomplete` with Keycloak `auth`, mirrors global search payloads into Redux.
 */
export const useAutocompleteSocketIo = () => {
    const keycloak = useKeycloakZustand()
    const dispatch = useAppDispatch()
    const disconnectCount = useSocketIoZustand(
        (s: SocketIoStoreState) => s.disconnectCountAutocomplete,
    )
    const incDisconnect = useSocketIoZustand(
        (s: SocketIoStoreState) => s.incrementDisconnectAutocomplete,
    )
    const getSocket = useSocketIoZustand(
        (s: SocketIoStoreState) => s.getAutocompleteSocket,
    )

    useEffect(() => {
        const socket = getSocket()
        socket.on("connect", () => {
            console.log("[Autocomplete Socket] Connected.")
        })
        socket.on(SubscriptionEvent.GlobalSearch, (message: GlobalSearchSocketIoMessage) => {
            autocompleteSocketIoEventEmitter.emit(SubscriptionEvent.GlobalSearch, message)
        })
        socket.on("disconnect", async (reason: string) => {
            console.log(`[Callback Socket] Disconnected — reason: ${reason}`)
            await sleep(1000 * (disconnectCount - 1))
            incDisconnect()
        })
        socket.on("connect_error", async (err: Error) => {
            console.error("[Callback Socket] Connection error:", err.message)
            await sleep(1000 * (disconnectCount - 1))
            incDisconnect()
        })
        return () => {
            socket.off("connect")
            socket.off("disconnect")
            socket.off("connect_error")
            socket.off(SubscriptionEvent.GlobalSearch)
        }
    }, [disconnectCount, getSocket, incDisconnect])

    useEffect(() => {
        if (!keycloak.authenticated) {
            return
        }
        const socket = getSocket()
        if (socket.connected) {
            socket.disconnect()
        }
        socket.auth = { token: keycloak.token as string }
        void socket.connect()
    }, [keycloak.authenticated, keycloak.token, disconnectCount, getSocket])

    useEffect(() => {
        const handleEvent = (message: GlobalSearchSocketIoMessage) => {
            console.log("[Autocomplete Socket] Global search results:", message)
            dispatch(setGlobalSearchResults(message))
        }
        autocompleteSocketIoEventEmitter.on(SubscriptionEvent.GlobalSearch, handleEvent)
        return () => {
            autocompleteSocketIoEventEmitter.off(SubscriptionEvent.GlobalSearch, handleEvent)
        }
    }, [dispatch])

    return getSocket()
}
