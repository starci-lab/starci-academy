"use client"

import { useMemo } from "react"
import useSWR from "swr"
import { querySystemHealthStatus } from "@/modules/api/graphql/queries/query-system-health-status"
import type { SystemHealthComponent } from "@/modules/api/graphql/queries/types/system-health-status"
import { HEALTH_POLL_INTERVAL_MS, HEALTH_POLL_JITTER_MS } from "../constants"

/** Per-component live health, keyed by the component `name` (matches
 *  {@link ARCHITECTURE_COMPONENTS}). */
export type HealthByName = Record<string, SystemHealthComponent>

/** Handle returned by {@link useSystemHealthPoll}. */
export interface UseSystemHealthPollResult {
    /** Live health keyed by component name, or `null` before the first resolve. */
    healthByName: HealthByName | null
    /** True while the very first probe sweep is still in flight (no data yet). */
    isLoading: boolean
    /** The last error, only meaningful when there is no cached data to fall back to. */
    error: unknown
    /** Re-run the probe sweep immediately (bypasses nothing server-side — the
     *  backend still serves its own 5s cache — but forces SWR to revalidate). */
    refresh: () => void
}

/**
 * Polls the public `systemHealthStatus` query on an interval and exposes the
 * result keyed by component name. Honesty rule (see
 * `system-map-conceptual-nodes-not-containers`): the caller must treat
 * `healthByName === null` as "checking…" (gray/pulse), NEVER as up — this hook
 * never synthesizes a status before the first real probe resolves.
 *
 * A random one-time jitter is added to the poll interval so many open tabs
 * don't all hit the backend on the exact same tick.
 */
export const useSystemHealthPoll = (): UseSystemHealthPollResult => {
    // stable per-mount jitter (not re-rolled every render)
    const jitterMs = useMemo(() => Math.floor(Math.random() * HEALTH_POLL_JITTER_MS), [])

    const { data, error, isLoading, mutate } = useSWR<HealthByName>(
        ["ARCHITECTURE_SYSTEM_HEALTH_STATUS_SWR"],
        async () => {
            const response = await querySystemHealthStatus({})
            const envelope = response.data?.systemHealthStatus
            const components = envelope?.data?.components
            if (!envelope?.success || !components) {
                throw new Error(envelope?.error ?? envelope?.message ?? "System health not found")
            }
            return Object.fromEntries(components.map((component) => [component.name, component]))
        },
        {
            refreshInterval: HEALTH_POLL_INTERVAL_MS + jitterMs,
            // keep the last good sweep on screen while the next one resolves,
            // so a slow poll never flashes back to a loading/unknown state
            keepPreviousData: true,
        },
    )

    return {
        healthByName: data ?? null,
        isLoading: isLoading && !data,
        error: !data ? error : undefined,
        refresh: () => {
            void mutate()
        },
    }
}
