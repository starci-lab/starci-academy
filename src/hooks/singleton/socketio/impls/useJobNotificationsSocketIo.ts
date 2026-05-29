import { SocketIoContext } from "../SocketIoContext"
import { use } from "react"

/**
 * Access the `/job_notifications` Socket.IO socket from {@link SocketIoContext}.
 * @returns the job-notifications socket instance.
 */
export const useJobNotificationsSocketIo = () => {
    const { jobNotificationsSocketIo } = use(SocketIoContext)!
    return jobNotificationsSocketIo
}
