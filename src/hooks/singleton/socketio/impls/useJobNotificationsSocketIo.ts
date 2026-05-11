import { SocketIoContext } from "../SocketIoContext"
import { use } from "react"

export const useJobNotificationsSocketIo = () => {
    const { jobNotificationsSocketIo } = use(SocketIoContext)!
    return jobNotificationsSocketIo
}
