"use client"
import React, { PropsWithChildren } from "react"
import { createContext } from "react"
import { useKeycloakCore } from "./core"

export interface KeycloakContextType {
    keycloakSwr: ReturnType<typeof useKeycloakCore>
}

export const KeycloakContext = createContext<KeycloakContextType | null>(null)

export const KeycloakProvider = ({ children }: PropsWithChildren) => {
    const keycloakSwr = useKeycloakCore()
    const value: KeycloakContextType = { keycloakSwr }
    return (
        <KeycloakContext.Provider value={value}>
            {children}
        </KeycloakContext.Provider>
    )
}
