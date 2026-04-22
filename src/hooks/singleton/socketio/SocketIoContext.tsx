"use client"
import React, { PropsWithChildren } from "react"
import { createContext } from "react"
import { useAutocompleteSocketIo } from "./useAutocompleteSocketIo"

export interface SocketIoContextType {
    autocompleteSocketIo: ReturnType<typeof useAutocompleteSocketIo>
}

export const SocketIoContext = createContext<SocketIoContextType | null>(null)

export const SocketIoProvider = ({ children }: PropsWithChildren) => {
    const autocompleteSocketIo = useAutocompleteSocketIo()
    return (
        <SocketIoContext.Provider value={
            { 
                autocompleteSocketIo,
            }
        }>
            {children}
        </SocketIoContext.Provider>
    )
}