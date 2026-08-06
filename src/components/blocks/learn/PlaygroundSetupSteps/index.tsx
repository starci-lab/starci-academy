import React, { useState } from "react"
import { type SkeletonProps } from "@/components/frames/_slot"
import type { ReactNode } from "react"
import { Tabs } from "@heroui/react"
import {
    ArrowClockwiseIcon,
    ArrowsClockwiseIcon,
} from "@phosphor-icons/react"
import { SurfaceCard } from "@/components/composites/cards/SurfaceCard"
import { EnumChip, type EnumChipEntry } from "@/components/composites/chips/EnumChip"
import { MarkdownContent } from "@/components/composites/viewers/MarkdownContent"
import { TabsExtended } from "@/components/atoms/navigation/Tabs"
import { Button } from "@/components/atoms/buttons/Button"
import { Callout } from "@/components/composites/feedback/Callout"
import { ConfirmDialog } from "@/components/composites/feedback/ConfirmDialog"
import { Typography } from "@/components/atoms/text/Typography"
import { StackV, StackH } from "@/components/frames/Stack"
import { CommandSkeleton } from "./CommandSkeleton"
import { OsTabsSkeleton } from "./OsTabsSkeleton"
import { type PlaygroundSetupOs, type PlaygroundSetupStepsProps } from "./types"

export type { PlaygroundSetupOs, PlaygroundSetupFlavor, PlaygroundSetupStepsProps } from "./types"

/**
 * BLOCK — `PlaygroundSetupSteps`: the ordered setup guide for a playground — pair
 * the local agent, install the engine (an OS-tabbed guide), and — Ollama flavor
 * only — pull the VRAM-sized models. Each step carries its own status chip,
 * why-it-matters line, runnable command(s), and re-check action.
 *
 * TWO LEAVES, ONE PER `flavor` (§14d.2 — see the component's file header for why
 * this differs from `ChallengeBrief`'s single "one leaf, N optional sections"):
 * `flavor` is chosen once per PLAYGROUND KIND, not per render, so a caller wired
 * to `"infra"` never even carries the model-readiness props the third step
 * needs — the third `SurfaceCard` is a structural fact of the ollama leaf, not a
 * data condition that could show up on the infra one.
 */

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
    ready: { label: "Ready", color: "success" },
    pending: { label: "Not done", color: "default" },
}

