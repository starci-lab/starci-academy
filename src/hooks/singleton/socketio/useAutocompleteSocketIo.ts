import { useRef, useEffect } from "react"
import { createManager } from "./utils"
import EventEmitter2 from "eventemitter2"
import {
    GlobalSearchSocketIoMessage
} from "./types"
import { SubscriptionEvent } from "./enums"
import { useKeycloak } from "../keycloak"
import { setGlobalSearchResults } from "@/redux/slices/socketio"
import { useAppDispatch } from "@/redux"

// declare callback socket io event emitter
export const autocompleteSocketIoEventEmitter = new EventEmitter2()

export const useAutocompleteSocketIo = () => {
    // create socket io client
    const socketRef = useRef(createManager().socket("/autocomplete"))
    const keycloak = useKeycloak()
    const dispatch = useAppDispatch()
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
        socket.on("disconnect", (reason) => {
            console.log(`[Callback Socket] Disconnected — reason: ${reason}`)
        })
        // on connect error
        socket.on("connect_error", (err) => {
            console.error("[Callback Socket] Connection error:", err.message)
        })
        return () => {
            socket.off("connect")
            socket.off("disconnect")
            socket.off("connect_error")
            socket.off(SubscriptionEvent.GlobalSearch)
        }
    }, [])

    // if totp is verified, connect to socket io
    useEffect(() => {
        if (!keycloak.data?.authenticated) {
            return
        }
        const handleEffect = async () => {
            const socket = socketRef.current
            socket.auth = {
                token: keycloak.data?.token,
            }
            socket.connect()
        }
        handleEffect()
    }, [keycloak.data?.authenticated])

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