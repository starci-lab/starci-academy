import { useRef, useEffect } from "react"
import EventEmitter2 from "eventemitter2"
import { createManager } from "./utils"
import { PublicationEvent, SubscriptionEvent } from "./enums"
import { useKeycloak } from "../keycloak"
import { useAppDispatch } from "@/redux"
import { setJobStatusMessageForJob } from "@/redux/slices/socketio"
import type { JobStatusUpdatedSocketIoMessage, SubscribeJobNotificationSocketIoPayload } from "./types"
import { useQueryIncompleteChallengeSubmissionJobsSwr } from "../swr"
import { useLocale } from "next-intl"

/** Fan-out for listeners that are not couched in Redux. */
export const jobNotificationsSocketIoEventEmitter = new EventEmitter2()

/**
 * Client for `/job_notifications` namespace: connect with Keycloak, listen for
 * `SubscriptionEvent.JobStatusUpdated`, forward to `jobNotificationsSocketIoEventEmitter`, and
 * merge payloads into `state.socketio.jobStatusByJobId`. Emit `PublicationEvent.SubscribeJobNotification`
 * (with `locale` + `data.jobId`) before expecting updates, mirroring `useAutocompleteSocketIo`.
 */
export const useJobNotificationsSocketIo = () => {
    const socketRef = useRef(createManager().socket("/job_notifications"))
    const keycloak = useKeycloak()
    const dispatch = useAppDispatch()

    useEffect(() => {
        const socket = socketRef.current
        socket.on("connect", () => {
            console.log("[Job notifications Socket] Connected.")
        })
        socket.on(
            SubscriptionEvent.JobStatusUpdated,
            (message: JobStatusUpdatedSocketIoMessage) => {
                jobNotificationsSocketIoEventEmitter.emit(
                    SubscriptionEvent.JobStatusUpdated,
                    message,
                )
            },
        )
        socket.on("disconnect", (reason) => {
            console.log(`[Job notifications Socket] Disconnected — reason: ${reason}`)
        })
        socket.on("connect_error", (err) => {
            console.error("[Job notifications Socket] Connection error:", err.message)
        })
        return () => {
            socket.off("connect")
            socket.off("disconnect")
            socket.off("connect_error")
            socket.off(SubscriptionEvent.JobStatusUpdated)
        }
    }, [])

    useEffect(() => {
        if (!keycloak.data?.authenticated) {
            return
        }
        const run = async () => {
            const socket = socketRef.current
            socket.auth = {
                token: keycloak.data?.token,
            }
            socket.connect()
        }
        void run()
    }, [keycloak.data?.authenticated])

    const swr = useQueryIncompleteChallengeSubmissionJobsSwr()
    const locale = useLocale()
    useEffect(() => {
        if (!swr.data?.items) {
            return
        }
        const items = swr.data.items
        for (const item of items) {
            const payload: SubscribeJobNotificationSocketIoPayload = {
                data: {
                    jobId: item.jobId,
                },
                locale,
            }
            socketRef.current.emit(
                PublicationEvent.SubscribeJobNotification, 
                payload,
            )
        }
    }, [swr.data?.items])

    useEffect(
        () => {
            const onMessage = (message: JobStatusUpdatedSocketIoMessage) => {
                const challengeSubmissionId = message.data?.challengeSubmissionId
                if (!challengeSubmissionId) {
                    return
                }
                dispatch(
                    setJobStatusMessageForJob({
                        challengeSubmissionId,
                        message,
                    }),
                )
            }
            jobNotificationsSocketIoEventEmitter.on(SubscriptionEvent.JobStatusUpdated, onMessage)
            return () => {
                jobNotificationsSocketIoEventEmitter.off(SubscriptionEvent.JobStatusUpdated, onMessage)
            }
        }, [dispatch])

    return socketRef.current
}
