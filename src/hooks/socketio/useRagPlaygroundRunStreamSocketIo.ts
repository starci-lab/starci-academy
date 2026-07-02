import { useCallback, useEffect, useRef, useState } from "react"
import { useLocale } from "next-intl"
import type {
    AbortRagPlaygroundRunSocketIoPayload,
    RagPlaygroundRunChunkSocketIoMessage,
    RagPlaygroundSourceChunk,
    SubscribeRagPlaygroundRunSocketIoPayload,
} from "./types"
import { PublicationEvent, SubscriptionEvent } from "./enums"
import { ragPlaygroundSocket } from "./sockets"

/** Accumulated streaming state for one RAG Playground answer. */
export interface RagPlaygroundAnswerState {
    /** Run currently being tracked, or `undefined` before the first ask. */
    runId?: string
    /** Text accumulated so far from streamed deltas. */
    text: string
    /** Whether tokens are actively streaming (false before start / after done). */
    streaming: boolean
    /** Whether the terminal chunk has arrived. */
    done: boolean
    /** Retrieved source chunks grounding the answer (set on the terminal chunk). */
    sources: Array<RagPlaygroundSourceChunk>
    /** Human-readable failure reason, set on the terminal chunk when it failed. */
    errorMessage?: string
}

const INITIAL_STATE: RagPlaygroundAnswerState = {
    text: "",
    streaming: false,
    done: false,
    sources: [],
}

/** What {@link useRagPlaygroundRunStreamSocketIo} returns to the playground page. */
export interface RagPlaygroundRunStreamControls {
    /** Accumulated state of the run currently (or most recently) tracked. */
    state: RagPlaygroundAnswerState
    /** Begin tracking a run: reset state and emit `SubscribeRagPlaygroundRun`. */
    subscribe: (runId: string) => void
    /** Emit `AbortRagPlaygroundRun` to stop an in-flight run. */
    abort: (runId: string) => void
    /** Reset back to the initial (idle) state. */
    reset: () => void
}

/**
 * Consumer hook for the PUBLIC RAG Playground answer token stream. Self-contained
 * (no global lifecycle / Redux wiring, unlike the auth-gated AI Lab hook) — connects
 * to the `/rag_playground` namespace unconditionally, mirroring
 * {@link import("./useAiModelLatency").useAiModelLatency}'s public-socket pattern.
 * State is local `useState` since this is a single standalone page (no need to
 * share the accumulated stream across components).
 */
export const useRagPlaygroundRunStreamSocketIo = (): RagPlaygroundRunStreamControls => {
    const locale = useLocale()
    const [state, setState] = useState<RagPlaygroundAnswerState>(INITIAL_STATE)
    const runIdRef = useRef<string | undefined>(undefined)

    useEffect(() => {
        const socket = ragPlaygroundSocket
        const onChunk = (message: RagPlaygroundRunChunkSocketIoMessage) => {
            const data = message.data
            if (!data || data.runId !== runIdRef.current) {
                return
            }
            setState((prev) => ({
                ...prev,
                text: prev.text + data.delta,
                streaming: !data.done,
                done: data.done,
                sources: data.sources ?? prev.sources,
                errorMessage: data.error,
            }))
        }
        // public namespace — connect without auth
        if (!socket.connected) {
            socket.connect()
        }
        socket.on(SubscriptionEvent.RagPlaygroundRunChunk, onChunk)
        return () => {
            socket.off(SubscriptionEvent.RagPlaygroundRunChunk, onChunk)
        }
    }, [])

    const subscribe = useCallback(
        (runId: string) => {
            runIdRef.current = runId
            setState({ ...INITIAL_STATE, runId, streaming: true })
            const payload: SubscribeRagPlaygroundRunSocketIoPayload = {
                data: { runId },
                locale,
            }
            ragPlaygroundSocket.emit(PublicationEvent.SubscribeRagPlaygroundRun, payload)
        },
        [locale],
    )

    const abort = useCallback(
        (runId: string) => {
            const payload: AbortRagPlaygroundRunSocketIoPayload = {
                data: { runId },
                locale,
            }
            ragPlaygroundSocket.emit(PublicationEvent.AbortRagPlaygroundRun, payload)
        },
        [locale],
    )

    const reset = useCallback(() => {
        runIdRef.current = undefined
        setState(INITIAL_STATE)
    }, [])

    return {
        state,
        subscribe,
        abort,
        reset,
    }
}
