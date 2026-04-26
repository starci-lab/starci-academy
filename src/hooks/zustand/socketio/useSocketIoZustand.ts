"use client"

import { create } from "zustand"
import type { Socket } from "socket.io-client"
import { createManager } from "./utils"

/**
 * One {@link Manager} and two namespace sockets for the app (module scope), same idea as `keycloakRef` in Keycloak zustand.
 */
const manager = createManager()
const autocompleteSocket: Socket = manager.socket("/autocomplete")
const jobNotificationsSocket: Socket = manager.socket("/job_notifications")

/**
 * Shared Socket.IO zustand slice: disconnect counters + getters for namespace sockets.
 */
export interface SocketIoStoreState {
    /** Whether a long init is in progress (reserved; mirroring Keycloak store). */
    isLoading: boolean
    /** Last connection-level error (reserved). */
    error: Error | undefined
    /** Bumps when the autocomplete namespace disconnects (drives effect re-subscribe). */
    disconnectCountAutocomplete: number
    /** Bumps when the job-notifications namespace disconnects. */
    disconnectCountJob: number
    incrementDisconnectAutocomplete: () => void
    incrementDisconnectJob: () => void
    /** @returns The `/autocomplete` namespace socket. */
    getAutocompleteSocket: () => Socket
    /** @returns The `/job_notifications` namespace socket. */
    getJobNotificationsSocket: () => Socket
}

const socketIoStore = create<SocketIoStoreState>(
    (set) => ({
        isLoading: false,
        error: undefined,
        disconnectCountAutocomplete: 0,
        disconnectCountJob: 0,
        incrementDisconnectAutocomplete: () => {
            set((s) => ({
                disconnectCountAutocomplete: s.disconnectCountAutocomplete + 1,
            }))
        },
        incrementDisconnectJob: () => {
            set((s) => ({
                disconnectCountJob: s.disconnectCountJob + 1,
            }))
        },
        getAutocompleteSocket: () => autocompleteSocket,
        getJobNotificationsSocket: () => jobNotificationsSocket,
    }),
)

/**
 * Global Socket.IO zustand store — use in React or `getState()` outside React.
 */
export const useSocketIoZustand = socketIoStore
export const useSocketIoStore = socketIoStore
