"use client"
import React, { type PropsWithChildren } from "react"
import { createContext } from "react"
import { useContentDiscussionSocketIoCore, useJobNotificationsSocketIoCore } from "./core"

/**
 * @public
 */
export interface SocketIoContextType {
    /** The `/job_notifications` namespace socket. */
    jobNotificationsSocketIo: ReturnType<typeof useJobNotificationsSocketIoCore>
    /** The `/content_discussion` namespace socket. */
    contentDiscussionSocketIo: ReturnType<typeof useContentDiscussionSocketIoCore>
}

export const SocketIoContext = createContext<SocketIoContextType | null>(null)

/**
 * Mounts Socket.IO namespace hooks once for the app tree.
 * @param props.children - app content
 */
export const SocketIoProvider = ({ children }: PropsWithChildren) => {
    const jobNotificationsSocketIo = useJobNotificationsSocketIoCore()
    const contentDiscussionSocketIo = useContentDiscussionSocketIoCore()
    return (
        <SocketIoContext.Provider
            value={{ jobNotificationsSocketIo, contentDiscussionSocketIo }}
        >
            {children}
        </SocketIoContext.Provider>
    )
}
