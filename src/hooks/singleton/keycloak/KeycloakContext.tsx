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
    return (
        <KeycloakContext.Provider value={{ keycloakSwr}}>
            {children}
        </KeycloakContext.Provider>
    )
}
