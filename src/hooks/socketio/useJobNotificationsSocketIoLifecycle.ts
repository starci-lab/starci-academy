import { useEffect, useRef, useState } from "react"
import EventEmitter2 from "eventemitter2"
import { useAppDispatch, useAppSelector } from "@/redux"
import { useLocale } from "next-intl"
import {
    applyIncompleteJobStatus,
    setAiProcessingModalData,
    setJobStatusMessageForJob,
} from "@/redux/slices"
import type { JobStatusUpdatedSocketIoMessage } from "@/modules/types"
import {
    SubscribeJobNotificationSocketIoPayload,
} from "./types"
import { PublicationEvent, SubscriptionEvent } from "./enums"
import { jobNotificationsSocket } from "./sockets"
import { LocalStorage, LocalStorageId } from "@/modules/storage"
import { sleep } from "@/modules/utils"

/** Fan-out for listeners that are not couched in Redux. */
export const jobNotificationsSocketIoEventEmitter = new EventEmitter2()

/**
 * Lifecycle hook for the `/job_notifications` namespace — runs ONCE in {@link SocketIoSideEffects}.
 * Auto-connects on auth, subscribes incomplete jobs, fans out job status updates, and merges
 * status into Redux. Consumers do NOT call this; they use the `useJobNotificationsSocketIo`
 * accessor to get the singleton socket and `.emit()`.
 */
export const useJobNotificationsSocketIoLifecycle = () => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const dispatch = useAppDispatch()
    const incompleteJobs = useAppSelector((state) => state.job.incompleteJobs)
    const locale = useLocale()
    const [numReconnect, setNumReconnect] = useState(0)

    /** Whether still mounted — blocks setState after unmount (the `disconnect` handler runs after `await sleep`). */
    const mountedRef = useRef(true)
    useEffect(() => () => { mountedRef.current = false }, [])

    /** Wire connect / disconnect / message listeners. */
    useEffect(() => {
        const socket = jobNotificationsSocket
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
            if (!mountedRef.current) {
                return
            }
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
    }, [])

    /** Connect (or reconnect) when auth state changes. */
    useEffect(() => {
        if (!authenticated) {
            return
        }
        if (jobNotificationsSocket.connected) {
            jobNotificationsSocket.disconnect()
        }
        jobNotificationsSocket.auth = {
            token: LocalStorage.getItemAsString(
                LocalStorageId.KeycloakAccessToken,
            ),
        }
        jobNotificationsSocket.connect()
    }, [
        authenticated,
        numReconnect,
    ])

    /** Emit `SubscribeJobNotification` for each row in `incompleteJobs` (from GraphQL + Redux). */
    useEffect(() => {
        if (incompleteJobs.length === 0) {
            return
        }
        for (const item of incompleteJobs) {
            const payload: SubscribeJobNotificationSocketIoPayload = {
                data: {
                    jobId: item.jobId,
                },
                locale,
            }
            jobNotificationsSocket.emit(
                PublicationEvent.SubscribeJobNotification,
                payload,
            )
        }
    }, [
        incompleteJobs,
        locale,
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
}
