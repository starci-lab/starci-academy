import { useEffect, useRef, useCallback, useState } from "react"
import EventEmitter2 from "eventemitter2"
import { useAppDispatch, useAppSelector } from "@/redux"
import { useLocale } from "next-intl"
import {
    applyIncompleteJobStatus,
    setAiProcessingModalData,
    setJobStatusMessageForJob,
} from "@/redux/slices"
import {
    JobStatusUpdatedSocketIoMessage,
    SubscribeJobNotificationSocketIoPayload,
} from "../types"
import { PublicationEvent, SubscriptionEvent } from "../enums"
import { createManager } from "../utils"
import type { Socket } from "socket.io-client"
import { LocalStorage, LocalStorageId } from "@/modules/storage"
import { sleep } from "@/modules/utils"

/** Fan-out for listeners that are not couched in Redux. */
export const jobNotificationsSocketIoEventEmitter = new EventEmitter2()

/**
 * Core Socket.IO hook for `/job_notifications` namespace.
 * Creates the manager + socket once via ref, auto-connects on auth,
 * subscribes incomplete jobs, and fans out job status updates.
 */
export const useJobNotificationsSocketIoCore = () => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const dispatch = useAppDispatch()
    const incompleteJobs = useAppSelector((state) => state.job.incompleteJobs)
    const locale = useLocale()
    const [numReconnect, setNumReconnect] = useState(0)

    /** Stable ref: manager + socket created once per component lifetime. */
    const socketRef = useRef<Socket | null>(null)
    const getSocket = useCallback((): Socket => {
        if (!socketRef.current) {
            const manager = createManager()
            socketRef.current = manager.socket("/job_notifications")
        }
        return socketRef.current
    }, [])

    /** Wire connect / disconnect / message listeners. */
    useEffect(() => {
        const socket = getSocket()
        const onConnect = () => {
            console.log("[Job notifications Socket] Connected.")
        }
        const onMessage = (message: JobStatusUpdatedSocketIoMessage) => {
            jobNotificationsSocketIoEventEmitter.emit(
                SubscriptionEvent.JobStatusUpdated,
                message,
            )
        }
        const onDisconnect = async (reason: string) => {
            console.log(`[Job notifications Socket] Disconnected — reason: ${reason}`)
            await sleep(3000)
            setNumReconnect((prev) => prev + 1)
        }
        const onConnectError = (err: Error) => {
            console.error("[Job notifications Socket] Connection error:", err.message)
        }
        socket.on("connect", onConnect)
        socket.on(SubscriptionEvent.JobStatusUpdated, onMessage)
        socket.on("disconnect", onDisconnect)
        socket.on("connect_error", onConnectError)
        return () => {
            socket.off("connect", onConnect)
            socket.off(SubscriptionEvent.JobStatusUpdated, onMessage)
            socket.off("disconnect", onDisconnect)
            socket.off("connect_error", onConnectError)
        }
    }, [getSocket])

    /** Connect (or reconnect) when auth state changes. */
    useEffect(() => {
        if (!authenticated) {
            return
        }
        const socket = getSocket()
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

    /** Emit `SubscribeJobNotification` for each row in `incompleteJobs` (from GraphQL + Redux). */
    useEffect(() => {
        if (incompleteJobs.length === 0) {
            return
        }
        const socket = getSocket()
        for (const item of incompleteJobs) {
            const payload: SubscribeJobNotificationSocketIoPayload = {
                data: {
                    jobId: item.jobId,
                },
                locale,
            }
            socket.emit(
                PublicationEvent.SubscribeJobNotification,
                payload,
            )
        }
    }, [
        incompleteJobs,
        locale,
        getSocket,
    ])

    /** Merge job status into Redux, mirror personal-project review state, and keep AI modal metadata in sync. */
    useEffect(() => {
        const onMessage = (message: JobStatusUpdatedSocketIoMessage) => {
            const jobId = message.data?.jobId
            if (!jobId) {
                return
            }
            dispatch(
                setJobStatusMessageForJob({
                    jobId,
                    message,
                }),
            )
            const status = message.data?.status
            if (status !== undefined) {
                dispatch(applyIncompleteJobStatus({ jobId, status }))
            }
            const category = message.data?.category
            if (category) {
                dispatch(
                    setAiProcessingModalData({
                        category,
                        jobId,
                    }),
                )
            }
        }
        jobNotificationsSocketIoEventEmitter.on(SubscriptionEvent.JobStatusUpdated, onMessage)
        return () => {
            jobNotificationsSocketIoEventEmitter.off(SubscriptionEvent.JobStatusUpdated, onMessage)
        }
    }, [dispatch])

    return getSocket()
}
