import React from "react"
import { TerminalWindowIcon } from "@phosphor-icons/react"
import { PlaygroundSetupHeader } from "@/components/starci/blocks/learn/PlaygroundSetupHeader"
import { PlaygroundEnterBanner } from "@/components/starci/blocks/learn/PlaygroundEnterBanner"
import { PlaygroundDeviceSnapshot, type PlaygroundDeviceInfo } from "@/components/starci/blocks/learn/PlaygroundDeviceSnapshot"
import {
    PlaygroundSetupSteps,
    type PlaygroundSetupFlavor,
    type PlaygroundSetupOs,
} from "@/components/starci/blocks/learn/PlaygroundSetupSteps"
import {
    PlaygroundReadinessChecklist,
    type PlaygroundReadinessChecklistItem,
    type PlaygroundReadinessKind,
} from "@/components/starci/blocks/learn/PlaygroundReadinessChecklist"
import { AsyncContentEmpty } from "@/components/composites/async/AsyncContent"
import { Container } from "@/components/frames/Container"
import { StackV } from "@/components/frames/Stack"

/**
 * `PlaygroundPreparePage` — the screen to get one playground exercise ready
 * before entering it: pair the local agent, install the engine, pull models
 * when the flavor needs them, then press one CTA once every step is done. A
 * screen owns a list of functions: it calls blocks, places them in frames, and
 * hands each typed data. Five functions, in reading order: what exercise this
 * is and how to leave · the one primary decision (enter, once ready) · what
 * machine this runs on · the ordered setup work · a glance-back checklist.
 * `checklistItems` is the single source of truth — the enter banner's readiness
 * and each step's per-kind status are all derived from it. Uses
 * `AsyncContentEmpty` as a whole-screen swap, never the four-branch `.Base`.
 *
 * PRESENTATIONAL — every input arrives as a prop; this twin owns no data of
 * its own, so `index.tsx` IS the presentational file (no separate connected
 * wrapper, no `component.tsx` split).
 *
 * src twin of `.storybook/components/starci/pages/PlaygroundPreparePage/PlaygroundPreparePage.tsx`.
 * No v1 predecessor found under `src/components` (grep for
 * `PlaygroundPreparePage` returned nothing) — this is a fresh page.
 */

/** kind → readiness, read off {@link PlaygroundPreparePageProps.checklistItems}. */
const readinessOf = (items: Array<PlaygroundReadinessChecklistItem>, kind: PlaygroundReadinessKind): boolean =>
    items.find((item) => item.kind === kind)?.ready ?? false

/** Props for {@link PlaygroundPreparePage}. */
export interface PlaygroundPreparePageProps {
    // ── identity ──
    /** Label on the back link — the Playground hub this exercise was opened from. */
    breadcrumbLabel: string
    /** Fired when the learner presses back. */
    onBack: () => void
    /** Exercise title. */
    title: string
    /** One-line intro to the exercise. */
    description?: string

    // ── the one primary decision + the checklist it is derived from ──
    /**
     * Every prerequisite this exercise checks, top to bottom. The single source
     * of truth this screen derives the enter banner's readiness AND each setup
     * step's own status from (see file header) — never duplicated as separate
     * booleans.
     */
    checklistItems: Array<PlaygroundReadinessChecklistItem>
    /** Fired when the learner presses the enter CTA. Only reachable once every checklist item is ready. */
    onEnter: () => void

    // ── device snapshot (conditional — see file header) ──
    /** The paired machine's hardware/OS snapshot. Omitted → "Your machine" is not rendered yet. */
    deviceInfo?: PlaygroundDeviceInfo

    // ── setup steps ──
    /** `"infra"` → 2 steps. `"ollama"` → 3 (+ pull models). */
    flavor: PlaygroundSetupFlavor
    /** Display name of the engine being installed. */
    engineName?: string
    /** Install guide markdown, one document per OS. */
    osGuides: Record<PlaygroundSetupOs, string>
    /** The command a learner runs on their machine to pair the local agent. */
    pairCommand: string
    /** Seconds left before the current pairing code expires. `null` → no expiry countdown. */
    pairingCodeSecondsLeft?: number | null
    /** `true` → the pairing code has already expired. */
    pairingCodeExpired?: boolean
    /** Requests a fresh pairing code. Omit to hide the rotate action entirely. */
    onRefreshPairingCode?: () => void
    /** `true` → the rotate button shows a spinner and blocks further presses. */
    isRefreshingPairingCode?: boolean
    /** Ollama only: the generation model chosen for this device's VRAM. Absent while the device isn't known. */
    recommendedGenModel?: string
    /** Extra detail shown once the engine is ready (e.g. detected version/path). */
    engineDetail?: string
    /** Re-checks every step's readiness. Omit to hide every step's re-check button. */
    onVerify?: () => void

