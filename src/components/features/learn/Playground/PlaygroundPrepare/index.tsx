"use client"

import React, { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { Button, Spinner, Tabs, Typography, cn } from "@heroui/react"
import { ArrowRightIcon } from "@phosphor-icons/react"
import { ExtendedTabs } from "@/components/blocks/navigation/ExtendedTabs"
import { MarkdownContent } from "@/components/blocks/rendering/MarkdownContent"
import { Callout } from "@/components/blocks/feedback/Callout"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { LabeledList } from "@/components/blocks/lists/LabeledList"
import { SurfaceListCard } from "@/components/blocks/cards/SurfaceListCard"
import { StatRibbon } from "@/components/blocks/stats/StatRibbon"
import { StatusChip } from "@/components/blocks/chips/StatusChip"
import { ReadinessChecklist, type ReadinessChecklistItem } from "@/components/blocks/feedback/ReadinessChecklist"
import { ConfirmDialog } from "@/components/blocks/feedback/ConfirmDialog"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** The operating systems the install command is offered for. */
type PrepareOs = "mac" | "win" | "linux"

/**
 * Which setup guide to render. `infra` labs (Docker/K8s) install a CLI engine
 * then pair the agent; `ollama` (the RAG lab) additionally installs Ollama and
 * pulls the embedding + generation models sized to the machine's VRAM.
 */
export type PrepareFlavor = "infra" | "ollama"

/** OS tab ids in display order, each paired with its i18n label key suffix. */
const OS_TABS: ReadonlyArray<{ id: PrepareOs; labelKey: string }> = [
    { id: "mac", labelKey: "playground.prepare.osMac" },
    { id: "win", labelKey: "playground.prepare.osWin" },
    { id: "linux", labelKey: "playground.prepare.osLinux" },
]

/**
 * How long a check button stays busy. The probe answers over the socket
 * (`env:report`), not a promise, so the button holds a bounded busy window —
 * long enough to read as "it did something", short enough not to feel stuck.
 */
const CHECK_FEEDBACK_MS = 1500

/** The embedding model every tier pulls alongside the generation model. */
const EMBEDDING_MODEL = "nomic-embed-text"

/**
 * Below this many seconds the pairing-code countdown switches from muted to a
 * danger tone. One minute is enough to still act on (paste the command, or hit
 * "lấy mã mới") but short enough that the colour change isn't crying wolf.
 */
const PAIR_CODE_URGENT_SECONDS = 60

/** The paired machine's hardware snapshot, as the agent reports it (`device:info`). */
export interface PlaygroundDeviceInfo {
    platform: string
    arch: string
    hostname: string
    cpuModel: string
    cpuCores: number
    totalMemBytes: number
    freeMemBytes: number
    gpu: string | null
    vramFreeMb?: number
    vramTotalMb?: number
}

/** Bytes → whole GB, the unit the device ribbon reads in. */
const gbOf = (bytes: number): number => Math.round(bytes / 1e9)

/**
 * `process.platform` → the name a learner recognises.
 * @param platform - Node's platform id (`win32` / `darwin` / `linux`).
 */
const platformLabel = (platform: string): string =>
    platform === "win32"
        ? "Windows"
        : platform === "darwin"
            ? "macOS"
            : platform === "linux" ? "Linux" : platform

/**
 * One ribbon cell's two-line label: category on top, detail beneath.
 * @param caption - Category name ("CPU", "RAM", …).
 * @param detail - Supporting detail line.
 */
const deviceStat = (caption: string, detail: string) => (
    <span className="flex flex-col">
        <span>{caption}</span>
        <span className="truncate">{detail}</span>
    </span>
)

/**
 * Format a remaining-seconds count as `m:ss` for the pairing-code countdown.
 * @param totalSeconds - Whole seconds left (already clamped at 0 by the caller).
 * @returns e.g. `14:03`, `0:09`.
 */
const formatCountdown = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${String(seconds).padStart(2, "0")}`
}

/**
 * Generation-model tiers, lightest first. `minVramFreeMb` is the INCLUSIVE floor
 * of free GPU VRAM (MiB) a tier needs.
 *
 * Both {@link recommendGenModel} (which builds the pull command) and the
 * "which model for my machine" table in the pull step read THIS list, so the
 * table on screen can never drift from the command we hand the learner — the
 * table exists to show the criterion behind the pick, and a table that
 * contradicted the command would be worse than no table at all.
 */
const GEN_MODEL_TIERS = [
    { minVramFreeMb: 0, model: "qwen2.5:3b", rangeKey: "playground.prepare.modelTierLow" },
    { minVramFreeMb: 4096, model: "qwen2.5-coder:7b", rangeKey: "playground.prepare.modelTierMid" },
    // 8193, not 8192: a card reporting exactly 8 GB free still gets the 7b tier.
    { minVramFreeMb: 8193, model: "qwen2.5-coder:14b", rangeKey: "playground.prepare.modelTierHigh" },
] as const

/**
 * Recommend the generation model to pull, sized to the learner's free GPU VRAM
 * so it fits in memory instead of thrashing/swapping. VRAM is in MiB (as the
 * agent's `nvidia-smi` device report gives it); a missing value means no NVIDIA
 * GPU was detected, so we fall back to the lightest model (CPU-runnable).
 *
 * @param vramFreeMb - Free GPU VRAM in MiB, or `undefined` when no GPU detected.
 * @returns The `ollama` model tag to pull for generation.
 */
export function recommendGenModel(vramFreeMb?: number): string {
    if (vramFreeMb == null) {
        return GEN_MODEL_TIERS[0].model
    }
    // annotated: `GEN_MODEL_TIERS` is `as const`, so an inferred `picked` would
    // narrow to the FIRST tier's literal and reject every heavier tier.
    let picked: string = GEN_MODEL_TIERS[0].model
    for (const tier of GEN_MODEL_TIERS) {
        if (vramFreeMb >= tier.minVramFreeMb) {
            picked = tier.model
        }
    }
    return picked
}

/** Props for the {@link PlaygroundPrepare} feature. */
export interface PlaygroundPrepareProps extends WithClassNames<undefined> {
    /**
     * Install guide per OS tab (macOS/Windows/Linux) — full markdown, already
     * resolved to the viewer's locale by the caller. Each guide is a
     * `::::accordion` of collapsible panels (package-manager route / manual
     * route / verify), NOT a single command: installing an engine needs the
     * package manager itself, prerequisites (WSL2, a minikube driver) and a
     * command-checkable verify step.
     */
    osGuides: Record<PrepareOs, string>
    /** The `npx @starciacademy/playground-<docker|k8s>-agent <code>` pairing command (per-lab package). */
    pairCommand: string
    /**
     * Seconds left before the pairing code stops being accepted, or `null` when
     * there's nothing to count down (no code yet, or the agent already paired —
     * pairing ends the code's job, the session itself does not expire).
     */
    pairingCodeSecondsLeft?: number | null
    /** True when the code shown is already refused by the gateway. */
    pairingCodeExpired?: boolean
    /** Mint a fresh session + code. Rendered as an explicit button, never automatic. */
    onRefreshPairingCode?: () => void
    /** True while a fresh code is being minted. */
    isRefreshingPairingCode?: boolean
    /** Which setup guide to render — `infra` (Docker/K8s) or `ollama` (RAG). Defaults to `ollama`. */
    flavor?: PrepareFlavor
    /** Engine this playground installs, named in the step title ("Docker", "minikube + kubectl", "Ollama"). */
    engineName?: string
    /** Live tooling probe from the agent — drives each block's chip + result line. */
    envReport?: { ready: boolean, label: string, detail?: string } | null
    /**
     * The paired machine's hardware snapshot (`device:info`), or `null` before an
     * agent reports one. Rendered as the SAME `StatRibbon` the Lab shows, so the
     * learner sees the identical "Máy của bạn" panel on both surfaces instead of a
     * thinner one-line callout here — Setup is where they decide the machine is
     * good enough, so it should show the most, not the least.
     */
    deviceInfo?: PlaygroundDeviceInfo | null
    /** Rows passed straight to {@link ReadinessChecklist}. */
    readinessItems: Array<ReadinessChecklistItem>
    /** Whether the "Bắt đầu playground" button is enabled. */
    allReady: boolean
    /** Enter the workspace once the machine is ready. */
    onEnter: () => void
    /**
     * Re-probe the machine for a step's "check" button. The caller owns what a
     * probe means (ask the agent to report, refetch Ollama status, …); this
     * component only surfaces the trigger.
     */
    onVerify?: () => void
}

/**
 * Step-0 onboarding gate a learner sees before the RAG playground's hands-on
 * steps: a left guide pane walking the three setup commands (install Ollama →
 * pull models → pair the StarCi Agent) and a right status pane with a live
 * {@link ReadinessChecklist} + the "enter workspace" CTA. Purely presentational
 * — every value (commands, readiness, `allReady`) arrives via props so a later
 * phase can feed it real socket data without touching this component.
 *
 * A READING column of stacked labeled sections (mirroring the Flashcards hub),
 * NOT the Lab's full-bleed 2-pane work surface — Setup is read-and-prepare.
 * Because every command sits inside a `LabeledCard` (`bg-surface`), the code
 * blocks render NON-elevated (recessed well); a raised card here would be
 * surface-in-surface (axis-1 §16).
 *
 * @param props - See {@link PlaygroundPrepareProps}.
 *
 * @see Story: .storybook/stories/features/learn/Playground/PlaygroundPrepare/PlaygroundPrepare.stories
 */
export const PlaygroundPrepare = ({
    osGuides,
    pairCommand,
    pairingCodeSecondsLeft = null,
    pairingCodeExpired = false,
    onRefreshPairingCode,
    isRefreshingPairingCode = false,
    flavor = "ollama",
    engineName,
    envReport,
    deviceInfo,
    readinessItems,
    allReady,
    onEnter,
    onVerify,
    className,
}: PlaygroundPrepareProps) => {
    const t = useTranslations()
    const [selectedOs, setSelectedOs] = useState<PrepareOs>("mac")
    /** Which step's check button is mid-probe (`null` = idle). */
    const [checking, setChecking] = useState<string | null>(null)
    /** Which step's check was REFUSED because no agent is paired (`null` = none). */
    const [checkError, setCheckError] = useState<string | null>(null)
    /**
     * Whether the "rotate the pairing code" confirmation is open. Local state (not
     * the overlay store) because this dialog belongs to THIS card, not the app —
     * same idiom as the Flashcards session's leave/end-early confirmations.
     */
    const [isConfirmingRefresh, setConfirmingRefresh] = useState(false)

    // count of rows still pending → drives the CTA hint when not all-ready.
    const pendingCount = useMemo(
        () => readinessItems.filter((item) => !item.ready).length,
        [readinessItems],
    )

    // `deviceKnown` gates the model recommendation: a recommendation is a VERDICT,
    // and before the agent reports specs we DON'T KNOW the machine (that gap — not
    // "no GPU" — is what step 3 says while unpaired). Once known, `recommendGenModel`
    // sizes the ONE generation model to the free VRAM.
    const deviceKnown = deviceInfo != null
    const recommendedGenModel = recommendGenModel(deviceInfo?.vramFreeMb)

    // one canonical code-block style (mono + slim lang header + copy); elevated so
    // the command floats up as a raised card on the left pane's bg-background canvas.
    // NOT `codeElevated`: every command here sits INSIDE a LabeledCard (bg-surface),
    // so a raised card would be surface-in-surface (axis-1 §16) — on a surface the
    // code block reads as a recessed well instead.
    const renderCommand = (command: string) => (
        <MarkdownContent markdown={`\`\`\`bash\n${command}\n\`\`\``} />
    )

    // the RAG lab needs Ollama + models; infra labs (Docker/K8s) just install a
    // CLI engine then pair — one less step and no VRAM-sized model recommendation.
    const isOllama = flavor !== "infra"

    // OS-tabbed install command block — shared by both flavors' step 1.
    const renderOsInstall = (ariaTitle: string) => (
        <>
            <ExtendedTabs
                size="sm"
                selectedKey={selectedOs}
                onSelectionChange={(key) => setSelectedOs(key as PrepareOs)}
            >
                <Tabs.ListContainer>
                    <Tabs.List aria-label={ariaTitle}>
                        {OS_TABS.map((os) => (
                            <Tabs.Tab key={os.id} id={os.id}>
                                {t(os.labelKey)}
                                <Tabs.Indicator />
                            </Tabs.Tab>
                        ))}
                    </Tabs.List>
                </Tabs.ListContainer>
            </ExtendedTabs>
            <MarkdownContent markdown={osGuides[selectedOs]} />
        </>
    )

    // Steps as DATA so each renders as an accordion panel carrying its own status
    // chip + re-check action. `readyId` points at the readiness row that PROVES the
    // step; a step with no browser-observable signal (installing a CLI engine — no
    // push reports that) carries NO chip rather than faking a green one.
    const readyById = new Map(readinessItems.map((item) => [item.id, item.ready]))

    // Which RAG models are already pulled — read straight off the readiness rows the
    // provider computed from `ollama:status`, so step 3 can DROP its suggestion once
    // there is nothing left to install ("cài rồi thì khỏi gợi ý"). A pull command
    // for a model you already have is noise, and worse, it reads as "still not done".
    const genInstalled = readyById.get("gen") === true
    const embedInstalled = readyById.get("embed") === true
    const allModelsInstalled = genInstalled && embedInstalled
    // pull ONLY what's missing — the recommended gen model and/or the shared embed
    const missingModels = [
        ...(genInstalled ? [] : [recommendedGenModel]),
        ...(embedInstalled ? [] : [EMBEDDING_MODEL]),
    ]
    const pullCommand = missingModels.map((model) => `ollama pull ${model}`).join("\n")

    // Declared HERE, above every render helper that closes over it: `renderPairBody`
    // is INVOKED while building `pairStep` below, so a declaration further down
    // would be in the temporal dead zone by then and throw at render (tsc cannot
    // see this — the read happens inside a closure).
    //
    // Checking runs THROUGH the paired agent: the browser emits `verify:now`, the
    // gateway broadcasts it into the session room, and the agent answers with a
    // fresh `env:report`. With no agent in that room the packet is dropped
    // silently — no error, no ack — so a check fired while unpaired used to show
    // a 1.5s spinner and then nothing, reading exactly like "checked, still not
    // ready" when the truth is "could not check at all". Refuse up front instead.
    const agentConnected = readyById.get("agent") === true
    const installTitle = t("playground.prepare.stepInstallNamed", {
        name: engineName ?? (isOllama ? "Ollama" : "Docker"),
    })
    const agentTitle = t("playground.prepare.stepAgentTitle")

    // ORDER: pair the agent FIRST, then install the engine.
    //
    // Every "Kiểm tra lại" runs THROUGH the agent (browser → gateway → agent →
    // `env:report`), so an engine step placed before the pairing step can never
    // verify itself — the learner installs Docker, presses check, and the only
    // honest answer the UI can give is "chưa nối được agent". Pairing needs
    // nothing but Node, so it's both the cheapest step AND the one that makes
    // every later check actually work.
    // An EXPIRED code must stop being copyable — showing a dead command with a
    // warning beside it still invites the paste, and the agent's failure then
    // reads as "agent hỏng" rather than "mã đã hết hạn". Swap the command out for
    // the one action that helps.
    /**
     * "Lấy mã mới" — available at ALL times, not only after expiry: a learner may
     * need to rotate a code they read out on a screen-share, or point the session
     * at a different machine, long before 15 minutes are up.
     *
     * `danger-soft` per button.md §4: minting a new code DESTROYS the current one
     * (and kicks whatever agent is paired to it), but it is a routine, repeatable
     * action — not a headline "delete account", so soft tint rather than solid
     * `danger`.
     *
     * Lives in the step's ACTION ROW (not its body) so it sits on one line beside
     * "Kiểm tra lại": the two used to be rendered by different branches of the
     * tree — body vs shared footer — which is why nothing could line them up.
     */
    const renderRefreshCodeButton = () => (
        <Button
            size="sm"
            variant="danger-soft"
            className="min-w-0 flex-1 sm:flex-none"
            isPending={isRefreshingPairingCode}
            // With an agent attached the new code silently orphans the one already
            // running in the learner's terminal — confirm at the moment of the press
            // instead of parking a permanent warning line in the most-inhabited state.
            onPress={() => {
                if (agentConnected) {
                    setConfirmingRefresh(true)
                    return
                }
                onRefreshPairingCode?.()
            }}
        >
            {({ isPending }) => (
                <>
                    {isPending ? <Spinner color="current" size="sm" /> : null}
                    <span className="truncate">{t("playground.prepare.pairCodeRefreshCta")}</span>
                </>
            )}
        </Button>
    )

    const renderPairBody = () => {
        // An EXPIRED code leaves no command to show — the only body left is the
        // reason, with the single rescuing action carried by the step's action row.
        if (pairingCodeExpired) {
            return (
                <Typography type="body-sm" className="text-danger-soft-foreground">
                    {t("playground.prepare.pairCodeExpired")}
                </Typography>
            )
        }
        // No code minted yet (`pairCommand` is "" until the session answers): show a
        // skeleton rather than an empty fence, so nobody copies a truncated command.
        if (!pairCommand) {
            return <Skeleton className="h-24 w-full rounded-2xl" />
        }
        return renderCommand(pairCommand)
    }

    /**
     * The pair step's meta line: countdown + the Node/terminal requirement on ONE
     * row. They used to be two stacked muted paragraphs with a button wedged
     * between them, which read as one block of noise rather than two facts.
     */
    const renderPairMeta = () => {
        const hint = t("playground.prepare.hintAgent")
        // Once paired the code has done its job (the session itself does not
        // expire), so the countdown drops out and only the requirement remains.
        if (pairingCodeSecondsLeft === null) {
            return hint
        }
        // Under a minute the countdown turns danger-toned: a muted line reads as
        // background info right up to the moment the code dies, which is exactly
        // when the learner needed to be nudged. Only the countdown half changes
        // tone — the requirement stays background information either way.
        const isUrgent = pairingCodeSecondsLeft <= PAIR_CODE_URGENT_SECONDS
        return (
            <>
                <span className={isUrgent ? "text-danger-soft-foreground" : undefined}>
                    {t("playground.prepare.pairCodeCountdown", {
                        time: formatCountdown(pairingCodeSecondsLeft),
                    })}
                </span>
                {" · "}
                {hint}
            </>
        )
    }

    const pairStep = {
        id: "pair",
        title: agentTitle,
        explain: t("playground.prepare.explainAgent"),
        body: renderPairBody(),
        // countdown + the Node/terminal requirement share one muted line
        meta: pairingCodeExpired ? undefined : renderPairMeta(),
        // rendered in the action row beside "Kiểm tra lại", never in the body
        actions: onRefreshPairingCode ? renderRefreshCodeButton() : undefined,
        readyId: "agent",
        // An expired code means pairing is IMPOSSIBLE right now, so "check again"
        // could only ever answer "chưa nối được agent" — a button that is
        // guaranteed to fail is worse than no button. Leave exactly one action:
        // get a new code.
        hideCheck: pairingCodeExpired,
    }

    // NO `meta` on the install step: the guide's own "start the engine + verify"
    // panel already says it, in more useful (command-checkable) detail — a hint
    // here just repeats it two lines below the same card.
    const setupSteps: Array<{
        id: string
        title: string
        explain: string
        body: React.ReactNode
        /** Muted line under the body (countdown / requirement); omitted when there is nothing to add. */
        meta?: React.ReactNode
        /** Extra buttons for this step's action row, rendered after the check button. */
        actions?: React.ReactNode
        readyId?: string
        /** Hide the "check again" button — see the expired-code case on `pairStep`. */
        hideCheck?: boolean
    }> = isOllama
        ? [
            pairStep,
            { id: "install", title: installTitle, explain: t("playground.prepare.explainEngineOllama"), body: renderOsInstall(installTitle), readyId: "engine" },
            {
                id: "pull",
                title: t("playground.prepare.stepPullTitle"),
                explain: t("playground.prepare.explainPull"),
                // ONE suggestion, and only while there is something to suggest:
                //  · already have both models → confirm, no command (nothing to do)
                //  · machine unknown → say the suggestion is coming (don't guess a model)
                //  · else → ONE recommended model line + the pull command for what's missing
                // (No tier table any more — once the machine is known there is exactly
                // one answer; the table was criterion-exposition for the unknown case,
                // and kept duplicating the standalone callout that used to sit above.)
                body: allModelsInstalled ? (
                    <Callout
                        status="success"
                        title={t("playground.prepare.modelsReady")}
                    />
                ) : !deviceKnown ? (
                    <Callout
                        status="default"
                        title={t("playground.prepare.pullPending")}
                    />
                ) : (
                    <div className="flex flex-col gap-3">
                        <Typography type="body-sm">
                            {t("playground.prepare.modelRecommend", { model: recommendedGenModel })}
                        </Typography>
                        {renderCommand(pullCommand)}
                    </div>
                ),
                // pulling is not enough — the engine row only goes green once Ollama
                // is SERVING and both model roles answer. Say it only while there IS a
                // command to run; once everything's installed the success line above
                // already covers it.
                meta: (deviceKnown && !allModelsInstalled) ? t("playground.prepare.hintPull") : undefined,
                readyId: "engine",
            },
        ]
        : [
            pairStep,
            { id: "install", title: installTitle, explain: t("playground.prepare.explainEngineInfra"), body: renderOsInstall(installTitle), readyId: "engine" },
        ]

    // The probe answers over the socket, so there's no promise to await — hold the
    // busy state for a bounded window (same idiom the Lab's verify button uses)
    // and let the arriving `env:report` update the chip.
    const onCheck = (id: string) => {
        if (!agentConnected) {
            setCheckError(id)
            return
        }
        setCheckError(null)
        setChecking(id)
        onVerify?.()
        window.setTimeout(() => setChecking(null), CHECK_FEEDBACK_MS)
    }

    return (
        // A READING column, not a work surface: Setup is read-and-prepare, so it
        // mirrors the Flashcards hub (stacked labeled sections) — the full-bleed
        // 2-pane belongs to the Lab route, where the learner actually works.
        <div className={cn("flex flex-col gap-6", className)}>
            {/* ── TIẾP TỤC — the page's single primary action, first thing on screen ── */}
            <LabeledCard label={t("playground.prepare.continueLabel")}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-col gap-0">
                        <Typography type="body" weight="semibold">
                            {allReady
                                ? t("playground.prepare.continueReady")
                                : t("playground.prepare.continuePending")}
                        </Typography>
                        <Typography type="body-sm" color="muted">
                            {allReady
                                ? t("playground.prepare.enterHintReady")
                                : t("playground.prepare.enterHintPending", { count: pendingCount })}
                        </Typography>
                    </div>
                    <Button
                        variant="primary"
                        size="lg"
                        isDisabled={!allReady}
                        onPress={onEnter}
                    >
                        {t("playground.prepare.enterCta")}
                        <ArrowRightIcon aria-hidden focusable="false" className="size-5" />
                    </Button>
                </div>
            </LabeledCard>

            {/* ── MÁY CỦA BẠN — the same StatRibbon the Lab renders, not a thinner
                    one-line callout. Setup is where the learner decides the machine is
                    good enough, so it should show the MOST detail, not the least; and
                    identical panels across the two surfaces mean they don't have to
                    re-read a different summary after entering. Only appears once an
                    agent has actually reported specs. */}
            {deviceInfo ? (
                <LabeledList label={t("playground.session.deviceTitle")}>
                    {/* NO `bordered`: LabeledList has no card frame, so this ribbon sits
                            TOP-LEVEL on the page canvas — top-level cards read as elevation
                            (shadow-surface), not a border (card.md §0). `bordered` is only for
                            a ribbon NESTED on another surface, where the shadow is invisible. */}
                    <StatRibbon
                        valueType="body"
                        items={[
                            {
                                key: "os",
                                value: platformLabel(deviceInfo.platform),
                                label: deviceStat(
                                    t("playground.session.deviceOs"),
                                    `${deviceInfo.arch} · ${deviceInfo.hostname}`,
                                ),
                            },
                            {
                                key: "cpu",
                                value: t("playground.session.deviceCores", { count: deviceInfo.cpuCores }),
                                label: deviceStat(t("playground.session.deviceCpu"), deviceInfo.cpuModel),
                            },
                            {
                                key: "ram",
                                value: `${gbOf(deviceInfo.totalMemBytes)} GB`,
                                label: deviceStat(
                                    t("playground.session.deviceRam"),
                                    t("playground.session.deviceRamFree", { gb: gbOf(deviceInfo.freeMemBytes) }),
                                ),
                            },
                            {
                                key: "gpu",
                                value: deviceInfo.gpu ?? "—",
                                label: deviceStat(
                                    t("playground.session.deviceGpu"),
                                    deviceInfo.vramTotalMb
                                        ? `${Math.round(deviceInfo.vramTotalMb / 1024)} GB VRAM${deviceInfo.vramFreeMb != null ? ` · ${deviceInfo.vramFreeMb} MB ${t("playground.session.deviceVramFree")}` : ""}`
                                        : deviceInfo.gpu ? "" : t("playground.session.deviceGpuUnknown"),
                                ),
                            },
                        ]}
                    />
                </LabeledList>
            ) : null}

            {/* The model recommendation used to ALSO live here as a standalone callout,
                duplicating step 3 ("Tải model"). Two surfaces recommending the same
                pull read as noise — and both kept showing after the models were already
                installed. The recommendation now lives ONLY inside step 3, where it can
                also disappear once there is nothing left to install (teacher 2026-07-20:
                "thống nhất gợi ý, 1 cái thôi · cài rồi thì khỏi gợi ý"). */}

            {/* One NAMED card per setup step — a numbered title + why it matters +
                    the commands + its own check button. Cards (not an accordion): each
                    step is a thing the learner DOES, so nothing should be hidden behind
                    a collapsed header while they work through it. */}
            {setupSteps.map((step, index) => {
                const ready = step.readyId ? readyById.get(step.readyId) : undefined
                const isChecking = checking === step.id
                const showCheck = Boolean(onVerify) && !step.hideCheck
                const hasActions = showCheck || Boolean(step.actions)
                return (
                    <LabeledCard key={step.id} label={`${index + 1}. ${step.title}`}>
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <Typography type="body-sm" color="muted">{step.explain}</Typography>
                                {ready !== undefined ? (
                                    <StatusChip tone={ready ? "success" : "neutral"}>
                                        {ready
                                            ? t("playground.prepare.readyLabel")
                                            : t("playground.prepare.pendingLabel")}
                                    </StatusChip>
                                ) : null}
                            </div>
                            {step.body}
                            {step.meta ? (
                                <Typography type="body-xs" color="muted">{step.meta}</Typography>
                            ) : null}
                            {hasActions ? (
                                <div className="flex flex-col gap-2">
                                    {/* ONE action row per step — never `flex-wrap` (button.md §6):
                                            a wrapped button drops to its own line, which is exactly
                                            the stacking this relayout removed. Narrow viewports split
                                            the width instead; from `sm` up both buttons hug. */}
                                    <div className="flex items-center gap-2">
                                        {showCheck ? (
                                            <Button
                                                size="sm"
                                                // tertiary, not secondary: no primary stands in this
                                                // cluster (the surface's only primary is "Bắt đầu
                                                // playground" in the Continue card) — button.md §1.
                                                variant="tertiary"
                                                className="min-w-0 flex-1 sm:flex-none"
                                                isPending={isChecking}
                                                onPress={() => onCheck(step.id)}
                                            >
                                                {/* Label-only when idle — a refresh glyph here just
                                                        decorated a button whose text already says exactly
                                                        what it does. The spinner stays: HeroUI `isPending`
                                                        renders NO spinner of its own, so without it the
                                                        button goes silent on press. */}
                                                {({ isPending }) => (
                                                    <>
                                                        {isPending ? <Spinner color="current" size="sm" /> : null}
                                                        <span className="truncate">
                                                            {isPending
                                                                ? t("playground.prepare.checkingCta")
                                                                : t("playground.prepare.checkCta")}
                                                        </span>
                                                    </>
                                                )}
                                            </Button>
                                        ) : null}
                                        {step.actions}
                                    </div>
                                    {/* Everything below the row is the RESULT of the last press,
                                            so it lives in one place instead of being scattered. */}
                                    {/* Refused check — say WHY, in danger tone: "chưa nối được
                                            agent" is a different problem from "đã kiểm, chưa
                                            sẵn sàng", and the learner's next move differs too
                                            (chạy npx vs mở engine). */}
                                    {checkError === step.id && !agentConnected ? (
                                        <Typography type="body-xs" className="text-danger-soft-foreground">
                                            {t("playground.prepare.checkNoAgent")}
                                        </Typography>
                                    ) : null}
                                    {step.readyId === "engine" && envReport?.detail ? (
                                        <Typography type="body-xs" color="muted">{envReport.detail}</Typography>
                                    ) : null}
                                </div>
                            ) : null}
                        </div>
                    </LabeledCard>
                )
            })}
            {/* ── TRẠNG THÁI MÁY — last section of the column, not a side panel ── */}
            <LabeledList label={t("playground.prepare.readinessHeading")}>
                {/* `bordered`: nested on the page surface, where shadow-surface can
                    render invisible (card.md §0 "GIỮ border" + `bordered` 2026-07-13). */}
                <SurfaceListCard bordered>
                    <ReadinessChecklist
                        items={readinessItems}
                        readyLabel={t("playground.prepare.readyLabel")}
                        pendingLabel={t("playground.prepare.pendingLabel")}
                    />
                </SurfaceListCard>
            </LabeledList>

            {/* Rotating the code while an agent is attached KILLS that agent, and the
                    learner must re-run `npx`. That only matters at the moment of the
                    press, so it is a confirmation rather than a line parked permanently
                    in the paired state — the state a learner sits in longest.
                    `default` tone, not `danger`: this ends a session, it does not delete
                    or undo anything. */}
            <ConfirmDialog
                isOpen={isConfirmingRefresh}
                onOpenChange={setConfirmingRefresh}
                title={t("playground.prepare.pairCodeRefreshConfirmTitle")}
                description={t("playground.prepare.pairCodeRefreshWhileConnected")}
                confirmLabel={t("playground.prepare.pairCodeRefreshCta")}
                isConfirming={isRefreshingPairingCode}
                onConfirm={() => {
                    onRefreshPairingCode?.()
                    setConfirmingRefresh(false)
                }}
            />
        </div>
    )
}