/** Wraps a shell command in a fenced ```bash block for `MarkdownContent`. */
const bashBlock = (command: string): string => "```bash\n" + command + "\n```"

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
}: PlaygroundSetupStepsProps) => {
    const [os, setOs] = useState<PlaygroundSetupOs>("mac")
    const [isRotateConfirmOpen, setRotateConfirmOpen] = useState(false)

    // Rotating a code nobody's agent holds yet is free; rotating a code the connected
    // agent depends on is disruptive, so THAT path confirms first (see file header).
    const onRotateClick = () => {
        if (!onRefreshPairingCode) return
        if (agentReady) {
            setRotateConfirmOpen(true)
        } else {
            onRefreshPairingCode()
        }
    }
    const onConfirmRotate = () => {
        onRefreshPairingCode?.()
        setRotateConfirmOpen(false)
    }

    // Shared by every step (see PROPS doc on `onVerify`) — built once as functions, not a
    // single JSX element re-used across positions, so each step gets its own element instance.
    const renderVerifyButton = (): ReactNode => {
        if (isSkeleton) return <Button isSkeleton size="sm" />
        if (!onVerify) return null
        return (
            <Button
                label="Check again"
                variant="tertiary"
                size="sm"
                prefixIcon={ArrowClockwiseIcon}
                onPress={onVerify}

            />
        )
    }
    const renderRotateButton = (): ReactNode => {
        if (isSkeleton) return <Button isSkeleton size="sm" />
        if (!onRefreshPairingCode) return null
        return (
            <Button
                label="Get new code"
                variant="tertiary"
                size="sm"
                prefixIcon={ArrowsClockwiseIcon}
                onPress={onRotateClick}
                isPending={isRefreshingPairingCode}

            />
        )
    }

    const pairingCodeNote: ReactNode = pairingCodeExpired
        ? (
            <Typography
                size="xs"
                color="danger"
                text="The pairing code has expired — get a new code to continue."

            />
        )
        : pairingCodeSecondsLeft != null
            ? (
                <Typography
                    size="xs"
                    color="muted"
                    text={`Code valid for ${pairingCodeSecondsLeft} more seconds`}

                />
            )
            : null

    const pairStepBody: ReactNode = (
        <StackV
            gap={3}
            principle="sibling-stack"
            explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
            isSkeleton={isSkeleton}
            items={[
                () => (
                    <Typography
                        size="sm"
                        color="muted"
                        isSkeleton={isSkeleton}
                        text="The local agent is the bridge that lets Playground control your machine — skip this step and every command in the following steps fails to run."

                    />
                ),
                () => (isSkeleton
                    ? <CommandSkeleton />
                    : <MarkdownContent source={bashBlock(pairCommand)} measure="compact" />),
                ...(!isSkeleton ? [() => pairingCodeNote] : []),
                ({ isSkeleton }: SkeletonProps) => (
                    <StackH
                        gap={3}
                        at="sm"
                        principle="flex-action"
                        explain="Groups action controls on one horizontal peer row so they share a single hit baseline."
                        isSkeleton={isSkeleton}
                        items={[
                            () => renderVerifyButton(),
                            () => renderRotateButton(),
                        ]}
                    />
                ),
            ]}
        />
    )

    const engineLabel = engineName ?? "engine"
    const osTabsRow: ReactNode = isSkeleton ? (
        <OsTabsSkeleton />
    ) : (
        <div>
            <TabsExtended
                variant="secondary"
                size="sm"
                selectedKey={os}
                onSelectionChange={(key) => setOs(key as PlaygroundSetupOs)}

            >
                <Tabs.ListContainer>
                    <Tabs.List aria-label="Choose operating system">
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
            gap={3}
            isSkeleton={isSkeleton}
            items={[
                () => (
                    <Typography
                        size="sm"
                        color="muted"
                        isSkeleton={isSkeleton}
                        text={`${engineLabel} is where the model actually runs on your machine — once installed, Playground can handle local AI tasks.`}

                    />
                ),
                () => osTabsRow,
                () => (isSkeleton
                    ? <CommandSkeleton lines={3} />
                    : <MarkdownContent source={osGuides[os]} measure="compact" />),
                ...(!isSkeleton && engineReady && engineDetail ? [() => (
                    <Callout
                        status="success"
                        title={`${engineLabel} is ready`}
                        description={engineDetail}


                    />
                )] : []),
                ({ isSkeleton }: SkeletonProps) => <StackH gap={3} isSkeleton={isSkeleton} items={[() => renderVerifyButton()]} />,
            ]}
        />
    )

    const genModelCommand = recommendedGenModel != null ? bashBlock(`ollama pull ${recommendedGenModel}`) : null
    const embedModelCommand = bashBlock(`ollama pull ${EMBEDDING_MODEL_NAME}`)
    const modelsReady = genModelReady && embedModelReady

    const genModelSection = genModelCommand != null ? (
        <StackV
            gap={2}
            isSkeleton={isSkeleton}
            items={[
                ({ isSkeleton }: SkeletonProps) => (
                    <Typography
                        isSkeleton={isSkeleton}
                        size="xs"
                        color="muted"
                        text={`Model sinh — ${recommendedGenModel}`}

                    />
                ),
                () => <MarkdownContent source={genModelCommand} measure="compact" />,
            ]}
        />
    ) : null

    const embedModelSection = (
        <StackV
            gap={2}
            isSkeleton={isSkeleton}
            items={[
                ({ isSkeleton }: SkeletonProps) => (
                    <Typography
                        isSkeleton={isSkeleton}
                        size="xs"
                        color="muted"
                        text={`Model embedding — ${EMBEDDING_MODEL_NAME}`}

                    />
                ),
                () => <MarkdownContent source={embedModelCommand} measure="compact" />,
            ]}
        />
    )

    const modelsCommandsSection = (
        <StackV
            gap={4}
            isSkeleton={isSkeleton}
            items={[
                () => genModelSection,
                () => embedModelSection,
            ]}
        />
    )

    const modelsSkeletonCommands = (
        <StackV
            gap={3}
            isSkeleton={isSkeleton}
            items={[
                () => <CommandSkeleton />,
                () => <CommandSkeleton />,
            ]}
        />
    )

    const modelsStepBody: ReactNode = (
        <StackV
            gap={3}
            isSkeleton={isSkeleton}
            items={[
                () => (
                    <Typography
                        size="sm"
                        color="muted"
                        isSkeleton={isSkeleton}
                        text="Models need to be pulled to your machine before use — the right size for your VRAM keeps things running smoothly, without freezing or running out of memory."

                    />
                ),
                () => (isSkeleton ? (
                    modelsSkeletonCommands
                ) : deviceKnown === false ? (
                    <Callout
                        status="warning"
                        title="Device configuration not detected yet"
                        description="Finish installing the engine, then press Check again — Playground will detect your VRAM and suggest the right model size."


                    />
                ) : modelsReady ? (
                    <Callout
                        status="success"
                        title="All models are ready"
                        description="Both the text-generation model and the embedding model are already downloaded on your machine."


                    />
                ) : (
                    modelsCommandsSection
                )),
                ({ isSkeleton }: SkeletonProps) => <StackH gap={3} isSkeleton={isSkeleton} items={[() => renderVerifyButton()]} />,
            ]}
        />
    )

    const agentStatus: StepStatus = agentReady ? "ready" : "pending"
    const engineStatus: StepStatus = engineReady ? "ready" : "pending"
    const modelsStatus: StepStatus = modelsReady ? "ready" : "pending"

    const steps: Array<StepEntry> = [
        { key: "pair", title: "1. Pair local agent", status: agentStatus, body: pairStepBody },
        { key: "engine", title: `2. Install ${engineLabel}`, status: engineStatus, body: engineStepBody },
    ]
    if (flavor === "ollama") {
        steps.push({ key: "models", title: "3. Pull models for your device", status: modelsStatus, body: modelsStepBody })
    }

    // Depends on the loop variable, so it cannot be hoisted to a const above the
    // return — a small named helper instead, in the style this file already uses.
    const renderStep = (step: StepEntry) => (
        <SurfaceCard
            key={step.key}
            label={step.title}
            action={() => (
                <EnumChip
                    value={step.status}
                    map={STEP_STATUS_MAP}
                    isSkeleton={isSkeleton}

                />
            )}
            isSkeleton={isSkeleton}


            body={() => step.body}
        />
    )

    const rotateConfirm = onRefreshPairingCode ? (
        <ConfirmDialog
            isOpen={isRotateConfirmOpen}
            onOpenChange={setRotateConfirmOpen}
            title="Get a new code while the agent is connected?"
            description="The agent is currently using the old code to hold its connection — getting a new code will break the current session until you paste the new code into the agent."
            confirmLabel="Get new code"
            cancelLabel="Not now"
            onConfirm={onConfirmRotate}
            isConfirming={isRefreshingPairingCode}

        />
    ) : null

    return (
        <StackV
            gap={4}
            isSkeleton={isSkeleton}
            items={[
                ...steps.map((step) => () => renderStep(step)),
                () => rotateConfirm,
            ]}
        />
    )
}

export { PlaygroundSetupSteps }
