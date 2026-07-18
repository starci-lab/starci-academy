"use client"

import React, { useCallback, useEffect, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useParams, useRouter } from "next/navigation"
import {
    Button,
    Chip,
    ScrollShadow,
    Tabs,
    Typography,
} from "@heroui/react"
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    CubeIcon,
    LinkSimpleIcon,
    NetworkIcon,
    PackageIcon,
    PlugsConnectedIcon,
    TerminalWindowIcon,
} from "@phosphor-icons/react"
import { BackLink } from "@/components/blocks/navigation/BackLink"
import { ExtendedTabs } from "@/components/blocks/navigation/ExtendedTabs"
import { ConnectSheet } from "@/components/blocks/layout/ConnectSheet"
import { ErrorContent } from "@/components/blocks/async/ErrorContent"
import { EmptyContent } from "@/components/blocks/async/EmptyContent"
import { EmptyState } from "@/components/blocks/feedback/EmptyState"
import { StatusChip } from "@/components/blocks/chips/StatusChip"
import { Callout } from "@/components/blocks/feedback/Callout"
import { ListRow } from "@/components/blocks/lists/ListRow"
import { IconTile } from "@/components/blocks/identity/IconTile"
import { ProgressMeter } from "@/components/blocks/stats/ProgressMeter"
import { MarkdownContent } from "@/components/blocks/rendering/MarkdownContent"
import { RagPlayground } from "@/components/features/rag-playground/RagPlayground"
import { useAppSelector } from "@/redux/hooks"
import { pathConfig } from "@/resources/path"
import { useQueryPlaygroundSwr } from "@/hooks/swr/api/graphql/queries/useQueryPlaygroundSwr"
import { useMutateCreatePlaygroundSessionSwr } from "@/hooks/swr/api/graphql/mutations/useMutateCreatePlaygroundSessionSwr"
import { PlaygroundSessionMode } from "@/modules/api/graphql/mutations/types/create-playground-session"
import { usePlaygroundByomSocketIo } from "@/hooks/socketio/usePlaygroundByomSocketIo"

/** Right-pane workspace tab. */
type WorkspaceTab = "terminal" | "resources"

/**
 * Leading icon per reported resource kind — the backend/CLI agent report
 * FREE-FORM kind strings straight from `docker`/`kubectl` (`"Pod"`,
 * `"Container"`, `"Image"`, `"Deployment"`, `"Service"`, `"ConfigMap"`,
 * `"Node"`, ...), not a closed union — matched case-insensitively, unknown
 * kinds fall back to a generic tile so a new kind never renders blank.
 */
const RESOURCE_KIND_ICON: Record<string, React.ReactNode> = {
    pod: <CubeIcon aria-hidden focusable="false" />,
    container: <PackageIcon aria-hidden focusable="false" />,
    image: <PackageIcon aria-hidden focusable="false" />,
    deployment: <CubeIcon aria-hidden focusable="false" />,
    service: <PlugsConnectedIcon aria-hidden focusable="false" />,
    configmap: <LinkSimpleIcon aria-hidden focusable="false" />,
    node: <NetworkIcon aria-hidden focusable="false" />,
}

/** Fallback icon for a resource kind not in {@link RESOURCE_KIND_ICON}. */
const RESOURCE_KIND_FALLBACK_ICON = <CubeIcon aria-hidden focusable="false" />

/**
 * Chip color per resource status — also free-form raw text (`"Running"`,
 * `"Present"`, `"2/2 ready"`, `"ClusterIP"`, ...). A simple substring
 * heuristic ("running"/"ready"/"present"/"active" reads success) covers every
 * status the current Docker/K8s steps report; anything else stays neutral.
 */
const resourceStatusColor = (status: string): "success" | "default" => {
    const normalized = status.toLowerCase()
    if (/running|present|active|clusterip|nodeport/.test(normalized)) {
        return "success"
    }
    const readyMatch = normalized.match(/^(\d+)\/(\d+) ready$/)
    if (readyMatch && readyMatch[1] === readyMatch[2] && readyMatch[1] !== "0") {
        return "success"
    }
    return "default"
}

