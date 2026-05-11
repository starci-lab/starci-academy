"use client"
import React, { type PropsWithChildren } from "react"
import { createContext } from "react"
import { useJobNotificationsSocketIoCore } from "./core"

/**
 * @public
 */
export interface SocketIoContextType {
    /** The `/job_notifications` namespace socket. */
    jobNotificationsSocketIo: ReturnType<typeof useJobNotificationsSocketIoCore>
}

export const SocketIoContext = createContext<SocketIoContextType | null>(null)

/**
 * Mounts Socket.IO namespace hooks once for the app tree.
 * @param props.children - app content
 */
export const SocketIoProvider = ({ children }: PropsWithChildren) => {
    const jobNotificationsSocketIo = useJobNotificationsSocketIoCore()
    return (
        <SocketIoContext.Provider
            value={{ jobNotificationsSocketIo }}
        >
            {children}
        </SocketIoContext.Provider>
    )
}
