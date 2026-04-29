import { useEffect } from "react"
import EventEmitter2 from "eventemitter2"
import { useAppDispatch, useAppSelector } from "@/redux"
import { useLocale } from "next-intl"
import { setJobStatusMessageForJob } from "@/redux/slices"
import {
    JobStatusUpdatedSocketIoMessage,
    SubscribeJobNotificationSocketIoPayload,
} from "./types"
import { PublicationEvent, SubscriptionEvent } from "./enums"
import { useSocketIoZustand, type SocketIoStoreState } from "./useSocketIoZustand"

/** Fan-out for listeners that are not couched in Redux. */
export const jobNotificationsSocketIoEventEmitter = new EventEmitter2()

/**
 * Client for `/job_notifications`: Keycloak `auth`, `SubscriptionEvent.JobStatusUpdated`, Redux merge.
 */
export const useJobNotificationsSocketIo = () => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const accessToken = useAppSelector((state) => state.keycloak.accessToken)
    const dispatch = useAppDispatch()
    const incompleteChallengeSubmissionJobs = useAppSelector(
        (state) => state.job.incompleteChallengeSubmissionJobs,
    )
    const locale = useLocale()
    const disconnectCount = useSocketIoZustand(
        (socketIoStoreState: SocketIoStoreState) => socketIoStoreState.disconnectCountJob,
    )
    const incDisconnect = useSocketIoZustand(
        (socketIoStoreState: SocketIoStoreState) => socketIoStoreState.incrementDisconnectJob,
    )
    const getSocket = useSocketIoZustand(
        (socketIoStoreState: SocketIoStoreState) => socketIoStoreState.getJobNotificationsSocket,
    )

    useEffect(() => {
        const socket = getSocket()
        socket.on("connect", () => {
            console.log("[Job notifications Socket] Connected.")
        })
        socket.on(SubscriptionEvent.JobStatusUpdated, (message: JobStatusUpdatedSocketIoMessage) => {
            jobNotificationsSocketIoEventEmitter.emit(SubscriptionEvent.JobStatusUpdated, message)
        })
        socket.on("disconnect", (reason) => {
            console.log(`[Job notifications Socket] Disconnected — reason: ${reason}`)
            incDisconnect()
        })
        socket.on("connect_error", (err) => {
            console.error("[Job notifications Socket] Connection error:", err.message)
            incDisconnect()
        })
        return () => {
            socket.off("connect")
            socket.off("disconnect")
            socket.off("connect_error")
            socket.off(SubscriptionEvent.JobStatusUpdated)
        }
    }, [disconnectCount, getSocket, incDisconnect])

    useEffect(() => {
        if (!authenticated || !accessToken) {
            return
        }
        const run = async () => {
            const socket = getSocket()
            if (socket.connected) {
                socket.disconnect()
            }
            socket.auth = { token: accessToken }
            socket.connect()
        }
        void run()
    }, [authenticated, accessToken, disconnectCount, getSocket])

    useEffect(() => {
        if (incompleteChallengeSubmissionJobs.length === 0) {
            return
        }
        for (const item of incompleteChallengeSubmissionJobs) {
            const payload: SubscribeJobNotificationSocketIoPayload = {
                data: { jobId: item.jobId },
                locale,
            }
            getSocket().emit(PublicationEvent.SubscribeJobNotification, payload)
        }
    }, [incompleteChallengeSubmissionJobs, locale, getSocket])

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
        },
        [dispatch],
    )

    return getSocket()
}