/**
 * Playground session — the full-bleed 2-pane hands-on work surface for one
 * course-scoped Docker/K8s exercise. LEFT: the current step's guide + a single
 * "connect your machine" flow (install command → waiting → connected) with a
 * live latency readout + a reconnect/switch-machine option. RIGHT: the
 * workspace — an {@link EmptyState} placeholder until the machine pairs, then a
 * Terminal / Resources tab strip fed by the learner's local CLI agent relayed
 * over the `/playground_byom` socket. Modeled on `PracticeProblem`'s full-bleed
 * 2-pane archetype.
 */
export const PlaygroundSession = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const params = useParams()
    const slug = String(params.slug ?? "")
    const courseDisplayId = useAppSelector((state) => state.course.displayId)

    const { data: playground, isLoading, error, mutate: refetchPlayground } = useQueryPlaygroundSwr(slug)
    const createSessionMutation = useMutateCreatePlaygroundSessionSwr()

    const [sessionId, setSessionId] = useState<string | null>(null)
    const [pairingCode, setPairingCode] = useState<string | null>(null)
    const [currentStepIndex, setCurrentStepIndex] = useState(0)
    const [workspaceTab, setWorkspaceTab] = useState<WorkspaceTab>("terminal")
    // Latches once the agent has EVER paired this session, so a later drop shows
    // "reconnect" framing (progress kept) instead of first-time "waiting" copy.
    const [everConnected, setEverConnected] = useState(false)
    // Whether the docked ConnectSheet is expanded. CONTROLLED so it auto-snaps per
    // phase (expanded while the learner must act, collapsed once connected); the
    // user can still drag/tap the sheet to override until the next phase change.
    const [sheetOpen, setSheetOpen] = useState(false)

    const { state: byomState, subscribe, sendCommand } = usePlaygroundByomSocketIo()

    const steps = playground?.steps ?? []
    const currentStep = steps[currentStepIndex]
    // `rag`-kind playgrounds swap the CLI-agent Terminal/Resources for the
    // self-contained RAG import→ask→cite widget, and walk steps MANUALLY
    // (no agent to server-verify each step) — see the kind-branch below.
    const isRag = playground?.kind === "rag"

    const pairCommand = pairingCode ? `npx @starciacademy/playground-agent ${pairingCode}` : ""

    // Render any shell command through MarkdownContent's code fence (one canonical
    // style: mono + slim lang header + copy). `elevated` picks the surface
    // treatment by CONTAINER: raised card ON the canvas (left pane, bg-background),
    // recessed well ON a surface (the ConnectSheet body, bg-surface) — an elevated
    // bg-surface card on the bg-surface sheet would be surface-in-surface (axis-1 §16).
    const renderCommand = useCallback(
        (command: string, elevated: boolean) => (
            <MarkdownContent markdown={`\`\`\`bash\n${command}\n\`\`\``} codeElevated={elevated} />
        ),
        [],
    )

    const onPrevStep = useCallback(() => {
        setCurrentStepIndex((prev) => Math.max(0, prev - 1))
    }, [])
    const onNextStep = useCallback(() => {
        setCurrentStepIndex((prev) => Math.min(steps.length - 1, prev + 1))
    }, [steps.length])

    const onLeave = useCallback(() => {
        router.push(pathConfig().locale(locale).course(courseDisplayId).learn().playground().build())
    }, [router, locale, courseDisplayId])

    const onConnectAgent = useCallback(async () => {
        if (!playground || createSessionMutation.isMutating) {
            return
        }
        // guidance level is always Guided now — the lab walks every step, so there
        // is no mode choice up front (the connect button goes straight to waiting).
        const response = await createSessionMutation.trigger({
            playgroundId: playground.id,
            mode: PlaygroundSessionMode.Guided,
        })
        const data = response.data?.createPlaygroundSession.data
        if (data) {
            setSessionId(data.id)
            setPairingCode(data.pairingCode)
            subscribe(data.id)
        }
    }, [playground, createSessionMutation, subscribe])

    // latch "has ever connected" so a later drop re-frames the install-card as a
    // reconnect (progress kept) rather than a first-time pairing.
    useEffect(() => {
        if (byomState.connected) {
            setEverConnected(true)
        }
    }, [byomState.connected])

    // auto-snap the ConnectSheet per phase: EXPAND while the learner must act
    // (session created but the machine hasn't paired — waiting / just dropped),
    // COLLAPSE in setup (no session yet) and once connected (workspace is the
    // focus). The user can drag/tap to override until the next phase change.
    useEffect(() => {
        if (isRag) {
            return
        }
        setSheetOpen(Boolean(sessionId) && !byomState.connected)
    }, [isRag, sessionId, byomState.connected])

    // advance to the step the agent just verified (server-driven, not a local guess)
    useEffect(() => {
        if (byomState.verifiedStepIndex === null) {
            return
        }
        setCurrentStepIndex((prev) => Math.max(prev, byomState.verifiedStepIndex! + 1))
    }, [byomState.verifiedStepIndex])

    const onConfirmStep = useCallback(() => {
        if (!currentStep?.commandHint || !sessionId) {
            return
        }
        sendCommand(currentStep.commandHint)
    }, [currentStep, sessionId, sendCommand])

    // The install / reconnect card — the pairing command plus its guidance. Shown
    // while waiting for the first pair AND (on demand) when the learner wants to
    // reconnect or switch machines mid-session.
    const installCard = (
        // gap-6 above the command (Callout → command) for breathing room; the
        // command + its requirement note stay tight together (gap-2).
        <div className="flex flex-col gap-6">
            <Callout
                status="accent"
                icon={<PlugsConnectedIcon aria-hidden focusable="false" />}
                title={t("playground.session.connectMachineTitle")}
                description={
                    everConnected
                        ? t("playground.session.reconnectHint")
                        : t("playground.session.pairingHint")
                }
            />
            <div className="flex flex-col gap-2">
                {/* recessed well (NOT elevated): the sheet body is bg-surface — a raised
                    card here would be surface-in-surface (axis-1 §16). */}
                {renderCommand(pairCommand, false)}
                <Typography type="body-xs" color="muted">
                    {t("playground.session.pairingRequirement")}
                </Typography>
            </div>
        </div>
    )

    // ── ConnectSheet content per phase (peek row + expanded body) ──
    // setup (no session) → neutral status + connect CTA; connected → success +
    // live latency + reconnect; waiting/dropped → warning status. The body carries
    // the intro (setup) or the pairing/reconnect install card.
    const sheetPeek = !sessionId ? (
        <div className="flex flex-wrap items-center gap-2">
            <StatusChip tone="neutral">{t("playground.session.machineNotConnected")}</StatusChip>
            <Button
                className="ml-auto"
                size="sm"
                variant="primary"
                isPending={createSessionMutation.isMutating}
                onPress={() => void onConnectAgent()}
            >
                {t("playground.session.connectAgent")}
            </Button>
        </div>
    ) : byomState.connected ? (
        <div className="flex flex-wrap items-center gap-2">
            <StatusChip tone="success">
                {byomState.latencyMs !== null
                    ? t("playground.session.agentConnectedLatency", { ms: byomState.latencyMs })
                    : t("playground.session.agentConnected")}
            </StatusChip>
            <Button
                className="ml-auto"
                size="sm"
                variant="tertiary"
                onPress={() => setSheetOpen(true)}
            >
                {t("playground.session.reconnect")}
            </Button>
        </div>
    ) : (
        <StatusChip tone="warning">
            {everConnected
                ? t("playground.session.agentDisconnected")
                : t("playground.session.agentWaiting")}
        </StatusChip>
    )

    const sheetBody = !sessionId ? (
        <Typography type="body-sm" color="muted">
            {t("playground.session.connectMachineIntro")}
        </Typography>
    ) : (
        installCard
    )

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
                <Typography type="body-sm" color="muted">
                    {t("common.loading")}
                </Typography>
            </div>
        )
    }

    // network/server error → distinct from "loading" (was falling through to a
    // stuck loading spinner forever before this fix) — retryable, no dead-end.
    if (error) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center px-6">
                <ErrorContent
                    title={t("playground.session.loadErrorTitle")}
                    description={t("playground.session.loadErrorDescription")}
                    onRetry={() => void refetchPlayground()}
                    retryLabel={t("common.retry")}
                />
            </div>
        )
    }

    // resolved successfully but no such playground (bad slug / not seeded yet)
    // → not-found, not "loading" — always an onward path, never a dead-end.
    if (!playground) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center px-6">
                <EmptyContent
                    icon={<TerminalWindowIcon aria-hidden focusable="false" className="size-8 text-muted" />}
                    title={t("playground.session.notFoundTitle")}
                    description={t("playground.session.notFoundDescription")}
                    onRetry={onLeave}
                    retryLabel={t("playground.session.backToHub")}
                />
            </div>
        )
    }

    return (
        <div className="flex h-[calc(100vh-4rem)] flex-col">
            {/* work-surface header band: back-link + progress, sticky above the panes */}
            <div className="border-b border-default bg-surface px-4 py-3 sm:px-6">
                <div className="flex items-center justify-between gap-3">
                    <BackLink label={t("playground.session.leave")} onPress={onLeave} />
                    <Typography type="body-sm" weight="medium" color="muted" className="whitespace-nowrap">
                        {t("playground.session.stepCounter", {
                            current: currentStepIndex + 1,
                            total: steps.length,
                        })}
                    </Typography>
                </div>
                <ProgressMeter
                    value={currentStepIndex + 1}
                    max={Math.max(steps.length, 1)}
                    className="mt-2"
                />
            </div>

            {/* `relative` so the docked ConnectSheet (absolute bottom) anchors here. */}
            <div className="relative grid flex-1 grid-cols-1 overflow-hidden lg:grid-cols-2">
                {/* ── LEFT: step guide + verify (connection lives in the ConnectSheet) ──
                    bg-background (page canvas): the code blocks here render as
                    RAISED cards (`codeElevated` → bg-surface + shadow) so they
                    "float up" off the canvas, instead of a recessed well that
                    would blend canvas-on-canvas (axis-1 §16). pb-24 clears the
                    collapsed sheet peek docked at the bottom. */}
                <div className="flex flex-col overflow-y-auto border-r border-default bg-background px-6 pt-5 pb-24">
                    {currentStep ? (
                        <div className="flex flex-col gap-4">
                            <Typography type="h6" weight="bold">
                                {currentStep.title}
                            </Typography>
                            <MarkdownContent markdown={currentStep.body} codeElevated />
                            {/* elevated card: the left pane is bg-background canvas → the
                                command "floats up" (axis-1 §16). */}
                            {currentStep.commandHint ? renderCommand(currentStep.commandHint, true) : null}
                            {/* rag-kind steps carry an actionHint (what to do in the widget) instead of a shell command */}
                            {currentStep.actionHint ? (
                                <div className="rounded-medium border border-dashed border-default bg-default px-3 py-2 text-sm">
                                    <MarkdownContent markdown={currentStep.actionHint} />
                                </div>
                            ) : null}

                            <div className="border-t border-default pt-4">
                                {isRag ? (
                                    // rag path: no CLI agent — the learner works in the RAG widget
                                    // on the right and walks the steps manually.
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="tertiary"
                                            isDisabled={currentStepIndex === 0}
                                            onPress={onPrevStep}
                                        >
                                            <ArrowLeftIcon aria-hidden focusable="false" className="size-4" />
                                            {t("playground.session.prevStep")}
                                        </Button>
                                        <Button
                                            variant="primary"
                                            isDisabled={currentStepIndex >= steps.length - 1}
                                            onPress={onNextStep}
                                        >
                                            {t("playground.session.nextStep")}
                                            <ArrowRightIcon aria-hidden focusable="false" className="size-4" />
                                        </Button>
                                    </div>
                                ) : byomState.connected ? (
                                    // machine paired → verify this step (connection lives in the sheet).
                                    <Button variant="primary" onPress={onConfirmStep}>
                                        {t("playground.session.confirmStep")}
                                    </Button>
                                ) : (
                                    // not connected → point to the ConnectSheet docked below.
                                    <Typography type="body-sm" color="muted">
                                        {t("playground.session.connectFromSheetHint")}
                                    </Typography>
                                )}
                            </div>
                        </div>
                    ) : (
                        <EmptyContent
                            title={t("playground.session.completeTitle")}
                            description={t("playground.session.completeDescription")}
                            onRetry={onLeave}
                            retryLabel={t("playground.session.backToHub")}
                        />
                    )}
                </div>

                {/* ── RIGHT: kind-branched workspace ──
                    ONE concept for the pre-connected state (setup + waiting + dropped):
                    a single EmptyState. The Terminal / Resources workspace only
                    appears once the machine actually pairs. bg-surface = a full
                    surface panel (the workspace reads as one solid surface, while
                    the left guide pane sits on the page canvas). */}
                <div className="flex flex-col overflow-hidden bg-surface">
                    {isRag ? (
                        // rag path: the self-contained import→ask→cite widget IS the workspace
                        <div className="h-full overflow-y-auto">
                            <RagPlayground embedded className="h-full" />
                        </div>
                    ) : !byomState.connected ? (
                        <div className="flex h-full items-center justify-center p-6">
                            <EmptyState
                                icon={<TerminalWindowIcon aria-hidden focusable="false" />}
                                title={t("playground.session.workspaceLockedTitle")}
                                description={t("playground.session.workspaceLockedHint")}
                            />
                        </div>
                    ) : (
                        <div className="flex h-full flex-col overflow-hidden">
                            {/* dashboard-style tab bar: secondary underline tabs riding on a
                                full-width baseline (border-b on the strip container). */}
                            <div className="border-b border-default px-3">
                                <ExtendedTabs
                                    selectedKey={workspaceTab}
                                    onSelectionChange={(key) => setWorkspaceTab(key as WorkspaceTab)}
                                >
                                    <Tabs.ListContainer>
                                        <Tabs.List aria-label={t("playground.session.tabsAria")}>
                                            <Tabs.Tab id="terminal">
                                                <span className="flex items-center gap-2">
                                                    <TerminalWindowIcon aria-hidden focusable="false" className="size-4 shrink-0" />
                                                    {t("playground.session.tabs.terminal")}
                                                </span>
                                                <Tabs.Indicator />
                                            </Tabs.Tab>
                                            <Tabs.Tab id="resources">
                                                <span className="flex items-center gap-2">
                                                    <CubeIcon aria-hidden focusable="false" className="size-4 shrink-0" />
                                                    {t("playground.session.tabs.resources", { count: byomState.resources.length })}
                                                </span>
                                                <Tabs.Indicator />
                                            </Tabs.Tab>
                                        </Tabs.List>
                                    </Tabs.ListContainer>
                                </ExtendedTabs>
                            </div>

                            <div className="min-h-0 flex-1 overflow-hidden p-4 pb-20">
                                {workspaceTab === "terminal" ? (
                                    <ScrollShadow hideScrollBar className="h-full overflow-y-auto rounded-2xl bg-default">
                                        {byomState.commandOutput ? (
                                            <pre className="whitespace-pre-wrap p-4 font-mono text-xs">
                                                {byomState.commandOutput}
                                            </pre>
                                        ) : (
                                            <div className="flex h-full items-center justify-center">
                                                <EmptyState
                                                    icon={<TerminalWindowIcon aria-hidden focusable="false" />}
                                                    title={t("playground.session.terminalEmptyTitle")}
                                                    description={t("playground.session.terminalEmptyDescription")}
                                                />
                                            </div>
                                        )}
                                    </ScrollShadow>
                                ) : byomState.resources.length === 0 ? (
                                    <div className="flex h-full items-center justify-center">
                                        <EmptyState
                                            icon={<LinkSimpleIcon aria-hidden focusable="false" />}
                                            title={t("playground.session.resourcesEmptyTitle")}
                                            description={t("playground.session.resourcesEmptyDescription")}
                                        />
                                    </div>
                                ) : (
                                    <ScrollShadow hideScrollBar className="flex h-full flex-col overflow-y-auto">
                                        {byomState.resources.map((resource, index) => (
                                            <ListRow
                                                key={`${resource.kind}-${resource.name}`}
                                                leading={(
                                                    <IconTile
                                                        icon={RESOURCE_KIND_ICON[resource.kind.toLowerCase()] ?? RESOURCE_KIND_FALLBACK_ICON}
                                                        tone="neutral"
                                                        size="sm"
                                                    />
                                                )}
                                                title={resource.name}
                                                subtitle={resource.kind}
                                                trailing={(
                                                    <Chip
                                                        size="sm"
                                                        variant="soft"
                                                        color={resourceStatusColor(resource.status)}
                                                    >
                                                        {resource.status}
                                                    </Chip>
                                                )}
                                                divider={index < byomState.resources.length - 1}
                                            />
                                        ))}
                                    </ScrollShadow>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── ConnectSheet: docked, draggable connection console ──
                    RAG labs need no agent → no sheet. Auto-snaps per phase; the
                    learner can drag/tap to override. */}
                {!isRag ? (
                    <ConnectSheet
                        open={sheetOpen}
                        onOpenChange={setSheetOpen}
                        toggleLabel={t("playground.session.sheetToggle")}
                        peek={sheetPeek}
                    >
                        {sheetBody}
                    </ConnectSheet>
                ) : null}
            </div>
        </div>
    )
}
