"use client"

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { CircuitryIcon, CpuIcon, RobotIcon, StackIcon } from "@phosphor-icons/react"
import { SiDocker, SiKubernetes } from "react-icons/si"
// Brand marks for the RAG rows. `@lobehub/icons` is the dedicated AI-model icon
// set (Ollama, Qwen, …); the default export of each is its MONOCHROME glyph, so
// it inherits `currentColor` from the IconTile tone exactly like `SiDocker` —
// NOT the colour variant, which would fight the tile's neutral/success state.
// (No Nomic mark exists in the set, so the embedding row keeps a Phosphor glyph.)
import { Ollama, Qwen } from "@lobehub/icons"
import type { ReadinessChecklistItem } from "@/components/blocks/feedback/ReadinessChecklist"
import type { PrepareFlavor } from "@/components/features/learn/Playground/PlaygroundPrepare"
import { useQueryPlaygroundSwr } from "@/hooks/swr/api/graphql/queries/useQueryPlaygroundSwr"
import { useMutateCreatePlaygroundSessionSwr } from "@/hooks/swr/api/graphql/mutations/useMutateCreatePlaygroundSessionSwr"
import { queryMyOpenPlaygroundSession } from "@/modules/api/graphql/queries/playground"
import { PlaygroundSessionMode } from "@/modules/api/graphql/mutations/types/create-playground-session"
import { usePlaygroundByomSocketIo } from "@/hooks/socketio/usePlaygroundByomSocketIo"
import { resolveInstallGuides } from "./content"
import type { GuideLab, PrepareOs } from "./content"

export type { GuideLab, PrepareOs }

/** Everything the Setup route and the Lab route share. */
export interface PlaygroundSessionContextValue {
    /** Route slug (`docker` | `kubernetes` | `rag` | …). */
    slug: string
    /** `rag`-kind labs swap the CLI workspace for the on-device RAG widget. */
    isRag: boolean
    /** The playground + its steps, or `undefined` while loading / on error. */
    playground: ReturnType<typeof useQueryPlaygroundSwr>["data"]
    isLoading: boolean
    error: unknown
    refetchPlayground: () => void
    /** Live once the session has been created (server-issued). */
    sessionId: string | null
    /** The `npx <agent> <code>` command the learner runs to pair, `""` until the code arrives. */
    pairCommand: string
    /** Socket state pushed from the paired agent. */
    byomState: ReturnType<typeof usePlaygroundByomSocketIo>["state"]
    requestVerify: ReturnType<typeof usePlaygroundByomSocketIo>["requestVerify"]
    sendRagIndex: ReturnType<typeof usePlaygroundByomSocketIo>["sendRagIndex"]
    sendRagAsk: ReturnType<typeof usePlaygroundByomSocketIo>["sendRagAsk"]
    /** Latches on the first successful pair — later drops read as "reconnect". */
    everConnected: boolean
    /** Which Setup guide to render. */
    prepareFlavor: PrepareFlavor
    /**
     * Which lab this is. Drives the per-playground intro copy — Docker/K8s share
     * the `infra` flavor but must NOT share a description, or the Kubernetes page
     * ends up promising Docker containers.
     */
    guideLab: GuideLab
    /** Per-OS engine install guide (markdown, already resolved to the viewer's locale). */
    osGuides: Record<PrepareOs, string>
    /** Engine this lab installs, named in the Setup step title. */
    engineName: string
    /** Readiness rows, anchored to REAL socket signals only. */
    readinessItems: Array<ReadinessChecklistItem>
    /** True when every readiness row reports ready — gates entering the Lab. */
    allReady: boolean
    /**
     * Seconds until the pairing code stops being accepted, or `null` once the
     * agent has paired (the code has done its job) / before one exists.
     */
    pairingCodeSecondsLeft: number | null
    /** True when the code on screen is already refused by the gateway. */
    pairingCodeExpired: boolean
    /** Mint a fresh session + pairing code (manual, never silent). */
    refreshPairingCode: () => void
    /** True while the new-code request is in flight. */
    isRefreshingPairingCode: boolean
}

const PlaygroundSessionContext = createContext<PlaygroundSessionContextValue | null>(null)

/**
 * Read the playground session shared by the Setup (`[slug]`) and Session
 * (`[slug]/session`) routes. Throws outside the provider so a missing layout is
 * a loud error, not a silent null.
 */
