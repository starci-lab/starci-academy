import type { GraphQLResponse } from "../../types"
import type { ComponentStatus } from "../enums"

/**
 * Live resource usage for one probed component's Docker container, sourced
 * from Prometheus/cAdvisor on the backend. EVERY field is independently
 * nullable: `null` means "no sample for this" (no local container to measure,
 * or Prometheus hasn't produced a sample yet) — never render a null field as
 * `0`/"N/A", just omit that line. Mirrors backend `ComponentMetricsData`.
 */
export interface ComponentMetrics {
    /** CPU usage as a percentage of ONE core — can exceed 100 on multi-core work. */
    cpuPercent: number | null
    /** Resident memory in bytes. */
    memoryUsedBytes: number | null
    /** Memory limit in bytes, or `null` when the container is unbounded. */
    memoryLimitBytes: number | null
    /** Inbound network throughput in bytes/second. */
    networkRxBytesPerSec: number | null
    /** Outbound network throughput in bytes/second. */
    networkTxBytesPerSec: number | null
}

/**
 * Liveness of one probed infrastructure component (Postgres, Redis, Kafka, …)
 * on the public status page. Mirrors backend `ComponentHealth`.
 */
export interface SystemHealthComponent {
    /** Stable component name (e.g. `postgres`, `redis`, `kafka`). */
    name: string
    /** Traffic-light status derived from reachability + latency. */
    status: ComponentStatus | string
    /** Round-trip probe latency in ms, or `null` when the probe threw. */
    latencyMs: number | null
    /** Short human-readable note — error message on failure, else `null`. */
    message: string | null
    /** ISO timestamp the probe completed (used by the client to show freshness). */
    checkedAt: string
    /** Live CPU/memory/network for this component's container, or `null` when
     *  it has no local Docker container to measure (e.g. an external SaaS). */
    metrics: ComponentMetrics | null
}

/**
 * Payload inside `systemHealthStatus.data` after the standard API wrapper.
 */
export interface QuerySystemHealthStatusResponseData {
    /** One entry per probed component, in probe order. */
    components: Array<SystemHealthComponent>
}

/**
 * Apollo response shape for the public `systemHealthStatus` query.
 */
export interface QuerySystemHealthStatusResponse {
    /** Top-level `systemHealthStatus` field wrapping the standard API response. */
    systemHealthStatus: GraphQLResponse<QuerySystemHealthStatusResponseData>
}
