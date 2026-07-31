import React from "react"
import { WorkSessionHeader } from "@sb-components/starci/blocks/navigation/WorkSessionHeader/WorkSessionHeader"
import {
    PlaygroundStepGuide,
    type PlaygroundStep,
    type PlaygroundStepVerifyState,
} from "@sb-components/starci/blocks/learn/PlaygroundStepGuide/PlaygroundStepGuide"
import {
    PlaygroundResourcePanel,
    type PlaygroundResourceEntry,
    type PlaygroundConnectionState as PlaygroundResourcePanelConnection,
} from "@sb-components/starci/blocks/learn/PlaygroundResourcePanel/PlaygroundResourcePanel"
import {
    PlaygroundConnectSheet,
    type PlaygroundConnectionState,
    type PlaygroundDeviceSpec,
    type PlaygroundAgentLogLine,
} from "@sb-components/starci/blocks/learn/PlaygroundConnectSheet/PlaygroundConnectSheet"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SCREEN — `PlaygroundSessionPage`: run one playground exercise — read the
 * current step, run its command on your own machine, watch your live workspace
 * report back, and keep an eye on the pairing itself.
 *
 * A screen owns a LIST OF FUNCTIONS and nothing else: it calls blocks, places
 * them in frames, and hands each one typed data. Every node below is one of the
 * FOUR blocks the catalog already had (one reused, three new this run) — this
 * file draws no shape of its own.
 *
 * FOUR FUNCTIONS: (1) where the learner is in the run, and two ways to leave —
 * `WorkSessionHeader`, reused unchanged, same band `QuizPage`'s `active`/`recap`
 * phases already share; (2) read the current step and verify it —
 * `PlaygroundStepGuide`; (3) the live workspace snapshot the paired machine
 * reports — `PlaygroundResourcePanel`; (4) the pairing itself, docked at the
 * bottom of the workspace — `PlaygroundConnectSheet`.
 *
 * ⭐ TWO-PANE WORKSPACE, NOT A READING COLUMN. `ChallengePage` already solved
 * this exact problem for its own read-column/act-column split, and its file
 * header names the reason precisely: this design system has no dedicated
 * "flexible column + fixed aside" khung yet, so `StackH` holding two `StackV`
 * children is the BEST-AVAILABLE substitute (`min-w-0 flex-1` for the guide,
 * `shrink-0 @app-xl:w-[24rem]` for the resource aside) — same idiom, same
 * documented limit, not a second one invented. This resolves the planner's own
 * "no existing khung fits" note: one already does, one call away.
 * `divider` (a `StackH` prop, composing the `Divider` atom) draws the seam
 * between the two panes instead of a hand-rolled border class.
 *
 * ⭐ NO `Container`. This is a workspace route, not a reading measure — the
 * whole point of the two-pane split is to use the full shell width, so the
 * screen skips `Container` entirely and sizes itself to the viewport
 * (`h-[calc(100vh-4rem)]`, matching the shell's fixed navbar height) instead of
 * capping at a `max-w-app-*` reading column.
 *
 * ⭐ THE DOCKED SHEET IS POSITIONED, NOT LAID OUT. `PlaygroundConnectSheet` must
 * float over the two-pane region rather than push it up every time the sheet
 * opens (a session band and two live panes reflowing on every toggle would be
 * disorienting). `absolute inset-x-0 bottom-0` on a `StackV` wrapper anchored to
 * a `relative` region wrapper is the SAME kind of placement-only `className` use
 * `ContinueCard`'s `min-w-0 flex-1` and `ChallengePage`'s `shrink-0
 * @app-xl:w-[22rem]` already establish (§14d.1: placement, never restyling) —
 * no new pattern, just this screen's own instance of it.
 *
 * ⭐ ONE CONNECTION ENUM, TWO VOCABULARIES. `PlaygroundConnectSheet` needs the
 * full three-state story (`connected`/`waiting`/`dropped`) to tell "never
 * paired" from "lost the pairing" apart in its wording. `PlaygroundResourcePanel`
 * only ever asks a binary question ("is there a live snapshot to show").
 * Rather than take two connection props that could disagree, the screen owns
 * ONE `connection` prop in the sheet's three-state shape and derives the
 * panel's binary reading from it (`"connected" → "connected"`, anything else →
 * `"notConnected"`) — the same kind of derivation `PlaygroundConnectSheet`'s own
 * file header uses to avoid a redundant `everConnected` boolean.
 *
 * ⛔ NO `isSkeleton` PROP. None of the four composed blocks accepts one:
 * `WorkSessionHeader` and `PlaygroundStepGuide` never grew the prop,
 * `PlaygroundResourcePanel`'s file header states outright that it is "NEVER
 * SKELETONISED" (its own `Feedback.Empty` states already cover "nothing to
 * shimmer yet"), and `PlaygroundConnectSheet` mirrors real socket state, not a
 * fetch. The route-level notes for this screen confirm the loading moment lives
 * OUTSIDE it entirely (`isLoading || !playground` → a full-screen spinner one
 * layer above this component), so there is nothing here to thread a flag into.
 *
 * ⛔ `isRag` IS OUT OF SCOPE (route-level note). A RAG-backed playground renders
 * an entirely different screen (`PlaygroundRagSession`) — not a state of this
 * one — so the fork happens at the route, before this component is ever called.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link PlaygroundSessionPage}. */
