"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useParams, useRouter } from "next/navigation"
import {
    Button,
    Chip,
    Label,
    ScrollShadow,
    Spinner,
    Typography,
} from "@heroui/react"
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    CubeIcon,
    LinkSimpleIcon,
} from "@phosphor-icons/react"
import { ConnectSheet } from "@/components/blocks/layout/ConnectSheet"
import { EmptyContent } from "@/components/blocks/async/EmptyContent"
import { EmptyState } from "@/components/blocks/feedback/EmptyState"
import { StatusChip } from "@/components/blocks/chips/StatusChip"
import { ListRow } from "@/components/blocks/lists/ListRow"
import { LabeledAccordionCard } from "@/components/blocks/cards/LabeledAccordionCard"
import { StatRibbon } from "@/components/blocks/stats/StatRibbon"
import { MarkdownContent } from "@/components/blocks/rendering/MarkdownContent"
import { PlaygroundHeader } from "@/components/features/learn/Playground/PlaygroundHeader"
import { usePlaygroundSessionContext } from "@/components/features/learn/Playground/PlaygroundSessionProvider"
import { pathConfig } from "@/resources/path"

/** One reported resource, as the agent snapshots it. */
interface ReportedResource {
    kind: string
    name: string
    status: string
}

/**
 * Bucket a flat resource snapshot by `kind`, preserving first-seen order for
 * both the groups and the rows inside them.
 *
 * The agent reports one flat array (`Container`, `Image`, `Pod`, …); rendering
 * it flat means 50+ undifferentiated rows where the learner has to read every
 * name to find the one the step is about. Kind is the axis they scan by.
 *
 * @param resources - Flat snapshot from `resources:report`.
 * @returns Groups in first-appearance order, each with its rows.
 */
const groupResourcesByKind = (
    resources: Array<ReportedResource>,
): Array<{ kind: string, items: Array<ReportedResource> }> => {
    const groups: Array<{ kind: string, items: Array<ReportedResource> }> = []
    const byKind = new Map<string, { kind: string, items: Array<ReportedResource> }>()
    for (const resource of resources) {
        let group = byKind.get(resource.kind)
        if (!group) {
            group = { kind: resource.kind, items: [] }
            byKind.set(resource.kind, group)
            groups.push(group)
        }
        group.items.push(resource)
    }
    return groups
}

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
 * course-scoped Docker/K8s exercise. LEFT: the current step's guide (the
 * command to run in the learner's OWN terminal) + a single "connect your
 * machine" flow (connected → waiting/dropped) with a live latency readout +
 * a link back to the Setup route to reconnect/switch machine. RIGHT: the
 * workspace — an {@link EmptyState} placeholder until the machine pairs, then
 * a live Resources snapshot fed by the learner's local CLI agent relayed over
 * the `/playground_byom` socket. Modeled on `PracticeProblem`'s full-bleed
 * 2-pane archetype.
 *
 * There is deliberately NO in-browser terminal: the learner runs commands in
 * their own, and "Kiểm tra lại" asks the paired agent to re-snapshot
 * resources on demand (`verify:now`) so the step can confirm what actually
 * happened on their machine.
 *
 * The socket + session are owned by {@link usePlaygroundSessionContext} (mounted
 * at the route layout) — this component is the LAB surface only; pairing lives
 * on the Setup (`[slug]`) route.
 */
