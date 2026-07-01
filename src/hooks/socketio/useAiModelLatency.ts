import { useEffect, useMemo, useState } from "react"
import useSWR from "swr"
import { queryAiModelLatency } from "@/modules/api/graphql/queries/query-ai-model-latency"
import type { AiModelLatency } from "@/modules/api/graphql/queries/types/ai-model-latency"
import { systemHealthSocket } from "./sockets"
import { SubscriptionEvent } from "./enums"

/** Latest probe outcome for one model — drives the picker health chip. */
export interface ModelHealth {
    /** Whether the latest 1-token probe succeeded. */
    ok: boolean
    /** Round-trip latency (ms) of the latest probe (0 when it failed). */
    latencyMs: number
    /** Short failure reason when the probe failed (shown on hover), else null. */
    errorMessage: string | null
}

/** Server → client envelope for the `AiModelHealth` broadcast (wsResponse shape). */
interface AiModelHealthSocketMessage {
    /** Standard API wrapper — the snapshot lives under `data.models`. */
    data?: {
        models?: Array<AiModelLatency>
    }
}

/**
 * Live per-model AI latency map (keyed by model name). Reads the PUBLIC
 * `aiModelLatency` snapshot once for the initial paint, then live-updates from
 * the public `/system_health` socket (`AiModelHealth` broadcast).
 *
 * Degrades SILENTLY: until the backend ships the probe feature the map is empty
 * and the picker simply renders no health chip (no error surface).
 *
 * @returns Map of model name → {@link ModelHealth} (empty when no data yet).
 */
export const useAiModelLatency = (): Map<string, ModelHealth> => {
    // initial snapshot (public, no auth); SWR key dedupes across the 3 pickers
    const { data: snapshot } = useSWR(
        ["QUERY_AI_MODEL_LATENCY_SWR"],
        async () => {
            const response = await queryAiModelLatency({})
            return response.data?.aiModelLatency?.data?.models ?? []
        },
        {
            revalidateOnFocus: false,
        },
    )

    // full snapshot pushed by the probe scheduler each cycle; overrides the SWR one
    const [live, setLive] = useState<Array<AiModelLatency> | null>(null)

    useEffect(() => {
        const socket = systemHealthSocket
        const onHealth = (message: AiModelHealthSocketMessage) => {
            if (message.data?.models) {
                setLive(message.data.models)
            }
        }
        // public namespace — connect without auth; keep it open across picker mounts
        if (!socket.connected) {
            socket.connect()
        }
        socket.on(SubscriptionEvent.AiModelHealth, onHealth)
        return () => {
            socket.off(SubscriptionEvent.AiModelHealth, onHealth)
        }
    }, [])

    return useMemo(() => {
        const source = live ?? snapshot ?? []
        const map = new Map<string, ModelHealth>()
        for (const model of source) {
            map.set(model.name, {
                ok: model.ok,
                latencyMs: model.latencyMs,
                errorMessage: model.errorMessage,
            })
        }
        return map
    }, [
        live,
        snapshot,
    ])
}
