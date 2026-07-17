"use client"

import React, { useCallback, useEffect, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useParams, useRouter } from "next/navigation"
import {
    Button,
    Card,
    CardContent,
    Chip,
    ScrollShadow,
    Typography,
    cn,
} from "@heroui/react"
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    CopyIcon,
    CubeIcon,
    LinkSimpleIcon,
    NetworkIcon,
    PackageIcon,
    PlugsConnectedIcon,
    TerminalWindowIcon,
} from "@phosphor-icons/react"
import { BackLink } from "@/components/blocks/navigation/BackLink"
import { TabsCard } from "@/components/blocks/navigation/TabsCard"
import { SelectableCardGroup } from "@/components/blocks/navigation/SelectableCardGroup"
import { ErrorContent } from "@/components/blocks/async/ErrorContent"
import { EmptyContent } from "@/components/blocks/async/EmptyContent"
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
 * course-scoped Docker/K8s exercise. LEFT: the current step's guide + a
 * "connect agent" pairing code + a verify button. RIGHT: `TabsCard` with a
 * raw Terminal log and a live Resources list (Pod/Container/Network/Service),
 * fed by the learner's local CLI agent relayed over the `/playground_byom`
 * socket. Modeled on `PracticeProblem`'s full-bleed 2-pane archetype.
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
    // Chosen guidance level, picked BEFORE the session is created — Guided shows
    // full command hints, Free redacts them server-side (learner types commands).
    const [mode, setMode] = useState<PlaygroundSessionMode>(PlaygroundSessionMode.Guided)
    const [copied, setCopied] = useState(false)
    const [currentStepIndex, setCurrentStepIndex] = useState(0)
    const [workspaceTab, setWorkspaceTab] = useState<WorkspaceTab>("terminal")

    const { state: byomState, subscribe, sendCommand } = usePlaygroundByomSocketIo()

    const steps = playground?.steps ?? []
    const currentStep = steps[currentStepIndex]
    // `rag`-kind playgrounds swap the CLI-agent Terminal/Resources for the
    // self-contained RAG import→ask→cite widget, and walk steps MANUALLY
    // (no agent to server-verify each step) — see the kind-branch below.
    const isRag = playground?.kind === "rag"

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
        const response = await createSessionMutation.trigger({ playgroundId: playground.id, mode })
        const data = response.data?.createPlaygroundSession.data
        if (data) {
            setSessionId(data.id)
            setPairingCode(data.pairingCode)
            subscribe(data.id)
        }
    }, [playground, createSessionMutation, subscribe, mode])

    const onCopyPairingCode = useCallback(() => {
        if (!pairingCode) {
            return
        }
        void navigator.clipboard.writeText(`npx @starci/playground-agent ${pairingCode}`)
        setCopied(true)
    }, [pairingCode])

    useEffect(() => {
        if (!copied) {
            return
        }
        const handle = setTimeout(() => setCopied(false), 2000)
        return () => clearTimeout(handle)
    }, [copied])

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

    const WORKSPACE_TABS = [
        {
            key: "terminal",
            label: t("playground.session.tabs.terminal"),
            icon: <TerminalWindowIcon aria-hidden focusable="false" className="size-4" />,
        },
        {
            key: "resources",
            label: t("playground.session.tabs.resources", { count: byomState.resources.length }),
            icon: <CubeIcon aria-hidden focusable="false" className="size-4" />,
        },
    ]

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

            <div className="grid flex-1 grid-cols-1 overflow-hidden lg:grid-cols-2">
                {/* ── LEFT: step guide + connect agent + verify ── */}
                <div className="flex flex-col overflow-y-auto border-r border-default px-6 py-5">
                    {currentStep ? (
                        <div className="flex flex-col gap-4">
                            <Typography type="h6" weight="bold">
                                {currentStep.title}
                            </Typography>
                            <MarkdownContent markdown={currentStep.body} />
                            {currentStep.commandHint ? (
                                <pre className="whitespace-pre-wrap rounded-medium bg-default px-3 py-2 font-mono text-sm">
                                    {currentStep.commandHint}
                                </pre>
                            ) : null}
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
                                ) : !sessionId ? (
                                    <div className="flex flex-col gap-3">
                                        <Typography type="body-sm" weight="medium">
                                            {t("playground.session.modeTitle")}
                                        </Typography>
                                        <SelectableCardGroup
                                            ariaLabel={t("playground.session.modeAria")}
                                            value={mode}
                                            onChange={setMode}
                                            items={[
                                                {
                                                    value: PlaygroundSessionMode.Guided,
                                                    label: t("playground.session.modeGuidedLabel"),
                                                    description: t("playground.session.modeGuidedDescription"),
                                                },
                                                {
                                                    value: PlaygroundSessionMode.Free,
                                                    label: t("playground.session.modeFreeLabel"),
                                                    description: t("playground.session.modeFreeDescription"),
                                                },
                                            ]}
                                        />
                                        <Button
                                            variant="primary"
                                            isPending={createSessionMutation.isMutating}
                                            onPress={() => void onConnectAgent()}
                                        >
                                            {t("playground.session.connectAgent")}
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        {!byomState.connected ? (
                                            <div className="flex flex-col gap-2">
                                                <Typography type="body-sm" color="muted">
                                                    {t("playground.session.pairingHint")}
                                                </Typography>
                                                <div className="flex items-center gap-2 rounded-2xl bg-default px-4 py-3">
                                                    <Typography
                                                        type="h6"
                                                        weight="bold"
                                                        className="min-w-0 flex-1 truncate font-mono"
                                                    >
                                                        {`npx @starci/playground-agent ${pairingCode}`}
                                                    </Typography>
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        variant="tertiary"
                                                        aria-label={t("playground.session.copyPairingCode")}
                                                        onPress={onCopyPairingCode}
                                                    >
                                                        <CopyIcon aria-hidden focusable="false" className="size-5" />
                                                    </Button>
                                                </div>
                                                <Typography type="body-xs" color="muted">
                                                    {t("playground.session.pairingRequirement")}
                                                </Typography>
                                                {copied ? (
                                                    <Typography type="body-xs" color="muted">
                                                        {t("playground.session.copied")}
                                                    </Typography>
                                                ) : null}
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Chip size="sm" className="bg-success-soft text-success-soft-foreground">
                                                    <Chip.Label>{t("playground.session.agentConnected")}</Chip.Label>
                                                </Chip>
                                                <Button variant="primary" onPress={onConfirmStep}>
                                                    {t("playground.session.confirmStep")}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
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

                {/* ── RIGHT: kind-branched workspace ── */}
                <div className="flex flex-col overflow-hidden">
                    {isRag ? (
                        // rag path: the self-contained import→ask→cite widget IS the workspace
                        <div className="h-full overflow-y-auto">
                            <RagPlayground embedded className="h-full" />
                        </div>
                    ) : (
                        <>
                            <div className="border-b border-default px-4 py-2">
                                <TabsCard
                                    leftTabs={{
                                        items: WORKSPACE_TABS,
                                        selectedKey: workspaceTab,
                                        ariaLabel: t("playground.session.tabsAria"),
                                        onSelectionChange: (key) => setWorkspaceTab(key as WorkspaceTab),
                                    }}
                                />
                            </div>

                            <div className="flex-1 overflow-hidden p-4">
                                {workspaceTab === "terminal" ? (
                                    <ScrollShadow hideScrollBar className="h-full overflow-y-auto rounded-2xl bg-default">
                                        {byomState.commandOutput ? (
                                            <pre className="whitespace-pre-wrap p-4 font-mono text-xs">
                                                {byomState.commandOutput}
                                            </pre>
                                        ) : (
                                            <EmptyContent
                                                icon={<TerminalWindowIcon aria-hidden focusable="false" className="size-8 text-muted" />}
                                                title={t("playground.session.terminalEmptyTitle")}
                                                description={t("playground.session.terminalEmptyDescription")}
                                            />
                                        )}
                                    </ScrollShadow>
                                ) : (
                                    <Card className="h-full">
                                        <CardContent className={cn("flex h-full flex-col", byomState.resources.length === 0 && "justify-center")}>
                                            {byomState.resources.length === 0 ? (
                                                <EmptyContent
                                                    icon={<LinkSimpleIcon aria-hidden focusable="false" className="size-8 text-muted" />}
                                                    title={t("playground.session.resourcesEmptyTitle")}
                                                    description={t("playground.session.resourcesEmptyDescription")}
                                                />
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
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
