"use client"
import React, { type PropsWithChildren } from "react"
import { createContext } from "react"
import { useAutocompleteSocketIo } from "./useAutocompleteSocketIo"
import { useJobNotificationsSocketIo } from "./useJobNotificationsSocketIo"

/**
 * @public
 */
export interface SocketIoContextType {
    /** Return value of {@link useAutocompleteSocketIo} (autocomplete namespace socket). */
    autocompleteSocketIo: ReturnType<typeof useAutocompleteSocketIo>
    /** Return value of {@link useJobNotificationsSocketIo} (job notifications namespace socket). */
    jobNotificationsSocketIo: ReturnType<typeof useJobNotificationsSocketIo>
}

export const SocketIoContext = createContext<SocketIoContextType | null>(null)

/**
 * Mounts both Socket.IO namespace hooks once for the app tree.
 * @param props.children - app content
 */
export const SocketIoProvider = ({ children }: PropsWithChildren) => {
    const autocompleteSocketIo = useAutocompleteSocketIo()
    const jobNotificationsSocketIo = useJobNotificationsSocketIo()
    return (
        <SocketIoContext.Provider
            value={{ autocompleteSocketIo, jobNotificationsSocketIo }}
        >
            {children}
        </SocketIoContext.Provider>
    )
}
