"use client"

import React, { useState } from "react"
import type { ReactNode } from "react"
import { Tabs } from "@heroui/react"
import {
    ArrowClockwiseIcon,
    ArrowsClockwiseIcon,
} from "@phosphor-icons/react"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { EnumChip, type EnumChipEntry } from "@sb-components/composites/chips/EnumChip/EnumChip"
import { MarkdownContent } from "@sb-components/composites/viewers/MarkdownContent/MarkdownContent"
import { TabsExtended } from "@sb-components/atoms/navigation/Tabs/Tabs"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { FeedbackCallout, FeedbackConfirm } from "@sb-components/composites/feedback/Feedback/Feedback"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV, StackH } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `PlaygroundSetupSteps`: the ordered WORK of getting a playground ready
 * — pair the local agent, install the engine (an OS-tabbed guide), and — RAG
 * flavor only — pull the VRAM-sized models. Each step is its own status chip +
 * why-it-matters line + runnable command(s) + re-check action.
 *
 * ⭐ REUSE CHECK DONE FIRST (this run exists to prevent skipping it). Two sibling
 * blocks already live in `blocks/learn/Playground*` and neither is this shape:
 *   - `PlaygroundReadinessChecklist` is the compact "Trạng thái máy" GLANCE — one
 *     `SurfaceCardList` row per prerequisite (agent/engine/genModel/embedModel),
 *     ready/pending chip, nothing to DO from it. This block is the opposite job:
 *     it is what a learner opens to actually GET each prerequisite done — a
 *     command to run, an OS guide to read, a re-check button to press. Same
 *     domain, same "Sẵn sàng"/chip vocabulary reused for consistency, but a
 *     genuinely different shape (rich per-step card vs. one bounded list).
 *   - `PlaygroundConnectSheet` is the ONGOING connection console — device specs
 *     + a live agent log, for AFTER pairing already happened at least once. This
 *     block is the ONE-TIME setup guide that runs BEFORE that console has
 *     anything to show; neither reaches into the other's job.
 * `composites/navigation/Toolbar` (the two-tab-group nav) was also checked and
 * does not fit: the OS switcher here is ONE group choosing which markdown guide
 * to show underneath, not a route/content switch with a second group beside it
 * — `TabsExtended` alone (the shape `ContentModeNav`'s header warns against
 * reaching past) is the right-sized composition.
 *
 * ⭐ SURFACECARD.BASE, ONE PER STEP — not `.List`/`.Accordion`. Those two row
 * shapes are FIXED (leading/title/subtitle or a collapsible trigger+panel) and
 * neither has room for "a why-line, an OS tab row, a command block, and its own
 * action row" without degrading into a free-form blob that fights the composite's
 * own padding/divider job. `.Base`'s `label`/`action` header slots already draw
 * exactly "step title + trailing status chip" above a bare card face, so each
 * step becomes one `.Base` whose entire BODY this block composes itself.
 *
 * ⭐ TWO LEAVES, NOT ONE LEAF WITH A HIDDEN STEP (unlike `ChallengeBrief`'s "one
 * leaf, five optional sections"). `flavor` is chosen once per PLAYGROUND KIND,
 * not per render from data that might come back empty — an `infra` playground
 * never carries `genModelReady`/`recommendedGenModel` at all, so a third step
 * would either dangle on stale props or be permanently hidden noise. The task
 * brief calls this out explicitly ("2 steps for infra, 3 for ollama") and asks
 * for ONE BLOCK (not N separate step blocks) — satisfied here as one component
 * whose `flavor` branch decides whether the third `SurfaceCard` exists at all;
 * the STORY then carries two leaves, one per flavor, per §14d.2 (a step that can
 * never appear for a given caller is a structural fact, not a data condition).
 *
 * ⭐ COMMANDS RENDER THROUGH `MarkdownContent`, not a hand-rolled `<pre>`. A
 * fenced ```bash block already gets the copy button (`SnippetIcon`) and the
 * bordered/monospace chrome for free — the SAME viewer also renders the raw
 * `osGuides[os]` document (which is a full guide, not a single command), so one
 * composed part covers both "one command" and "a whole guide".
 *
 * ⚠️ `MarkdownContent`/`TabsExtended` HAVE NO `isSkeleton` OF THEIR OWN. Neither
 * composite ships a loading branch (a markdown VIEWER cannot guess at a document
 * it hasn't received; `TabsExtended` is a thin `children` wrapper with nothing
 * to shimmer on its own). Mirroring `ChallengeBrief`'s `skeletonListRows`
 * precedent (built for the identical reason on `SurfaceCardList`'s free-form
 * row), this block builds its OWN placeholder mirrors — `CommandSkeleton`
 * (the code block's border/header/line chrome, in shimmer) and `OsTabsSkeleton`
 * (a label+underline bar per OS, matching `Tabs`'s own `variant="secondary"`
 * skeleton shape) — using real `Typography isSkeleton` bars laid out with
 * `Stack.*`, never a second hand-built component pretending to BE the real one.
 * Neither mirror claims the real part's `data-anat-part` name: it is not that
 * component, so tagging it as one would be a broken link in the anatomy panel.
 *
 * ⭐ THE EMBEDDING MODEL NAME IS THIS BLOCK'S OWN CONSTANT, not a prop. Only the
 * GENERATION model varies by the learner's VRAM (`recommendedGenModel`, chosen
 * server-side once the device is known) — the embedding model is the one fixed
 * model the whole platform's RAG pipeline runs on regardless of machine, so it
 * is domain vocabulary this block owns (§14d.1), the same way `ContentModeNav`
 * owns `MODE_LABEL` or `PlaygroundReadinessChecklist` owns `KIND_ICON`.
 *
 * ⭐ ROTATING THE PAIRING CODE GATES THROUGH `FeedbackConfirm` ONLY WHEN AN AGENT
 * IS ALREADY ATTACHED (`agentReady`). Rotating while nothing is paired yet is
 * free — the old code was never in use — so it fires `onRefreshPairingCode`
 * straight away. Rotating while paired invalidates the code the connected agent
 * is currently holding, so it confirms first. `tone="default"`, not `"danger"`:
 * per this catalog's own rule ("ConfirmDialog danger chỉ delete/undo"),
 * rotating a code is disruptive-but-recoverable, not a delete/undo action.
 *
 * ⚠️ NO `isSkeleton` ON `MarkdownContent`/`FeedbackCallout`/`FeedbackConfirm`
 * WHILE LOADING. The two callouts (models-already-installed, device-unknown)
 * assert something the block has not been told yet while `isSkeleton` is true,
 * so — same reasoning as `ChallengeBrief`'s un-checked output skeleton row —
 * they simply do not render until real data lands; the confirm dialog stays
 * closed (its own local `isOpen` state starts `false`).
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** The three OS guides a `flavor="infra"`/`"ollama"` engine install can offer. */
export type PlaygroundSetupOs = "mac" | "win" | "linux"

/** Which playground kind this setup guide is for — decides the STEP COUNT (see file header). */
export type PlaygroundSetupFlavor = "infra" | "ollama"

/** Props for {@link PlaygroundSetupSteps}. */
export interface PlaygroundSetupStepsProps {
    /** `"infra"` → 2 steps (pair, install). `"ollama"` → 3 (+ pull models). */
    flavor: PlaygroundSetupFlavor
    /** Display name of the engine being installed (e.g. `"Ollama"`, `"Docker Desktop"`). Falls back to a generic "engine" when absent. */
    engineName?: string
    /** Install guide markdown, one document per OS. */
    osGuides: Record<PlaygroundSetupOs, string>
    /** The command a learner runs on their machine to pair the local agent. */
    pairCommand: string
    /** Seconds left before the current pairing code expires. `null` → no expiry countdown to show. */
    pairingCodeSecondsLeft?: number | null
    /** `true` → the code has already expired; the countdown note switches to a "làm mã mới" prompt. */
    pairingCodeExpired?: boolean
    /** Requests a fresh pairing code. Omit to hide the rotate action entirely. */
    onRefreshPairingCode?: () => void
    /** `true` → the rotate button shows a spinner and blocks further presses. */
    isRefreshingPairingCode?: boolean
    /** Whether the local agent is currently paired. Drives the pairing step's chip AND the rotate-code confirm gate. */
    agentReady: boolean
    /** Whether the engine is installed and reachable. */
    engineReady: boolean
    /** Ollama only: whether the recommended generation model is pulled. */
    genModelReady?: boolean
    /** Ollama only: whether the fixed embedding model is pulled. */
    embedModelReady?: boolean
    /** Ollama only: the generation model chosen for this device's VRAM. Absent while the device isn't known yet. */
    recommendedGenModel?: string
    /** Ollama only: `false` → the pull-models step shows a "chưa xác định cấu hình máy" callout instead of commands. Defaults `true`. */
    deviceKnown?: boolean
    /** Extra detail shown once the engine is ready (e.g. detected version/path). */
    engineDetail?: string
    /** Re-checks every step's readiness. Shared by every step's own re-check button — omit to hide all of them. */
    onVerify?: () => void
    /** `true` → every step renders its shimmer mirror (see file header). */
    isSkeleton?: boolean
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/** One `SurfaceCard` step, built by this block before render — named per §"every data shape has a name". */
interface StepEntry {
    key: string
    title: string
    status: StepStatus
    body: ReactNode
}

/** Fixed platform-wide embedding model — see file header: unlike the generation model, this never varies by device. */
const EMBEDDING_MODEL_NAME = "bge-m3"

const OS_ORDER: ReadonlyArray<PlaygroundSetupOs> = ["mac", "win", "linux"]
const OS_LABEL: Record<PlaygroundSetupOs, string> = { mac: "macOS", win: "Windows", linux: "Linux" }

/** The two-value readiness enum driving every step's trailing chip. */
type StepStatus = "ready" | "pending"

/** status → chip label/color — fixed Vietnamese copy this block owns (§14d.1), matching `PlaygroundReadinessChecklist`'s table. */
const STEP_STATUS_MAP: Record<StepStatus, EnumChipEntry> = {
    ready: { label: "Sẵn sàng", color: "success" },
    pending: { label: "Chưa xong", color: "default" },
}

/** Wraps a shell command in a fenced ```bash block for `MarkdownContent`. */
const bashBlock = (command: string): string => "```bash\n" + command + "\n```"

/** Props for the local {@link CommandSkeleton} mirror. */
interface CommandSkeletonProps {
    /** How many placeholder code lines to draw. Defaults to 1. */
    lines?: number
}

/**
 * Placeholder mirror of the code-block chrome `MarkdownContent`'s `pre` renderer
 * draws (border, header divider, lang label) — see file header for why this
 * block owns it instead of `MarkdownContent` shipping an `isSkeleton`.
 */
const CommandSkeleton = ({ lines = 1 }: CommandSkeletonProps) => (
    <div className="overflow-hidden rounded-2xl border border-default bg-default/30">
        <div className="flex items-center justify-between border-b border-default px-3 py-2">
            <Typography size="xs" isSkeleton classNames={["w-1/4"]} />
        </div>
        <StackV
            gap="related"
            padding="cozy"
            body={Array.from({ length: lines }, (_unused, index) => (
                <Typography key={index} size="xs" isSkeleton classNames={[index === lines - 1 ? "w-1/2" : "w-3/4"]} />
            ))}
        />
    </div>
)

// Depends on the loop variable, so it cannot be hoisted to a const above the
// return — a small named helper instead, in the style this file already uses.
const renderOsTabSkeleton = (key: PlaygroundSetupOs) => (
    <StackV
        key={key}
        gap="tight"
        align="center"
        body={
            <>
                <Typography size="sm" isSkeleton classNames={["w-1/3"]} />
                <Typography size="xs" isSkeleton classNames={["w-1/3"]} />
            </>
        }
    />
)

/** Placeholder mirror of the OS tab row — label+underline bar per OS, matching `Tabs`'s own `secondary` skeleton shape. */
const OsTabsSkeleton = () => (
    <StackH gap="related" body={OS_ORDER.map(renderOsTabSkeleton)} />
)

/**
 * The playground setup guide. See the file header for the reuse check, the
 * two-leaves-per-flavor call, and the skeleton-mirror judgement calls.
 *
 * @param props - {@link PlaygroundSetupStepsProps}
 */
const PlaygroundSetupSteps = ({
    flavor,
    engineName,
    osGuides,
    pairCommand,
    pairingCodeSecondsLeft = null,
    pairingCodeExpired = false,
    onRefreshPairingCode,
    isRefreshingPairingCode = false,
    agentReady,
    engineReady,
    genModelReady = false,
    embedModelReady = false,
    recommendedGenModel,
    deviceKnown = true,
    engineDetail,
    onVerify,
    isSkeleton = false,
    showAnatomy = false,
    anatPart,
}: PlaygroundSetupStepsProps) => {
    const [os, setOs] = useState<PlaygroundSetupOs>("mac")
    const [isRotateConfirmOpen, setRotateConfirmOpen] = useState(false)

    // Rotating a code nobody's agent holds yet is free; rotating a code the connected
    // agent depends on is disruptive, so THAT path confirms first (see file header).
    const handleRotateClick = () => {
        if (!onRefreshPairingCode) return
        if (agentReady) {
            setRotateConfirmOpen(true)
        } else {
            onRefreshPairingCode()
        }
    }
    const handleConfirmRotate = () => {
        onRefreshPairingCode?.()
        setRotateConfirmOpen(false)
    }

    // Shared by every step (see PROPS doc on `onVerify`) — built once as functions, not a
    // single JSX element re-used across positions, so each step gets its own element instance.
    const renderVerifyButton = (): ReactNode => {
        if (isSkeleton) return <Button isSkeleton size="sm" anatPart={showAnatomy ? "Button" : undefined} />
        if (!onVerify) return null
        return (
            <Button
                label="Kiểm tra lại"
                variant="tertiary"
                size="sm"
                prefixIcon={ArrowClockwiseIcon}
                onPress={onVerify}
                anatPart={showAnatomy ? "Button" : undefined}
            />
        )
    }
    const renderRotateButton = (): ReactNode => {
        if (isSkeleton) return <Button isSkeleton size="sm" anatPart={showAnatomy ? "Button" : undefined} />
        if (!onRefreshPairingCode) return null
        return (
            <Button
                label="Làm mã mới"
                variant="tertiary"
                size="sm"
                prefixIcon={ArrowsClockwiseIcon}
                onPress={handleRotateClick}
                isPending={isRefreshingPairingCode}
                anatPart={showAnatomy ? "Button" : undefined}
            />
        )
    }

    const pairingCodeNote: ReactNode = pairingCodeExpired
        ? (
            <Typography
                size="xs"
                color="danger"
                text="Mã ghép nối đã hết hạn — làm mã mới để lấy mã khác."
                anatPart={showAnatomy ? "Typography" : undefined}
            />
        )
        : pairingCodeSecondsLeft != null
            ? (
                <Typography
                    size="xs"
                    color="muted"
                    text={`Mã còn hiệu lực ${pairingCodeSecondsLeft} giây`}
                    anatPart={showAnatomy ? "Typography" : undefined}
                />
            )
            : null

    const pairStepBody: ReactNode = (
        <StackV
            gap="related"
            anatPart={showAnatomy ? "StackV" : undefined}
            body={
                <>
                    <Typography
                        size="sm"
                        color="muted"
                        isSkeleton={isSkeleton}
                        text="Agent cục bộ là cầu nối để Playground điều khiển máy bạn — thiếu bước này, mọi lệnh ở các bước sau đều không chạy được."
                        anatPart={showAnatomy ? "Typography" : undefined}
                    />
                    {isSkeleton
                        ? <CommandSkeleton />
                        : <MarkdownContent source={bashBlock(pairCommand)} measure="compact" anatPart={showAnatomy ? "MarkdownContent" : undefined} />}
                    {!isSkeleton ? pairingCodeNote : null}
                    <StackH
                        gap="related"
                        wrap
                        anatPart={showAnatomy ? "StackH" : undefined}
                        body={
                            <>
                                {renderVerifyButton()}
                                {renderRotateButton()}
                            </>
                        }
                    />
                </>
            }
        />
    )

    const engineLabel = engineName ?? "engine"
    const osTabsRow: ReactNode = isSkeleton ? (
        <OsTabsSkeleton />
    ) : (
        <div data-anat-part={showAnatomy ? "TabsExtended" : undefined}>
            <TabsExtended
                variant="secondary"
                size="sm"
                selectedKey={os}
                onSelectionChange={(key) => setOs(key as PlaygroundSetupOs)}
                showAnatomy={showAnatomy}
            >
                <Tabs.ListContainer>
                    <Tabs.List aria-label="Chọn hệ điều hành">
                        {OS_ORDER.map((key) => (
                            <Tabs.Tab key={key} id={key}>
                                <span>{OS_LABEL[key]}</span>
                                <Tabs.Indicator />
                            </Tabs.Tab>
                        ))}
                    </Tabs.List>
                </Tabs.ListContainer>
                {/* react-aria's useTab always computes an `aria-controls` id — this row shows no
                    panel content of its own (the guide below is a SEPARATE markdown render), so
                    these stay empty/`sr-only`, same convention as `Toolbar`/`Tabs` atom. */}
                {OS_ORDER.map((key) => (
                    <Tabs.Panel key={key} id={key} className="sr-only">{null}</Tabs.Panel>
                ))}
            </TabsExtended>
        </div>
    )

    const engineStepBody: ReactNode = (
        <StackV
            gap="related"
            anatPart={showAnatomy ? "StackV" : undefined}
            body={
                <>
                    <Typography
                        size="sm"
                        color="muted"
                        isSkeleton={isSkeleton}
                        text={`${engineLabel} là nơi mô hình thực sự chạy trên máy bạn — cài xong thì Playground mới xử lý được các tác vụ AI cục bộ.`}
                        anatPart={showAnatomy ? "Typography" : undefined}
                    />
                    {osTabsRow}
                    {isSkeleton
                        ? <CommandSkeleton lines={3} />
                        : <MarkdownContent source={osGuides[os]} measure="compact" anatPart={showAnatomy ? "MarkdownContent" : undefined} />}
                    {!isSkeleton && engineReady && engineDetail ? (
                        <FeedbackCallout
                            status="success"
                            title={`${engineLabel} đã sẵn sàng`}
                            description={engineDetail}
                            showAnatomy={showAnatomy}
                            anatPart={showAnatomy ? "FeedbackCallout" : undefined}
                        />
                    ) : null}
                    <StackH gap="related" anatPart={showAnatomy ? "StackH" : undefined} body={renderVerifyButton()} />
                </>
            }
        />
    )

    const genModelCommand = recommendedGenModel != null ? bashBlock(`ollama pull ${recommendedGenModel}`) : null
    const embedModelCommand = bashBlock(`ollama pull ${EMBEDDING_MODEL_NAME}`)
    const modelsReady = genModelReady && embedModelReady

    const genModelSection = genModelCommand != null ? (
        <StackV
            gap="tight"
            anatPart={showAnatomy ? "StackV" : undefined}
            body={
                <>
                    <Typography
                        size="xs"
                        color="muted"
                        text={`Model sinh — ${recommendedGenModel}`}
                        anatPart={showAnatomy ? "Typography" : undefined}
                    />
                    <MarkdownContent source={genModelCommand} measure="compact" anatPart={showAnatomy ? "MarkdownContent" : undefined} />
                </>
            }
        />
    ) : null

    const embedModelSection = (
        <StackV
            gap="tight"
            anatPart={showAnatomy ? "StackV" : undefined}
            body={
                <>
                    <Typography
                        size="xs"
                        color="muted"
                        text={`Model embedding — ${EMBEDDING_MODEL_NAME}`}
                        anatPart={showAnatomy ? "Typography" : undefined}
                    />
                    <MarkdownContent source={embedModelCommand} measure="compact" anatPart={showAnatomy ? "MarkdownContent" : undefined} />
                </>
            }
        />
    )

    const modelsCommandsSection = (
        <StackV
            gap="grouped"
            anatPart={showAnatomy ? "StackV" : undefined}
            body={
                <>
                    {genModelSection}
                    {embedModelSection}
                </>
            }
        />
    )

    const modelsSkeletonCommands = (
        <StackV
            gap="related"
            body={
                <>
                    <CommandSkeleton />
                    <CommandSkeleton />
                </>
            }
        />
    )

    const modelsStepBody: ReactNode = (
        <StackV
            gap="related"
            anatPart={showAnatomy ? "StackV" : undefined}
            body={
                <>
                    <Typography
                        size="sm"
                        color="muted"
                        isSkeleton={isSkeleton}
                        text="Model cần tải về máy trước khi dùng — đúng cỡ theo VRAM giúp máy chạy mượt, không treo hay tràn bộ nhớ."
                        anatPart={showAnatomy ? "Typography" : undefined}
                    />
                    {isSkeleton ? (
                        modelsSkeletonCommands
                    ) : deviceKnown === false ? (
                        <FeedbackCallout
                            status="warning"
                            title="Chưa xác định được cấu hình máy"
                            description="Cài xong engine rồi bấm Kiểm tra lại — Playground sẽ dò VRAM và gợi ý đúng cỡ model."
                            showAnatomy={showAnatomy}
                            anatPart={showAnatomy ? "FeedbackCallout" : undefined}
                        />
                    ) : modelsReady ? (
                        <FeedbackCallout
                            status="success"
                            title="Đã có đủ model"
                            description="Model sinh văn bản và model embedding đều đã tải xong trên máy bạn."
                            showAnatomy={showAnatomy}
                            anatPart={showAnatomy ? "FeedbackCallout" : undefined}
                        />
                    ) : (
                        modelsCommandsSection
                    )}
                    <StackH gap="related" anatPart={showAnatomy ? "StackH" : undefined} body={renderVerifyButton()} />
                </>
            }
        />
    )

    const agentStatus: StepStatus = agentReady ? "ready" : "pending"
    const engineStatus: StepStatus = engineReady ? "ready" : "pending"
    const modelsStatus: StepStatus = modelsReady ? "ready" : "pending"

    const steps: Array<StepEntry> = [
        { key: "pair", title: "1. Ghép nối agent cục bộ", status: agentStatus, body: pairStepBody },
        { key: "engine", title: `2. Cài ${engineLabel}`, status: engineStatus, body: engineStepBody },
    ]
    if (flavor === "ollama") {
        steps.push({ key: "models", title: "3. Tải model theo cấu hình máy", status: modelsStatus, body: modelsStepBody })
    }

    // Depends on the loop variable, so it cannot be hoisted to a const above the
    // return — a small named helper instead, in the style this file already uses.
    const renderStep = (step: StepEntry) => (
        <SurfaceCard
            key={step.key}
            label={step.title}
            action={
                <EnumChip
                    value={step.status}
                    map={STEP_STATUS_MAP}
                    isSkeleton={isSkeleton}
                    anatPart={showAnatomy ? "EnumChip" : undefined}
                />
            }
            isSkeleton={isSkeleton}
            anatPart={showAnatomy ? "SurfaceCard" : undefined}
            showAnatomy={showAnatomy}
        >
            {step.body}
        </SurfaceCard>
    )

    const rotateConfirm = onRefreshPairingCode ? (
        <FeedbackConfirm
            isOpen={isRotateConfirmOpen}
            onOpenChange={setRotateConfirmOpen}
            title="Làm mã mới trong khi agent đang kết nối?"
            description="Agent hiện đang dùng mã cũ để giữ kết nối — làm mã mới sẽ ngắt phiên hiện tại cho tới khi bạn dán mã mới vào agent."
            confirmLabel="Làm mã mới"
            cancelLabel="Để sau"
            onConfirm={handleConfirmRotate}
            isConfirming={isRefreshingPairingCode}
            showAnatomy={showAnatomy}
        />
    ) : null

    return (
        <StackV
            gap="grouped"
            anatPart={anatPart}
            showAnatomy={showAnatomy}
            body={
                <>
                    {steps.map(renderStep)}
                    {rotateConfirm}
                </>
            }
        />
    )
}

export { PlaygroundSetupSteps }
