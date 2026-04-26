"use client"

import { create } from "zustand"
import type KeycloakType from "keycloak-js"
import Keycloak from "keycloak-js"
import { publicEnv } from "@/resources/env"

/**
 * The keycloak instance reference.
 */
const keycloakRef: KeycloakType = new Keycloak(
    {
        url: publicEnv().keycloak.url,
        realm: publicEnv().keycloak.realm,
        clientId: publicEnv().keycloak.clientId,
    },
)

/**
 * The keycloak store state.
 */
export interface KeycloakStoreState {
    /** Whether the user is authenticated. */
    authenticated: boolean
    /** The access token. */
    token: string | undefined
    /** Whether the client is loading. */
    isLoading: boolean
    /** The error. */
    error: Error | undefined
    /** The update token function. */
    updateToken: (minValiditySeconds: number) => Promise<boolean>
    /** The login function. */
    login: KeycloakType["login"]
    /** The logout function. */
    logout: KeycloakType["logout"]
    /** The init function. */
    init: KeycloakType["init"]
}

export const useKeycloakZustand = create<KeycloakStoreState>(
    (set) => (
        {
            /** Whether the user is authenticated. */
            authenticated: false,
            /** The access token. */
            token: undefined,
            /** Whether the client is loading. */
            isLoading: false,
            /** The error. */
            error: undefined,
            /** The update token function. */
            updateToken: async (minValiditySeconds) => {
                const refreshed = await keycloakRef.updateToken(minValiditySeconds)
                if (refreshed) {
                    set({ token: keycloakRef.token })
                }
                return refreshed
            },
            /** The login function. */
            login: async (options) => {
                return keycloakRef.login(options)
            },
            /** The logout function. */
            logout: async (options) => {
                return keycloakRef.logout(options)
            },
            /** The init function. */
            init: async (initOptions) => {
                const isAuth = await keycloakRef.init(initOptions)
                set({ authenticated: isAuth, token: keycloakRef.token })
                return isAuth
            },
        }
    ),
)