    // ── whole-screen states ──
    /** `true` → the exercise id resolved to nothing; `AsyncContentEmpty` replaces the ENTIRE screen. */
    isEmpty?: boolean
    /**
     * `true` → every block that can mirror itself does. The flag flows straight
     * down (§12c) to all five blocks — the screen builds no shimmer tree of its
     * own.
     */
    isSkeleton?: boolean
}

/**
 * Empty state — the exercise id resolved to nothing.
 *
 * The frame and the content each carry THEIR OWN name (`CourseContents`'
 * precedent): the wrapping `Container` badges itself, `AsyncContentEmpty`
 * inside badges itself too, so neither vanishes from the anatomy tree wearing
 * the other's name.
 */
const PlaygroundPreparePageEmpty = () => (
    <Container

        size="md"
        padding={6}
        body={() => (
            <AsyncContentEmpty

                icon={TerminalWindowIcon}
                title="Exercise not found"
                description="This exercise may have been removed, or the link is no longer valid — go back to Playground to pick another one."
            />
        )}
    />
)

/**
 * The playground Setup screen. See the file header for the function list, why
 * this screen does not import `AsyncContent.Base`, and the checklist-as-single-
 * source-of-truth derivation.
 *
 * @param props - {@link PlaygroundPreparePageProps}
 */
const PlaygroundPreparePage = ({
    breadcrumbLabel,
    onBack,
    title,
    description,
    checklistItems,
    onEnter,
    deviceInfo,
    flavor,
    engineName,
    osGuides,
    pairCommand,
    pairingCodeSecondsLeft,
    pairingCodeExpired,
    onRefreshPairingCode,
    isRefreshingPairingCode,
    recommendedGenModel,
    engineDetail,
    onVerify,
    isEmpty = false,
    isSkeleton = false,
}: PlaygroundPreparePageProps) => {
    if (isEmpty) {
        return <PlaygroundPreparePageEmpty />
    }

    const allReady = checklistItems.length > 0 && checklistItems.every((item) => item.ready)
    const pendingCount = checklistItems.filter((item) => !item.ready).length

    const readinessSection = (
        <>
            <PlaygroundEnterBanner

                allReady={allReady}
                pendingCount={pendingCount}
                onEnter={onEnter}
                isSkeleton={isSkeleton}

            />
            {deviceInfo ? (
                <PlaygroundDeviceSnapshot

                    deviceInfo={deviceInfo}
                    isSkeleton={isSkeleton}

                />
            ) : null}
            <PlaygroundSetupSteps

                flavor={flavor}
                engineName={engineName}
                osGuides={osGuides}
                pairCommand={pairCommand}
                pairingCodeSecondsLeft={pairingCodeSecondsLeft}
                pairingCodeExpired={pairingCodeExpired}
                onRefreshPairingCode={onRefreshPairingCode}
                isRefreshingPairingCode={isRefreshingPairingCode}
                agentReady={readinessOf(checklistItems, "agent")}
                engineReady={readinessOf(checklistItems, "engine")}
                genModelReady={readinessOf(checklistItems, "genModel")}
                embedModelReady={readinessOf(checklistItems, "embedModel")}
                recommendedGenModel={recommendedGenModel}
                deviceKnown={deviceInfo != null}
                engineDetail={engineDetail}
                onVerify={onVerify}
                isSkeleton={isSkeleton}

            />
            <PlaygroundReadinessChecklist

                items={checklistItems}
                isSkeleton={isSkeleton}

            />
        </>
    )

    const prepareSections = (
        <>
            <PlaygroundSetupHeader

                breadcrumbLabel={breadcrumbLabel}
                onBack={onBack}
                title={title}
                description={description}
                isSkeleton={isSkeleton}

            />
            <StackV gap={6} isSkeleton={isSkeleton} items={[() => readinessSection]} />
        </>
    )

    const prepareBody = <StackV gap={6} isSkeleton={isSkeleton} items={[() => prepareSections]} />

    return <Container size="md" padding={6} body={() => prepareBody} />
}

export { PlaygroundPreparePage }