export const usePlaygroundSessionContext = (): PlaygroundSessionContextValue => {
    const value = useContext(PlaygroundSessionContext)
    if (!value) {
        throw new Error("usePlaygroundSessionContext must be used inside <PlaygroundSessionProvider>")
    }
    return value
}

/**
 * Owns the ONE socket + session for a playground, mounted at
 * `playground/[slug]/layout.tsx` so it survives navigation between the Setup
 * and Lab routes.
 *
 * This is the whole reason Setup/Lab can be separate routes at all: the hook
 * used to live inside each page component, so routing between them unmounted
 * the socket and dropped `sessionId`/`pairingCode` — the learner would have had
 * to re-run `npx …` after pressing "Bắt đầu playground".
 */
export const PlaygroundSessionProvider = ({ children }: { children: React.ReactNode }) => {
    const t = useTranslations()
    const locale = useLocale()
    const params = useParams()
    const slug = String(params.slug ?? "")

    const { data: playground, isLoading, error, mutate: refetchPlayground } = useQueryPlaygroundSwr(slug)
    const createSessionMutation = useMutateCreatePlaygroundSessionSwr()

    const [sessionId, setSessionId] = useState<string | null>(null)
    const [pairingCode, setPairingCode] = useState<string | null>(null)
    /** Server-derived instant the current `pairingCode` stops being accepted. */
    const [pairingCodeExpiresAt, setPairingCodeExpiresAt] = useState<string | null>(null)
    /**
     * Ticks once a second ONLY while a live code is counting down, so the Setup
     * surface re-renders the remaining time. Stops as soon as the code expires
     * (or the agent pairs), rather than running a timer for the whole session.
     */
    const [nowMs, setNowMs] = useState(() => Date.now())
    const [everConnected, setEverConnected] = useState(false)
    // ref-latched: a failed create must not re-fire the effect every render.
    const sessionRequestedRef = useRef(false)

    const {
        state: byomState,
        subscribe,
        requestVerify,
        sendRagIndex,
        sendRagAsk,
    } = usePlaygroundByomSocketIo()

    const isRag = playground?.kind === "rag"
    // docker/k8s share the `terminal` kind, so they split by slug; each agent is
    // a separately published npm CLI.
    const isK8s = /kube|k8s/i.test(slug)
    const guideLab: GuideLab = isRag ? "rag" : isK8s ? "k8s" : "docker"
    const agentPackage = isRag
        ? "@starciacademy/playground-rag-agent"
        : isK8s
            ? "@starciacademy/playground-k8s-agent"
            : "@starciacademy/playground-docker-agent"
    const pairCommand = pairingCode ? `npx ${agentPackage} ${pairingCode}` : ""
    const engineName = isRag ? "Ollama" : isK8s ? "minikube + kubectl" : "Docker"
    // Brand mark from `react-icons` (monochrome glyph, inherits currentColor) rather
    // than a coloured `<img>` SVG — inside IconTile the tile owns the tone, so a
    // full-colour raster mark fought the tile's neutral/success state.
    const engineBrandIcon = isRag ? null : isK8s ? <SiKubernetes aria-hidden /> : <SiDocker aria-hidden />

    /** Adopt a session (resumed or freshly created) into local state + the socket room. */
    const adoptSession = useCallback((session: {
        id: string
        pairingCode: string
        pairingCodeExpiresAt: string
    }) => {
        setSessionId(session.id)
        setPairingCode(session.pairingCode)
        setPairingCodeExpiresAt(session.pairingCodeExpiresAt)
        setNowMs(Date.now())
        subscribe(session.id)
    }, [subscribe])

    const connectAgent = useCallback(async () => {
        if (!playground || createSessionMutation.isMutating) {
            return
        }
        const response = await createSessionMutation.trigger({
            playgroundId: playground.id,
            mode: PlaygroundSessionMode.Guided,
        })
        const data = response.data?.createPlaygroundSession.data
        if (data) {
            adoptSession(data)
        }
    }, [playground, createSessionMutation, adoptSession])

    // RESUME FIRST, create only as a fallback.
    //
    // Every mount used to call `createPlaygroundSession` outright, so an F5 minted
    // a brand-new session + pairing code. The agent already running in the
    // learner's terminal stayed paired to the PREVIOUS one — it kept printing
    // "Paired" while the reloaded page showed a different code and reported
    // nothing connected. Both sides truthful, mutually contradictory, and
    // impossible to diagnose from the screen. Asking the server "do I already have
    // one?" makes reload idempotent: same session, same code, countdown simply
    // resumes where it was.
    useEffect(() => {
        if (!playground || sessionId || sessionRequestedRef.current) {
            return
        }
        sessionRequestedRef.current = true
        void (async () => {
            try {
                const existing = await queryMyOpenPlaygroundSession({
                    request: {
                        playgroundId: playground.id,
                    },
                })
                const open = existing.data?.myOpenPlaygroundSession?.data
                if (open) {
                    adoptSession(open)
                    return
                }
            } catch {
                // lookup is an optimisation, never a gate — fall through and create.
            }
            await connectAgent()
        })()
    }, [playground, sessionId, connectAgent, adoptSession])

    useEffect(() => {
        if (byomState.connected) {
            setEverConnected(true)
        }
    }, [byomState.connected])

    // ── pairing-code lifetime ────────────────────────────────────────────────
    // The gateway refuses `agent:pair` past `pairingCodeExpiresAt`, so the code on
    // screen has to say so — otherwise a learner who steps away comes back, pastes
    // a dead command, and gets an error with no explanation of WHY.
    const pairingExpiresAtMs = pairingCodeExpiresAt ? Date.parse(pairingCodeExpiresAt) : null
    // Once paired, the code has done its job: the session lives on regardless, so
    // an expiry countdown would be noise (worse: it reads as "phiên sắp hết").
    const pairingCodeExpired = Boolean(
        pairingExpiresAtMs && !byomState.connected && nowMs >= pairingExpiresAtMs,
    )
    const pairingCodeSecondsLeft = pairingExpiresAtMs && !byomState.connected
        ? Math.max(0, Math.round((pairingExpiresAtMs - nowMs) / 1000))
        : null

    // tick ONLY while a live code is actually counting down — no timer once it has
    // expired or the agent has paired.
    const countingDown = Boolean(pairingExpiresAtMs) && !byomState.connected && !pairingCodeExpired
    useEffect(() => {
        if (!countingDown) {
            return
        }
        const timer = window.setInterval(() => setNowMs(Date.now()), 1000)
        return () => window.clearInterval(timer)
    }, [countingDown])

    /**
     * Mint a NEW session (and therefore a new pairing code) on demand, for when
     * the current one expired. Deliberately manual: rotating the code silently
     * under a learner who is mid-copy would leave the terminal running one code
     * while the screen shows another — the exact mismatch that is impossible to
     * self-diagnose.
     */
    const refreshPairingCode = useCallback(() => {
        void connectAgent()
    }, [connectAgent])

    // ── readiness: REAL signals only ─────────────────────────────────────────
    // The ENGINE row is driven by the agent's `env:report` probe (`docker info` /
    // `kubectl`+`minikube` / Ollama) — NOT inferred from a successful pair, because an
    // agent connects happily while the engine is stopped (hit for real during the
    // 20-step e2e: every resource snapshot came back empty while the CLI still
    // reported a version).
    const engineRow: ReadinessChecklistItem = {
        id: "engine",
        icon: engineBrandIcon ?? <CircuitryIcon aria-hidden focusable="false" />,
        // name the actual engine before the probe answers ("Docker"), not a generic
        // "công cụ trên máy" — the row is asking "đã cài Docker chưa".
        label: byomState.envReport?.label ?? engineName,
        readyDescription: byomState.envReport?.detail ?? t("playground.session.readyEngineReady"),
        // Before the probe answers, state the BAR rather than just "chưa kiểm tra".
        // For RAG that bar is higher than "installed": the agent only reports ready
        // when Ollama is SERVING and both model roles are pulled, so the generic
        // fallback hid the real requirement (models alive, not merely downloaded).
        pendingDescription: byomState.envReport?.detail
            ?? t(isRag ? "playground.ragSession.readyEnginePending" : "playground.session.readyEnginePending"),
        ready: Boolean(byomState.envReport?.ready),
    }
    const agentRow: ReadinessChecklistItem = {
        id: "agent",
        icon: <RobotIcon aria-hidden focusable="false" />,
        label: t("playground.ragSession.readyAgent"),
        readyDescription: t("playground.ragSession.readyAgentReady"),
        pendingDescription: t("playground.ragSession.readyAgentPending"),
        ready: byomState.connected,
    }
    // RAG breaks the "engine" bar into the FOUR things that have to be true, each
    // its own row: agent paired · Ollama serving · embedding model pulled ·
    // generation model pulled. (Earlier this was one collapsed `engineRow` on the
    // theory that `env:report`'s detail string already named the missing piece —
    // but a single amber chip with prose underneath makes the learner READ to find
    // what is wrong; four rows let them SEE it. Teacher call 2026-07-20.) The data
    // is already on the socket via `ollama:status` (`byomState.ollamaStatus`), so
    // this is presentation only — no new agent contract.
    const models = byomState.ollamaStatus?.models ?? []
    const serving = Boolean(byomState.ollamaStatus?.serving)
    const hasEmbedModel = models.some((model) => model.toLowerCase().includes("embed"))
    // any non-embedding tag is a generation model — matches the agent's own
    // `env:report` split, which never hard-codes a specific gen tag (it varies by VRAM)
    const hasGenModel = models.some((model) => !model.toLowerCase().includes("embed"))

    const ragOllamaRow: ReadinessChecklistItem = {
        id: "engine",
        icon: <Ollama aria-hidden focusable="false" />,
        label: t("playground.ragSession.readyServing"),
        readyDescription: t("playground.ragSession.readyServingReady"),
        pendingDescription: t("playground.ragSession.readyServingPending"),
        ready: serving,
    }
    const ragEmbedRow: ReadinessChecklistItem = {
        id: "embed",
        icon: <StackIcon aria-hidden focusable="false" />,
        label: t("playground.ragSession.readyEmbed"),
        readyDescription: t("playground.ragSession.readyEmbedReady"),
        pendingDescription: t("playground.ragSession.readyEmbedPending"),
        ready: hasEmbedModel,
    }
    const ragGenRow: ReadinessChecklistItem = {
        id: "gen",
        // the generation model IS a Qwen tag (qwen2.5 / qwen2.5-coder), so its row
        // wears the Qwen mark; the embedding row stays a Phosphor glyph because the
        // model there (nomic-embed-text) has no mark in `@lobehub/icons`.
        icon: <Qwen aria-hidden focusable="false" />,
        label: t("playground.ragSession.readyGen"),
        readyDescription: t("playground.ragSession.readyGenReady"),
        pendingDescription: t("playground.ragSession.readyGenPending"),
        ready: hasGenModel,
    }

    // AGENT first, mirroring the Setup step order: pairing is step 1 because every
    // engine check runs through the agent, so a checklist that led with the engine
    // would contradict the steps right above it (and point the learner at the one
    // row they can't turn green yet).
    const readinessItems: Array<ReadinessChecklistItem> = isRag
        ? [agentRow, ragOllamaRow, ragEmbedRow, ragGenRow]
        : [
            agentRow,
            engineRow,
            {
                id: "device",
                icon: <CpuIcon aria-hidden focusable="false" />,
                label: t("playground.session.readyDevice"),
                readyDescription: t("playground.session.readyDeviceReady"),
                pendingDescription: t("playground.session.readyDevicePending"),
                ready: byomState.deviceInfo !== null,
            },
        ]

    const value: PlaygroundSessionContextValue = {
        slug,
        isRag,
        playground,
        isLoading,
        error,
        refetchPlayground: () => void refetchPlayground(),
        sessionId,
        pairCommand,
        byomState,
        requestVerify,
        sendRagIndex,
        sendRagAsk,
        everConnected,
        prepareFlavor: isRag ? "ollama" : "infra",
        guideLab,
        osGuides: resolveInstallGuides(guideLab, locale),
        engineName,
        readinessItems,
        allReady: readinessItems.every((item) => item.ready),
        pairingCodeSecondsLeft,
        pairingCodeExpired,
        refreshPairingCode,
        isRefreshingPairingCode: createSessionMutation.isMutating,
    }

    return (
        <PlaygroundSessionContext.Provider value={value}>
            {children}
        </PlaygroundSessionContext.Provider>
    )
}