export interface PlaygroundSessionPageProps {
    // ── session band (`WorkSessionHeader`) ──
    /** Back-link label — leave, run stays resumable. */
    backLabel: string
    /** Fired when the learner leaves without ending the run. */
    onBack: () => void
    /** Session title, e.g. the exercise name. */
    title?: string
    /** Where the learner is, already worded, e.g. "Bước 2 / 5". */
    counter: string
    /** How many steps this run has. */
    total: number
    /** Which step is being viewed, 1-based. */
    current: number
    /** Steps already verified, 1-based. */
    doneSteps?: Array<number>
    /** Fired with a 1-based step when the learner taps the rail. */
    onStepPress?: (step: number) => void
    /** Finish-now label. Present with `onFinish` → the end-now control shows. */
    finishLabel?: string
    /** Fired when the learner ends the run early. */
    onFinish?: () => void

    // ── left pane: the step guide ──
    /** The step being read. Omit → every step is done, the guide shows its completion leaf. */
    step?: PlaygroundStep
    /** Where the current step's verify action stands. Ignored once `step` is omitted. */
    verifyState: PlaygroundStepVerifyState
    /** Fired when the learner presses `Verify` (or retries after a miss). */
    onVerify: () => void
    /** Fired from the guide's completion leaf, back to the Playground hub. */
    onLeaveGuideComplete: () => void

    // ── shared pairing state (right pane + docked sheet) ──
    /** How the paired machine's connection currently stands. */
    connection: PlaygroundConnectionState
    /** Round-trip time to the local agent. Only read while `connection === "connected"`. */
    latencyMs?: number
    /** The paired machine's specs, once the agent has reported at least once. */
    device?: PlaygroundDeviceSpec
    /** Live tail of the local agent's log, oldest first. */
    agentLog: Array<PlaygroundAgentLogLine>
    /** Fired when the learner presses the sheet's reconnect action. */
    onReconnect: () => void

    // ── right pane: the live resource snapshot ──
    /** The flat resource snapshot as the socket reports it. */
    resources: Array<PlaygroundResourceEntry>

    // ── docked sheet open state ──
    /** Whether the connect sheet's body (device specs + log) is expanded. Controlled. */
    isConnectSheetOpen: boolean
    /** Fired with the next expanded state when the learner presses the sheet's toggle. */
    onConnectSheetOpenChange: (open: boolean) => void