export const PlaygroundSession = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    // Course from the URL, NOT the store — playgrounds are shared by every course,
    // so a stale `state.course.displayId` navigates the learner out of theirs.
    const params = useParams()
    const courseDisplayId = String(params.courseId ?? "")

    const { playground, byomState, requestVerify, everConnected, slug } = usePlaygroundSessionContext()

    const [currentStepIndex, setCurrentStepIndex] = useState(0)
    // Whether the docked ConnectSheet is expanded. CONTROLLED so it auto-snaps per
    // connection state (expanded while the learner must wait, collapsed once
    // connected); the user can still drag/tap the sheet to override until the
    // next state change.
    const [sheetOpen, setSheetOpen] = useState(false)

    const steps = playground?.steps ?? []
    const currentStep = steps[currentStepIndex]
    // `rag`-kind playgrounds swap the CLI-agent Terminal/Resources for the
    // self-contained RAG import→ask→cite widget, and walk steps MANUALLY
    // (no agent to server-verify each step) — see the kind-branch below.
    const isRag = playground?.kind === "rag"

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

    // auto-snap the ConnectSheet per connection state: EXPAND while the learner
    // must wait (not connected yet / just dropped), COLLAPSE once connected
    // (workspace is the focus). The user can drag/tap to override until the
    // next state change.
    useEffect(() => {
        if (isRag) {
            return
        }
        setSheetOpen(!byomState.connected)
    }, [isRag, byomState.connected])

    // "checking…" while a verify request is in flight, and a "not done yet" hint
    // when it lands without advancing the step.
    const [verifying, setVerifying] = useState(false)
    const [verifyMissed, setVerifyMissed] = useState(false)

    // advance to the step the agent just verified (server-driven, not a local guess)
    useEffect(() => {
        if (byomState.verifiedStepIndex === null) {
            return
        }
        setCurrentStepIndex((prev) => Math.max(prev, byomState.verifiedStepIndex! + 1))
        // a verify landed → clear the pending / miss UI.
        setVerifying(false)
        setVerifyMissed(false)
    }, [byomState.verifiedStepIndex])

    // "Verify" = ask the agent to report resources NOW; the backend matches them to
    // the step and pushes `step:verified`. It does NOT re-run the command (the
    // learner runs that on their own machine), so clicking never triggers a
    // "container already in use" conflict.
    const onConfirmStep = useCallback(() => {
        setVerifyMissed(false)
        setVerifying(true)
        requestVerify()
    }, [requestVerify])

    // bound the "checking…" window; if the step didn't advance, hint the learner to
    // run the command first.
    useEffect(() => {
        if (!verifying) {
            return
        }
        const handle = setTimeout(() => {
            setVerifying(false)
            setVerifyMissed(true)
        }, 2500)
        return () => clearTimeout(handle)
    }, [verifying])

    // keep the agent log pinned to its newest line as it streams.
    const agentLogRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const el = agentLogRef.current
        if (el) {
            el.scrollTop = el.scrollHeight
        }
    }, [byomState.agentLog])

    // ── ConnectSheet content (peek row + expanded body) ──
    // connected → success + live latency + a link back to Setup to reconnect;
    // not connected → warning status (first-time "waiting" vs. later "dropped",
    // per `everConnected`). The body carries the device specs + agent log.
    const sheetPeek = byomState.connected ? (
        <div className="flex flex-wrap items-center gap-2">
            <StatusChip tone="success">
                {byomState.latencyMs !== null
                    ? t("playground.session.agentConnectedLatency", { ms: byomState.latencyMs })
                    : t("playground.session.agentConnected")}
            </StatusChip>
            <Button
                className="ml-auto"
                size="sm"
                variant="danger-soft"
                onPress={() => router.push(pathConfig().locale(locale).course(courseDisplayId).learn().playground(slug).build())}
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

    // ── connected body: device config tiles + agent log ──
    const gb = (bytes: number) => Math.round(bytes / 1e9)
    const platformLabel = (p: string) =>
        p === "win32" ? "Windows" : p === "darwin" ? "macOS" : p === "linux" ? "Linux" : p
    const device = byomState.deviceInfo
    // Device specs render as ONE StatRibbon (a single Card with vertical dividers —
    // the canon "ribbon"), NOT N hand-rolled tiles which read as surface-in-surface
    // on the bg-surface sheet. Each StatPair label carries the category + a detail line.
    const deviceLabel = (caption: string, detail: string) => (
        <span className="flex flex-col">
            <span>{caption}</span>
            <span className="truncate">{detail}</span>
        </span>
    )

    const connectedBody = (
        <div className="flex flex-col gap-4">
            {device ? (
                <div className="flex flex-col gap-2">
                    <Label>{t("playground.session.deviceTitle")}</Label>
                    <StatRibbon
                        bordered
                        valueType="body"
                        items={[
                            {
                                key: "os",
                                value: platformLabel(device.platform),
                                label: deviceLabel(t("playground.session.deviceOs"), `${device.arch} · ${device.hostname}`),
                            },
                            {
                                key: "cpu",
                                value: t("playground.session.deviceCores", { count: device.cpuCores }),
                                label: deviceLabel(t("playground.session.deviceCpu"), device.cpuModel),
                            },
                            {
                                key: "ram",
                                value: `${gb(device.totalMemBytes)} GB`,
                                label: deviceLabel(t("playground.session.deviceRam"), t("playground.session.deviceRamFree", { gb: gb(device.freeMemBytes) })),
                            },
                            {
                                key: "gpu",
                                value: device.gpu ?? "—",
                                label: deviceLabel(
                                    t("playground.session.deviceGpu"),
                                    device.vramTotalMb
                                        ? `${Math.round(device.vramTotalMb / 1024)} GB VRAM${device.vramFreeMb != null ? ` · ${device.vramFreeMb} MB ${t("playground.session.deviceVramFree")}` : ""}`
                                        : device.gpu ? "" : t("playground.session.deviceGpuUnknown"),
                                ),
                            },
                        ]}
                    />
                </div>
            ) : null}
            {byomState.agentLog.length > 0 ? (
                <div className="flex flex-col gap-2">
                    <Label>{t("playground.session.agentLogTitle")}</Label>
                    <div ref={agentLogRef} className="max-h-40 overflow-y-auto rounded-2xl border border-default bg-default p-3 font-mono text-xs leading-relaxed">
                        {byomState.agentLog.map((entry, index) => (
                            <div
                                key={index}
                                className={`break-words ${
                                    entry.level === "success"
                                        ? "text-success-soft-foreground"
                                        : entry.level === "warn"
                                            ? "text-warning-soft-foreground"
                                            : entry.level === "error"
                                                ? "text-danger-soft-foreground"
                                                : "text-muted"
                                }`}
                            >
                                {entry.line}
                            </div>
                        ))}
                    </div>
                </div>
            ) : null}
        </div>
    )

    // The sheet is a STATUS strip now (PA-3): machine specs + agent log while
    // connected, and a pointer back to the Setup surface when it drops — the
    // install/pair instructions live there, not duplicated here.
    const sheetBody = byomState.connected ? (
        connectedBody
    ) : (
        <Typography type="body-sm" color="muted">
            {t("playground.session.reconnectFromPrepareHint")}
        </Typography>
    )

    return (
        <div className="flex h-[calc(100vh-4rem)] flex-col">
            <PlaygroundHeader step={{ current: currentStepIndex + 1, total: steps.length }} />

            {/* `relative` so the docked ConnectSheet (absolute bottom) anchors here. */}
            <div className="relative grid flex-1 grid-cols-1 overflow-hidden @app-lg:grid-cols-2">
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
                                    // machine paired → VERIFY this step (checks resources; never re-runs
                                    // the command, so no "container already in use" conflict).
                                    <div className="flex flex-col gap-2">
                                        <Button variant="primary" isPending={verifying} onPress={onConfirmStep}>
                                            {verifying ? <Spinner size="sm" aria-hidden /> : null}
                                            {t(verifying ? "playground.session.verifying" : "playground.session.confirmStep")}
                                        </Button>
                                        {verifyMissed ? (
                                            <Typography type="body-xs" color="muted">
                                                {t("playground.session.verifyMissed")}
                                            </Typography>
                                        ) : null}
                                    </div>
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
                ONE concept for the pre-connected state (waiting + dropped):
                a single EmptyState. The Terminal / Resources workspace only
                appears once the machine actually pairs. bg-surface = a full
                surface panel (the workspace reads as one solid surface, while
                the left guide pane sits on the page canvas). */}
                <div className="flex flex-col overflow-hidden bg-surface">
                    {!byomState.connected ? (
                        <div className="flex h-full items-center justify-center p-6">
                            <EmptyState
                                icon={<CubeIcon aria-hidden focusable="false" />}
                                title={t("playground.session.workspaceLockedTitle")}
                                description={t("playground.session.workspaceLockedHint")}
                            />
                        </div>
                    ) : (
                        <div className="flex h-full flex-col overflow-hidden">
                            {/* single-pane header — no tab strip: the learner runs commands in
                            their OWN terminal, so this Resources snapshot IS the whole workspace. */}
                            <div className="flex items-center gap-2 border-b border-default px-4 py-3">
                                <CubeIcon aria-hidden focusable="false" className="size-4 shrink-0 text-muted" />
                                <Typography type="body-sm" weight="medium">
                                    {t("playground.session.tabs.resources", { count: byomState.resources.length })}
                                </Typography>
                            </div>

                            <div className="min-h-0 flex-1 overflow-hidden p-4 pb-20">
                                {byomState.resources.length === 0 ? (
                                    <div className="flex h-full items-center justify-center">
                                        <EmptyState
                                            icon={<LinkSimpleIcon aria-hidden focusable="false" />}
                                            title={t("playground.session.resourcesEmptyTitle")}
                                            description={t("playground.session.resourcesEmptyDescription")}
                                        />
                                    </div>
                                ) : (
                                    // Grouped by KIND, each group collapsible. A flat list of
                                    // every object on the machine (55+ here, mostly the
                                    // learner's own unrelated containers) is unreadable, and
                                    // the kind is the axis they actually scan by. The row also
                                    // drops the big IconTile: inside a group whose header
                                    // already names the kind, a per-row tile repeats it 20×.
                                    <ScrollShadow hideScrollBar className="flex h-full flex-col overflow-y-auto">
                                        {/* Accordion card grouped by kind. NO `label`: the header
                                                above is already the heading, so a label here is label-on-label
                                                (accordion.md §3d). `bordered` = the pane is a nested surface.
                                                The count rides in the header via `titleEnd`; each row is a
                                                ListRow inside the panel body. */}
                                        <LabeledAccordionCard
                                            bordered
                                            allowsMultipleExpanded
                                            defaultExpandedKeys={new Set(groupResourcesByKind(byomState.resources).map((group) => group.kind))}
                                            items={groupResourcesByKind(byomState.resources).map((group) => ({
                                                id: group.kind,
                                                // the kind name already says "Container / Image / Network",
                                                // so no leading glyph — it would just repeat the label
                                                title: group.kind,
                                                titleEnd: (
                                                    <Typography type="body-xs" color="muted">{group.items.length}</Typography>
                                                ),
                                                body: group.items.map((resource, index) => (
                                                    <ListRow
                                                        key={`${resource.kind}-${resource.name}`}
                                                        title={resource.name}
                                                        trailing={(
                                                            <Chip
                                                                size="sm"
                                                                variant="soft"
                                                                color={resourceStatusColor(resource.status)}
                                                            >
                                                                {resource.status}
                                                            </Chip>
                                                        )}
                                                        divider={index < group.items.length - 1}
                                                    />
                                                )),
                                            }))}
                                        />
                                    </ScrollShadow>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── ConnectSheet: docked, draggable connection console ──
                RAG labs need no agent → no sheet. Auto-snaps per connection
                state; the learner can drag/tap to override. */}
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
