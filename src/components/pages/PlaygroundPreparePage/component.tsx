import React from "react"
import { TerminalWindowIcon } from "@phosphor-icons/react"
import { PlaygroundSetupHeader } from "@/components/blocks/learn/PlaygroundSetupHeader"
import { PlaygroundEnterBanner } from "@/components/blocks/learn/PlaygroundEnterBanner"
import { PlaygroundDeviceSnapshot, type PlaygroundDeviceInfo } from "@/components/blocks/learn/PlaygroundDeviceSnapshot"
import {
    PlaygroundSetupSteps,
    type PlaygroundSetupFlavor,
    type PlaygroundSetupOs,
} from "@/components/blocks/learn/PlaygroundSetupSteps"
import {
    PlaygroundReadinessChecklist,
    type PlaygroundReadinessChecklistItem,
    type PlaygroundReadinessKind,
} from "@/components/blocks/learn/PlaygroundReadinessChecklist"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import { Container } from "@/components/frames/Container"
import { StackV } from "@/components/frames/Stack"
import type { CallerIdentity } from "@/components/frames/_identity"

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
    /** Truthy → the load failed; the error surface replaces the ENTIRE screen and beats empty + skeleton (BLOCK-8). */
    error?: unknown
    /** Retries the failed load. Omit → the error surface shows no retry. */
    onRetry?: () => void
    /** The empty state's one way out — back to the Playground hub. */
    onBackToHub?: () => void
    /** Every word the two whole-screen states say. Resolved by the connected half; a story passes i18n keys. */
    labels: PlaygroundPreparePageLabels
    /**
     * `true` → every block that can mirror itself does. The flag flows straight
     * down (§12c) to all five blocks — the screen builds no shimmer tree of its
     * own.
     */
    isSkeleton?: boolean
}

/** All display text for the whole-screen states, already localized by the connected half. */
export interface PlaygroundPreparePageLabels {
    /** Heading when the exercise id resolved to nothing. */
    emptyTitle: string
    /** Body when the exercise id resolved to nothing. */
    emptyDescription: string
    /** Heading when the load failed. */
    errorTitle: string
    /** Body when the load failed. */
    errorDescription: string
    /** Label on the one action both surfaces offer. */
    retry: string
}

/**
 * Whole-screen swap — the exercise resolved to nothing, or its load failed.
 *
 * BLOCK-2: this measure IS the screen's root here, so it wears the screen's
 * own identity (`identity` prop, see `_identity.ts`) instead of a wrapping
 * `<div data-tier="page" …>`. The `AsyncContent*` composite inside still
 * badges itself.
 */
const PlaygroundPreparePageSwap = ({ identity, body: Body }: {
    identity?: CallerIdentity
    body: () => React.ReactElement
}) => (
    <Container
        size="md"
        padding={6}
        identity={identity}
        body={Body}
    />
)

/**
 * The playground Setup screen. See the file header for the function list, why
 * this screen does not import `AsyncContent.Base`, and the checklist-as-single-
 * source-of-truth derivation.
 *
 * @param props - {@link PlaygroundPreparePageProps}
 */
const _PlaygroundPreparePage = ({
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
    error,
    onRetry,
    onBackToHub,
    labels,
    isSkeleton = false,
}: PlaygroundPreparePageProps) => {
    const identity: CallerIdentity = { tier: "page", component: "PlaygroundPreparePage" }

    // error beats a stale loading flag, and empty only once settled (BLOCK-8)
    if (error) {
        return (
            <PlaygroundPreparePageSwap
                identity={identity}
                body={() => (
                    <AsyncContentError
                        title={labels.errorTitle}
                        description={labels.errorDescription}
                        onRetry={onRetry}
                        retryLabel={labels.retry}
                    />
                )}
            />
        )
    }
    if (isEmpty) {
        return (
            <PlaygroundPreparePageSwap
                identity={identity}
                body={() => (
                    <AsyncContentEmpty
                        icon={TerminalWindowIcon}
                        title={labels.emptyTitle}
                        description={labels.emptyDescription}
                        onRetry={onBackToHub}
                        retryLabel={labels.retry}
                    />
                )}
            />
        )
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

    return (
        <Container
            size="md"
            padding={6}
            identity={{ tier: "page", component: "PlaygroundPreparePage" }}
            body={() => prepareBody}
        />
    )
}

export { _PlaygroundPreparePage }
