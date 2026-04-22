"use client"
import React, { PropsWithChildren } from "react"
import { createContext } from "react"
import { useAutocompleteSocketIo } from "./useAutocompleteSocketIo"
import { useJobNotificationsSocketIo } from "./useJobNotificationsSocketIo"

export interface SocketIoContextType {
    autocompleteSocketIo: ReturnType<typeof useAutocompleteSocketIo>
    jobNotificationsSocketIo: ReturnType<typeof useJobNotificationsSocketIo>
}

export const SocketIoContext = createContext<SocketIoContextType | null>(null)

export const SocketIoProvider = ({ children }: PropsWithChildren) => {
    const autocompleteSocketIo = useAutocompleteSocketIo()
    const jobNotificationsSocketIo = useJobNotificationsSocketIo()
    return (
        <SocketIoContext.Provider
            value={{
                autocompleteSocketIo,
                jobNotificationsSocketIo,
            }}
        >
            {children}
        </SocketIoContext.Provider>
    )
}