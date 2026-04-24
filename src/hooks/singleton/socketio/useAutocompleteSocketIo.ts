import { useRef, useEffect, useState } from "react"
import { createManager } from "./utils"
import EventEmitter2 from "eventemitter2"
import {
    GlobalSearchSocketIoMessage
} from "./types"
import { SubscriptionEvent } from "./enums"
import { useKeycloak } from "../keycloak"
import { setGlobalSearchResults } from "@/redux/slices/socketio"
import { useAppDispatch } from "@/redux"
import { sleep } from "@/modules/utils"

// declare callback socket io event emitter
export const autocompleteSocketIoEventEmitter = new EventEmitter2()

export const useAutocompleteSocketIo = () => {
    // create socket io client
    const socketRef = useRef(createManager().socket("/autocomplete"))
    const keycloak = useKeycloak()
    const dispatch = useAppDispatch()
    const [disconnectCount, setDisconnectCount] = useState(0)
    // on socket io connect
    useEffect(() => {
        const socket = socketRef.current
        // on connect
        socket.on(
            "connect", () => {
                console.log("[Autocomplete Socket] Connected.")
            }
        )
        // on confirm withdrawal
        socket.on(
            SubscriptionEvent.GlobalSearch, 
            (message: GlobalSearchSocketIoMessage) => {
                autocompleteSocketIoEventEmitter.emit(
                    SubscriptionEvent.GlobalSearch,
                    message,
                )
            }
        )
        // on disconnect
        socket.on(
            "disconnect", 
            async (reason) => {
                console.log(`[Callback Socket] Disconnected — reason: ${reason}`)
                await sleep(1000 * (disconnectCount - 1))
                setDisconnectCount((prev) => prev + 1)
            })
        // on connect error
        socket.on("connect_error", 
            async (err) => {
                console.error("[Callback Socket] Connection error:", err.message)
                await sleep(1000 * (disconnectCount - 1))
                setDisconnectCount((prev) => prev + 1)
            })
        return () => {
            socket.off("connect")
            socket.off("disconnect")
            socket.off("connect_error")
            socket.off(SubscriptionEvent.GlobalSearch)
        }
    }, [disconnectCount])

    // if totp is verified, connect to socket io
    useEffect(() => {
        if (!keycloak.data?.authenticated) {
            return
        }
        const handleEffect = async () => {
            const socket = socketRef.current
            // if connected, disconnect
            if (socket.connected) {
                socket.disconnect()
            }
            socket.auth = {
                token: keycloak.data?.token,
            }
            socket.connect()
        }
        handleEffect()
    }, [keycloak.data?.authenticated, disconnectCount])

    useEffect(() => {
        const handleEvent = (
            message: GlobalSearchSocketIoMessage
        ) => {
            console.log("[Autocomplete Socket] Global search results:", message)
            dispatch(setGlobalSearchResults(message))
        }
        autocompleteSocketIoEventEmitter.on(
            SubscriptionEvent.GlobalSearch, 
            handleEvent
        )
        return () => {
            autocompleteSocketIoEventEmitter.off(
                SubscriptionEvent.GlobalSearch, 
                handleEvent
            )
        }
    }, [dispatch])
    return socketRef.current
}