import { useRef, useEffect, useState } from "react"
import EventEmitter2 from "eventemitter2"
import { createManager } from "./utils"
import { PublicationEvent, SubscriptionEvent } from "./enums"
import { useKeycloak } from "../keycloak"
import { useAppDispatch, useAppSelector } from "@/redux"
import type { 
    JobStatusUpdatedSocketIoMessage, 
    SubscribeJobNotificationSocketIoPayload 
} from "./types"
import { useLocale } from "next-intl"
import { setJobStatusMessageForJob } from "@/redux/slices"

/** Fan-out for listeners that are not couched in Redux. */
export const jobNotificationsSocketIoEventEmitter = new EventEmitter2()

/**
 * Client for `/job_notifications` namespace: connect with Keycloak, listen for
 * `SubscriptionEvent.JobStatusUpdated`, forward to `jobNotificationsSocketIoEventEmitter`, and
 * merge payloads into `state.socketio.jobStatusByJobId` and into `state.job` for incomplete rows.
 * Emit `PublicationEvent.SubscribeJobNotification`
 * (with `locale` + `data.jobId`) before expecting updates, mirroring `useAutocompleteSocketIo`.
 */
export const useJobNotificationsSocketIo = () => {
    const socketRef = useRef(createManager().socket("/job_notifications"))
    const keycloak = useKeycloak()
    const dispatch = useAppDispatch()
    const incompleteChallengeSubmissionJobs = useAppSelector(
        (state) => state.job.incompleteChallengeSubmissionJobs,
    )
    const [disconnectCount, setDisconnectCount] = useState(0)

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
            setDisconnectCount((prev) => prev + 1)
        })
        socket.on("connect_error", (err) => {
            console.error("[Job notifications Socket] Connection error:", err.message)
            setDisconnectCount((prev) => prev + 1)
        })
        return () => {
            socket.off("connect")
            socket.off("disconnect")
            socket.off("connect_error")
            socket.off(SubscriptionEvent.JobStatusUpdated)
        }
    }, [disconnectCount])

    useEffect(() => {
        if (!keycloak.data?.authenticated) {
            return
        }
        const run = async () => {
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
        void run()
    }, [keycloak.data?.authenticated, disconnectCount])

    const locale = useLocale()
    useEffect(() => {
        if (incompleteChallengeSubmissionJobs.length === 0) {
            return
        }
        for (const item of incompleteChallengeSubmissionJobs) {
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
    }, [incompleteChallengeSubmissionJobs, locale])

    useEffect(
        () => {
            const onMessage = (message: JobStatusUpdatedSocketIoMessage) => {
                const challengeSubmissionId = message.data?.challengeSubmissionId
                const jobId = message.data?.jobId
                const status = message.data?.status
                if (!challengeSubmissionId || !jobId || !status) {
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
