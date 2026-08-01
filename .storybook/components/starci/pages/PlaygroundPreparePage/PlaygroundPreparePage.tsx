import React from "react"
import { TerminalWindowIcon } from "@phosphor-icons/react"
import { PlaygroundSetupHeader } from "@sb-components/starci/blocks/learn/PlaygroundSetupHeader/PlaygroundSetupHeader"
import { PlaygroundEnterBanner } from "@sb-components/starci/blocks/learn/PlaygroundEnterBanner/PlaygroundEnterBanner"
import { PlaygroundDeviceSnapshot, type PlaygroundDeviceInfo } from "@sb-components/starci/blocks/learn/PlaygroundDeviceSnapshot/PlaygroundDeviceSnapshot"
import {
    PlaygroundSetupSteps,
    type PlaygroundSetupFlavor,
    type PlaygroundSetupOs,
} from "@sb-components/starci/blocks/learn/PlaygroundSetupSteps/PlaygroundSetupSteps"
import {
    PlaygroundReadinessChecklist,
    type PlaygroundReadinessChecklistItem,
    type PlaygroundReadinessKind,
} from "@sb-components/starci/blocks/learn/PlaygroundReadinessChecklist/PlaygroundReadinessChecklist"
import { AsyncContentEmpty } from "@sb-components/composites/async/AsyncContent/AsyncContent"
import { Container } from "@sb-components/frames/Container/Container"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SCREEN — `PlaygroundPreparePage`: get one playground exercise ready before
 * entering it — pair the local agent, install the engine, pull models when the
 * flavor needs them — then press one CTA once every step is done.
 *
 * A screen owns a LIST OF FUNCTIONS and nothing else: it calls blocks, places
 * them in frames, and hands each one typed data. It draws no shape of its own —
 * every `div` here would be a shape it had no right to decide.
 *
 * FIVE FUNCTIONS, in the order the learner meets them: what exercise is this and
 * how to leave it · the one primary decision (enter, once ready) · what machine
 * this will run on · the ordered setup work itself · a glance-back checklist of
 * every prerequisite.
 *
 * ⚠️ CORRECTING THE PLANNER'S TREE — NO `AsyncContent.Base` AT THIS TIER. The
 * planner's proposal reached past this codebase's own settled precedent and
 * wired the screen straight to `AsyncContent.Base`'s four-branch state switch
 * (`isLoading`/`error`/`isEmpty`/`content`) — exactly the "rebuilt a worse
 * version from a bare [part] instead of reusing the whole thing" mistake this
 * run's own brief was written to stop. Checked against EVERY existing screen in
 * this catalog before writing this file: none of them import `AsyncContent.Base`
 * or `AsyncContentError` at the screen tier — `QuizPage`'s own file header
 * states the rule outright ("§0's import boundary is exact: a screen calls
 * blocks and frames, never a composite directly — the one documented exception,
 * `CourseContents`'s `AsyncContentEmpty`, replaces the ENTIRE screen, not one
 * phase's one node"), and `PlaygroundSessionPage`'s file header independently
 * confirms the loading/error moment for a route lives OUTSIDE the screen
 * component entirely. None of the five blocks this screen composes carry an
 * `error` prop either — inventing one here would be inventing a state no
 * composed part can express. So this screen follows the SAME idiom every
 * sibling screen already uses: `isSkeleton` flows down to every block that can
 * mirror itself, and `isEmpty` (the exercise id resolved to nothing) swaps the
 * ENTIRE body for `AsyncContentEmpty` — the one documented composite exception,
 * used exactly like `CourseContents`/`ModulePage`/`FoundationResourcePage`
 * already use it.
 *
 * ⭐ `checklistItems` IS THE ONE SOURCE OF TRUTH, DERIVED THREE WAYS — not three
 * props that could quietly disagree. `PlaygroundEnterBanner`'s `allReady`/
 * `pendingCount`, and `PlaygroundSetupSteps`'s per-kind `agentReady`/
 * `engineReady`/`genModelReady`/`embedModelReady`, are all read off the SAME
 * `checklistItems` array this screen also hands to `PlaygroundReadinessChecklist`
 * verbatim. A caller supplying the enter banner's readiness and the checklist's
 * readiness as two separate props could have them drift out of sync (the banner
 * says "ready", the list still shows a pending row); deriving both from one array
 * makes that impossible. Same discipline `PlaygroundSessionPage`'s file header
 * documents for its own "ONE CONNECTION ENUM, TWO VOCABULARIES" derivation.
 *
 * ⭐ `deviceKnown` IS DERIVED FROM `deviceInfo`, NOT A SEPARATE PROP, for the
 * identical reason: "is the device known" and "is there a `deviceInfo` to show"
 * are the same fact asked twice.
 *
 * ⭐ `PlaygroundDeviceSnapshot` IS A CONDITIONAL LEAF. The verified proposal was
 * correct on this point: the screen renders "Your machine" only once the paired
 * agent has actually reported a snapshot — the same conditional-render precedent
 * `ContentPage`'s footer stack and `ModulePage`'s paywall already set,
 * not a new pattern.
 * ─────────────────────────────────────────────────────────────────────────────
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
    /** When on, each block emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
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
        anatPart="Container"
        size="md"
        padding={6}
        body={
            <AsyncContentEmpty
                anatPart="AsyncContentEmpty"
                icon={TerminalWindowIcon}
                title="Exercise not found"
                description="This exercise may have been removed, or the link is no longer valid — go back to Playground to pick another one."
            />
        }
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
    showAnatomy = false,
}: PlaygroundPreparePageProps) => {
    if (isEmpty) {
        return <PlaygroundPreparePageEmpty />
    }

    const allReady = checklistItems.length > 0 && checklistItems.every((item) => item.ready)
    const pendingCount = checklistItems.filter((item) => !item.ready).length

    const readinessSection = (
        <>
            <PlaygroundEnterBanner
                anatPart="PlaygroundEnterBanner"
                allReady={allReady}
                pendingCount={pendingCount}
                onEnter={onEnter}
                isSkeleton={isSkeleton}
                showAnatomy={showAnatomy}
            />
            {deviceInfo ? (
                <PlaygroundDeviceSnapshot
                    anatPart="PlaygroundDeviceSnapshot"
                    deviceInfo={deviceInfo}
                    isSkeleton={isSkeleton}
                    showAnatomy={showAnatomy}
                />
            ) : null}
            <PlaygroundSetupSteps
                anatPart="PlaygroundSetupSteps"
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
                showAnatomy={showAnatomy}
            />
            <PlaygroundReadinessChecklist
                anatPart="PlaygroundReadinessChecklist"
                items={checklistItems}
                isSkeleton={isSkeleton}
                showAnatomy={showAnatomy}
            />
        </>
    )

    const prepareSections = (
        <>
            <PlaygroundSetupHeader
                anatPart="PlaygroundSetupHeader"
                breadcrumbLabel={breadcrumbLabel}
                onBack={onBack}
                title={title}
                description={description}
                isSkeleton={isSkeleton}
                showAnatomy={showAnatomy}
            />
            <StackV gap={6} anatPart={showAnatomy ? "StackV" : undefined} body={readinessSection} />
        </>
    )

    const prepareBody = <StackV gap={6} anatPart={showAnatomy ? "StackV" : undefined} body={prepareSections} />

    return <Container size="md" padding={6} anatPart={showAnatomy ? "Container" : undefined} body={prepareBody} />
}

export { PlaygroundPreparePage }