    /** When on, every composed block emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
}

/**
 * The playground run screen. See the file header for the function list and the
 * two-pane layout's precedent.
 *
 * @param props - {@link PlaygroundSessionPageProps}
 */
const PlaygroundSessionPage = ({
    backLabel,
    onBack,
    title,
    counter,
    total,
    current,
    doneSteps,
    onStepPress,
    finishLabel,
    onFinish,
    step,
    verifyState,
    onVerify,
    onLeaveGuideComplete,
    connection,
    latencyMs,
    device,
    agentLog,
    onReconnect,
    resources,
    isConnectSheetOpen,
    onConnectSheetOpenChange,
    showAnatomy = false,
}: PlaygroundSessionPageProps) => {
    // See the file header's "ONE CONNECTION ENUM, TWO VOCABULARIES" note — the
    // resource panel only ever asks a binary question.
    const resourcePanelConnection: PlaygroundResourcePanelConnection =
        connection === "connected" ? "connected" : "notConnected"

    const guidePane = (
        <StackV
            gap="flush"
            padding="roomy"
            className="overflow-y-auto"
            classNames={["min-w-0", "flex-1"]}
            anatPart={showAnatomy ? "StackV" : undefined}
            body={
                <PlaygroundStepGuide
                    anatPart="PlaygroundStepGuide"
                    step={step}
                    verifyState={verifyState}
                    onVerify={onVerify}
                    onLeaveComplete={onLeaveGuideComplete}
                    showAnatomy={showAnatomy}
                />
            }
        />
    )

    const resourcePane = (
        <StackV
            gap="flush"
            padding="roomy"
            className="overflow-y-auto @app-xl:w-[24rem]"
            classNames={["w-full", "shrink-0"]}
            anatPart={showAnatomy ? "StackV" : undefined}
            body={
                <PlaygroundResourcePanel
                    anatPart="PlaygroundResourcePanel"
                    connection={resourcePanelConnection}
                    resources={resources}
                    showAnatomy={showAnatomy}
                />
            }
        />
    )

    // The workspace region: two panes side by side, plus the docked sheet
    // anchored (not laid out) against this box — see the file header.
    const workspaceRegion = (
        <>
            <StackH
                gap="section"
                align="start"
                divider
                className="overflow-hidden"
                classNames={["h-full", "min-h-0"]}
                anatPart={showAnatomy ? "StackH" : undefined}
                body={
                    <>
                        {guidePane}
                        {resourcePane}
                    </>
                }
            />
            <StackV
                gap="flush"
                className="absolute inset-x-0 bottom-0 z-10"
                anatPart={showAnatomy ? "StackV" : undefined}
                body={
                    <PlaygroundConnectSheet
                        anatPart="PlaygroundConnectSheet"
                        connection={connection}
                        latencyMs={latencyMs}
                        device={device}
                        agentLog={agentLog}
                        onReconnect={onReconnect}
                        open={isConnectSheetOpen}
                        onOpenChange={onConnectSheetOpenChange}
                        showAnatomy={showAnatomy}
                    />
                }
            />
        </>
    )

    const sessionSections = (
        <>
            <WorkSessionHeader
                anatPart="WorkSessionHeader"
                backLabel={backLabel}
                onBack={onBack}
                title={title}
                counter={counter}
                total={total}
                current={current}
                doneSteps={doneSteps}
                onStepPress={onStepPress}
                finishLabel={finishLabel}
                onFinish={onFinish}
                showAnatomy={showAnatomy}
            />
            <StackV
                gap="flush"
                className="relative"
                classNames={["min-h-0", "flex-1"]}
                anatPart={showAnatomy ? "StackV" : undefined}
                body={workspaceRegion}
            />
        </>
    )

    return <StackV gap="flush" className="h-[calc(100vh-4rem)]" anatPart={showAnatomy ? "StackV" : undefined} body={sessionSections} />
}

export { PlaygroundSessionPage }
