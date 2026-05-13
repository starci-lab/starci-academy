import { useEffect, useRef, useCallback, useState } from "react"
import EventEmitter2 from "eventemitter2"
import { useAppDispatch, useAppSelector } from "@/redux"
import { useLocale } from "next-intl"
import { setJobStatusMessageForJob } from "@/redux/slices"
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
    const incompleteChallengeSubmissionJobs = useAppSelector(
        (state) => state.job.incompleteChallengeSubmissionJobs,
    )
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
            jobNotificationsSocketIoEventEmitter.emit(SubscriptionEvent.JobStatusUpdated, message)
        }
        const onDisconnect = async (reason: string) => {
            console.log(`[Job notifications Socket] Disconnected — reason: ${reason}`)
            // Wait a bit before reconnecting to avoid rapid reconnects
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
                LocalStorageId.KeycloakAccessToken
            ) 
        }
        socket.connect()
    }, [authenticated, getSocket, numReconnect])

    /** Re-subscribe incomplete challenge jobs when the list changes. */
    useEffect(() => {
        if (incompleteChallengeSubmissionJobs.length === 0) {
            return
        }
        const socket = getSocket()
        for (const item of incompleteChallengeSubmissionJobs) {
            const payload: SubscribeJobNotificationSocketIoPayload = {
                data: { jobId: item.jobId },
                locale,
            }
            socket.emit(PublicationEvent.SubscribeJobNotification, payload)
        }
    }, [incompleteChallengeSubmissionJobs, locale, getSocket])

    /** Merge challenge submission job status updates into Redux. */
    useEffect(
        () => {
            const onMessage = (message: JobStatusUpdatedSocketIoMessage) => {
                const challengeSubmissionId = message.data?.challengeSubmissionId
                const jobId = message.data?.jobId
                const status = message.data?.status
                const key = challengeSubmissionId || jobId
                if (!key || !jobId || !status) {
                    return
                }
                dispatch(
                    setJobStatusMessageForJob({
                        key,
                        message,
                    }),
                )
                if (key !== jobId) {
                    dispatch(
                        setJobStatusMessageForJob({
                            key: jobId,
                            message,
                        }),
                    )
                }
            }
            jobNotificationsSocketIoEventEmitter.on(SubscriptionEvent.JobStatusUpdated, onMessage)
            return () => {
                jobNotificationsSocketIoEventEmitter.off(SubscriptionEvent.JobStatusUpdated, onMessage)
            }
        },
        [dispatch],
    )

    return getSocket()
}
