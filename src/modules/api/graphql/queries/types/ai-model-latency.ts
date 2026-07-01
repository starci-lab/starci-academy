import type { GraphQLResponse } from "../../types"
import type { ModelProvider } from "../query-my-ai-settings"
import type { AiModelCategory } from "../query-ai-models"

/**
 * Public-safe latency snapshot for one AI model — its identity plus the latest
 * 1-token probe outcome. Mirrors backend `AiModelLatencyData`. Carries no raw
 * keys (per-key health stays behind the admin `aiBalancerHealth` query).
 */
export interface AiModelLatency {
    /** Concrete model name (e.g. "qwen2.5-coder:7b"). */
    name: string
    /** Provider that serves the model. */
    provider: ModelProvider
    /** Coarse cost/quality category of the model. */
    category: AiModelCategory | string
    /** Whether the latest 1-token probe succeeded. */
    ok: boolean
    /** Round-trip latency in ms for the latest probe (0 when it failed). */
    latencyMs: number
    /** ISO timestamp the latest probe completed. */
    checkedAt: string
    /** Short failure reason when the probe failed, else null. */
    errorMessage: string | null
}

/**
 * Payload inside `aiModelLatency.data` after the standard API wrapper.
 */
export interface QueryAiModelLatencyResponseData {
    /** One entry per probed model. */
    models: Array<AiModelLatency>
}

/**
 * Apollo response shape for the public `aiModelLatency` query.
 */
export interface QueryAiModelLatencyResponse {
    /** Top-level `aiModelLatency` field wrapping the standard API response. */
    aiModelLatency: GraphQLResponse<QueryAiModelLatencyResponseData>
}
